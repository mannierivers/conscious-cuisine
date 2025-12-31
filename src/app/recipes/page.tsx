"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

// Components
import RecipeCard from "@/components/recipes/RecipeCard";
import ChefRecommendation from "@/components/recipes/ChefRecommendation";
import FridgeConcierge from "@/components/recipes/FridgeConcierge";
import VibeBar from "@/components/recipes/VibeBar";
import RecipeIndex from "@/components/recipes/RecipeIndex";
import ClinicalStats from "@/components/recipes/ClinicalStats";

// Icons
import { Loader2, Search, CheckCircle, Sparkles, Snowflake } from "lucide-react";

const MEDICAL_FILTERS = [
  { id: "heart", label: "Heart Healthy", icon: "❤️" },
  { id: "diabetes", label: "Glycemic Control", icon: "🩸" },
  { id: "inflammation", label: "Anti-Inflammatory", icon: "🌿" },
  { id: "renal", label: "Renal Support", icon: "💎" },
  { id: "gut", label: "Gut Health", icon: "🧬" },
];

export default function RecipeListPage() {
  // 1. HOOKS
  const { profile, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [activeMedicalFilter, setActiveMedicalFilter] = useState<string | null>(null);
  const [activeVibe, setActiveVibe] = useState<any>(null);

  // 2. DATA FETCHING
  useEffect(() => {
    async function getRecipes() {
      try {
        const q = query(collection(db, "recipes"), orderBy("title", "asc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    }
    getRecipes();
  }, []);

  // 3. MASTER FILTERING LOGIC
  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      const matchesSearch = !searchTerm || 
                           r.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           r.ingredients?.some((i: string) => i.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesLetter = !activeLetter || r.title?.toUpperCase().startsWith(activeLetter);
      
      const matchesMedical = !activeMedicalFilter || 
                            r.category?.toLowerCase().includes(activeMedicalFilter.toLowerCase());

      const vTag = activeVibe?.tag?.toLowerCase() || "";
      const matchesVibe = !activeVibe || 
                         r.category?.toLowerCase().includes(vTag) || 
                         r.description?.toLowerCase().includes(vTag);

      return matchesSearch && matchesLetter && matchesMedical && matchesVibe;
    });
  }, [recipes, searchTerm, activeLetter, activeMedicalFilter, activeVibe]);

  const badge = profile?.medicalHistory?.length 
    ? { label: `Optimized for ${profile.medicalHistory[0]}`, classes: "bg-emerald-50 text-emerald-700 border-emerald-100" }
    : { label: "Conscious Cuisine Library", classes: "bg-slate-50 text-slate-500 border-slate-200" };

  if (loading || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- NON-STICKY HEADER --- */}
        <header className="pt-16 pb-8 max-w-2xl">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest mb-4 ${badge.classes}`}>
            {profile?.medicalHistory && <CheckCircle size={12} />}
            {badge.label}
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-4">
            The <span className="text-emerald-600 italic">Library</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Chef Cary Neff’s complete repository of clinical flavor.
          </p>
        </header>

        {/* --- STICKY CONTROL BAR --- */}
        {/* We use top-16 assuming the main Navbar is 64px tall */}
        <div className="sticky top-16 z-40 bg-slate-50/80 backdrop-blur-md -mx-6 px-6 py-4 border-b border-slate-200 transition-all">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-7xl mx-auto">
            {/* Sticky Search */}
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500" size={18} />
              <input 
                type="text" 
                placeholder="Quick search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm"
              />
            </div>

            {/* Sticky Medical Chips */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-hide">
              <button 
                onClick={() => setActiveMedicalFilter(null)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase border transition-all whitespace-nowrap ${!activeMedicalFilter ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200'}`}
              >
                All
              </button>
              {MEDICAL_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveMedicalFilter(activeMedicalFilter === f.label ? null : f.label)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                    activeMedicalFilter === f.label ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-500 border-slate-200 hover:border-emerald-500"
                  }`}
                >
                  <span>{f.icon}</span> {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- MAIN SCROLLING CONTENT --- */}
        <div className="mt-8">
          <ClinicalStats recipes={recipes} />
          <FridgeConcierge recipes={recipes} />

          <div className="flex flex-col lg:flex-row gap-12 border-t border-slate-200 pt-12">
            
            {/* A-Z Sidebar */}
            <div className="hidden lg:block sticky top-48 h-fit">
               <RecipeIndex 
                  recipes={recipes} 
                  activeLetter={activeLetter} 
                  onLetterClick={(l) => setActiveLetter(l || null)} 
               />
            </div>

            <div className="flex-1">
              {/* Vibe Bar (Not sticky to avoid screen clutter) */}
              <div className="mb-10">
                <VibeBar activeVibe={activeVibe?.id || null} onVibeChange={(v) => setActiveVibe(v)} />
              </div>

              {/* Recommendation Hero */}
              {!searchTerm && !activeVibe && !activeMedicalFilter && !activeLetter && (
                 <ChefRecommendation recipes={recipes} />
              )}

              {/* Grid Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif font-bold text-slate-800">
                  {activeLetter ? `Index: ${activeLetter}` : "Signature Dishes"}
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredRecipes.length} Matches</p>
              </div>

              {/* THE GRID */}
              {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-serif italic text-xl">No specific matches found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}