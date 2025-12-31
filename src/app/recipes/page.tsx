"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import RecipeCard from "@/components/recipes/RecipeCard";
import ChefRecommendation from "@/components/recipes/ChefRecommendation";
import FridgeConcierge from "@/components/recipes/FridgeConcierge";
import VibeBar from "@/components/recipes/VibeBar";
import { Loader2, Search, CheckCircle, Sparkles } from "lucide-react";

export default function RecipeListPage() {
  const { profile, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeVibe, setActiveVibe] = useState<any>(null);

  // 1. Fetch data from Firestore
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
        setFilteredRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    }
    getRecipes();
  }, []);

  // 2. Handle Vibe/Mood Filtering
  const handleVibeChange = (vibe: any) => {
    setSearchTerm(""); // Clear search when picking a vibe
    if (!vibe) {
      setActiveVibe(null);
      setFilteredRecipes(recipes);
      return;
    }
    setActiveVibe(vibe.id);
    const filtered = recipes.filter(r => 
      r.category?.toLowerCase().includes(vibe.tag.toLowerCase()) || 
      r.description?.toLowerCase().includes(vibe.tag.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  // 3. Handle Search Input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setActiveVibe(null); // Clear vibe when searching
    const filtered = recipes.filter(r => 
      r.title.toLowerCase().includes(term) || 
      r.category?.toLowerCase().includes(term)
    );
    setFilteredRecipes(filtered);
  };

  // 4. Personalized Badge Logic
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

  if (loading || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-600 mx-auto mb-4" size={48} />
          <p className="text-slate-400 font-medium animate-pulse uppercase tracking-widest text-xs">Clinical Kitchen Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER SECTION --- */}
        <header className="pt-16 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest mb-4 ${badge.classes}`}>
              {profile?.medicalHistory?.length > 0 && <CheckCircle size={12} />}
              {badge.label}
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-4">
              Conscious <span className="text-emerald-600 italic">Library</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              Chef Cary Neff’s signature collection. Use the tools below to find the perfect molecular match for your fridge, your mood, or your medical history.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
            />
          </div>
        </header>

        {/* --- 1. FRIDGE CONCIERGE (The Interaction Piece) --- */}
        <FridgeConcierge recipes={recipes} />

        {/* --- 2. AI RECOMMENDATION HERO (The Personalization Piece) --- */}
        {!searchTerm && !activeVibe && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <ChefRecommendation recipes={recipes} />
          </div>
        )}

        {/* --- 3. THE VIBE BAR (The Emotional Filtering Piece) --- */}
        <div className="mt-16 border-t border-slate-200 pt-12">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">
            <Sparkles size={14} className="text-emerald-500" /> Curate by Biological Need
          </div>
          <VibeBar activeVibe={activeVibe} onVibeChange={handleVibeChange} />
        </div>

        {/* --- 4. THE RECIPE GRID --- */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-slate-800">
              {searchTerm ? `Results for "${searchTerm}"` : activeVibe ? "Curated Matches" : "Complete Collection"}
            </h2>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {filteredRecipes.length} Dishes Found
            </div>
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
                Chef Cary is still clinicaly auditing recipes for this selection.
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}