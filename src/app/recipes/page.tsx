"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import RecipeCard from "@/components/recipes/RecipeCard";
import ChefRecommendation from "@/components/recipes/ChefRecommendation";
import { Loader2, Search, Filter, CheckCircle } from "lucide-react";

export default function RecipeListPage() {
  const { profile, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter recipes based on search term
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define the Personalized Badge Object safely
  const getHeaderBadge = () => {
    if (profile?.medicalHistory && profile.medicalHistory.length > 0) {
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
          <p className="text-slate-400 font-medium animate-pulse">Loading Chef Neff's Collection...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Page Header */}
        <header className="pt-16 pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest mb-4 ${badge.classes}`}>
                {profile?.medicalHistory && <CheckCircle size={12} />}
                {badge.label}
              </div>
              <h1 className="text-5xl font-serif font-bold text-slate-900 mb-4">
                The Recipe <span className="text-emerald-600">Library</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
                Explore Chef Cary Neff's collection of flavor-first recipes, 
                each scientifically audited for your clinical nutritional needs.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search ingredients or health goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-700"
              />
            </div>
          </div>
        </header>

        {/* AI Recommendation Hero (Only show if no search is active) */}
        {!searchTerm && recipes.length > 0 && (
          <ChefRecommendation recipes={recipes} />
        )}

        {/* Recipe Grid */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-800">
            {searchTerm ? `Search Results for "${searchTerm}"` : "All Signature Dishes"}
          </h2>
          <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-lg italic">No recipes found matching your search.</p>
          </div>
        )}
      </div>
    </main>
  );
}