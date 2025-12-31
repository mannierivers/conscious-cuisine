"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import RecipeCard from "@/components/recipes/RecipeCard";
import ChefRecommendation from "@/components/recipes/ChefRecommendation";
import FridgeConcierge from "@/components/recipes/FridgeConcierge";
import VibeBar from "@/components/recipes/VibeBar";
import { Loader2, Search, CheckCircle, Sparkles, Filter } from "lucide-react";

const MEDICAL_FILTERS = [
  { id: "heart", label: "Heart Healthy", icon: "❤️" },
  { id: "diabetes", label: "Glycemic Control", icon: "🩸" },
  { id: "inflammation", label: "Anti-Inflammatory", icon: "🌿" },
  { id: "renal", label: "Renal Support", icon: "💎" },
  { id: "gut", label: "Gut Health", icon: "🧬" },
];

export default function RecipeListPage() {
  // --- 1. ALL HOOKS MUST BE AT THE TOP ---
  const { profile, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeVibe, setActiveVibe] = useState<any>(null);
  const [activeMedicalFilter, setActiveMedicalFilter] = useState<string | null>(null);

  // Fetch Data
  useEffect(() => {
    async function getRecipes() {
      try {
        const q = query(collection(db, "recipes"), orderBy("title", "asc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    }
    getRecipes();
  }, []);

  // --- 2. DERIVED STATE (Logic after hooks) ---
  
  // Consolidate all filtering into one useMemo for performance and stability
  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           r.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesVibe = !activeVibe || 
                         r.category?.toLowerCase().includes(activeVibe.tag.toLowerCase()) || 
                         r.description?.toLowerCase().includes(activeVibe.tag.toLowerCase());

      const matchesMedical = !activeMedicalFilter || 
                            r.category?.toLowerCase().includes(activeMedicalFilter.toLowerCase());

      return matchesSearch && matchesVibe && matchesMedical;
    });
  }, [recipes, searchTerm, activeVibe, activeMedicalFilter]);

  const getHeaderBadge = () => {
    if (profile?.medicalHistory?.length > 0) {
      return {
        label: `Optimized for ${profile.medicalHistory[0]}`,
        classes: "bg-emerald-50 text-emerald-700 border-emerald-100"
      };
    }
    return {
      label: "Conscious Cuisine Library",
      classes: "bg-slate-50 text-slate-500 border-slate-200"
    };
  };

  const badge = getHeaderBadge();

  // --- 3. EARLY RETURNS (Must be after all hooks) ---
  if (loading || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-600 mx-auto mb-4" size={48} />
          <p className="text-slate-400 font-medium animate-pulse uppercase tracking-widest text-[10px]">Initializing Clinical Library...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <header className="pt-16 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest mb-4 ${badge.classes}`}>
              {profile?.medicalHistory?.length > 0 && <CheckCircle size={12} />}
              {badge.label}
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-4">
              Conscious <span className="text-emerald-600 italic">Library</span>
            </h1>
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-700"
            />
          </div>
        </header>

        {/* 1. Fridge Concierge */}
        <FridgeConcierge recipes={recipes} />

        {/* 2. Medical Filter Chips */}
        <div className="mb-8 overflow-x-auto pb-2 flex gap-3 scrollbar-hide">
          {MEDICAL_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveMedicalFilter(activeMedicalFilter === f.label ? null : f.label)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-bold transition-all whitespace-nowrap ${
                activeMedicalFilter === f.label 
                ? "bg-slate-900 text-white border-slate-900 shadow-lg" 
                : "bg-white text-slate-600 border-slate-200 hover:border-emerald-500"
              }`}
            >
              <span>{f.icon}</span> {f.label}
            </button>
          ))}
        </div>

        {/* 3. AI Hero */}
        {!searchTerm && !activeVibe && !activeMedicalFilter && (
          <ChefRecommendation recipes={recipes} />
        )}

        {/* 4. Vibe Bar */}
        <div className="mt-12 border-t border-slate-200 pt-10">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
            <Sparkles size={14} className="text-emerald-500" /> Filter by Mood
          </div>
          <VibeBar activeVibe={activeVibe} onVibeChange={(v) => setActiveVibe(v ? v.id : null)} />
        </div>

        {/* 5. The Grid */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-slate-800">
              {searchTerm ? `Results for "${searchTerm}"` : "Signature Collection"}
            </h2>
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 text-lg italic font-serif">
                No recipes match these specific filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}