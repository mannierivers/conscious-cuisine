"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import RecipeCard from "@/components/recipes/RecipeCard";
import { Loader2, Search, Filter } from "lucide-react";

export default function RecipeListPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="min-h-screen bg-slate-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-5xl font-serif font-bold text-slate-900 mb-4">
            Conscious Cuisine <span className="text-emerald-600">Library</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl">
            Scientifically analyzed recipes curated by Chef Cary Neff to support your medical journey without sacrificing flavor.
          </p>
        </header>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by ingredient or health goal..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-white px-6 py-3 rounded-xl border border-slate-200 font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* Grid Layout */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-600" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

        {recipes.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-500">No recipes found. Start by adding one in the CMS.</p>
          </div>
        )}
      </div>
    </main>
  );
}