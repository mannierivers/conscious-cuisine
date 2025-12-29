"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useConsciousAI } from "@/hooks/useConsciousAI";
import { Loader2, Beaker, ChefHat, Activity, AlertCircle } from "lucide-react";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { getAnalysis, analysis, loading: aiLoading } = useConsciousAI();

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      console.log("🔍 Fetching data for recipe:", id);

      try {
        // 1. Fetch Recipe
        const recipeRef = doc(db, "recipes", id as string);
        const recipeSnap = await getDoc(recipeRef);

        // 2. Fetch User Profile
        const userRef = doc(db, "users", "guest_user_123");
        const userSnap = await getDoc(userRef);

        if (recipeSnap.exists()) {
          setRecipe(recipeSnap.data());
        }

        if (userSnap.exists()) {
          console.log("👤 User data found:", userSnap.data());
          setUserData(userSnap.data());
        } else {
          console.log("⚠️ No user profile found. Using guest defaults.");
          // Set a default object so the button isn't disabled
          setUserData({ name: "Guest", medicalHistory: [] });
        }
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Handler function to make debugging easier
  const handleAIRequest = () => {
    console.log("🤖 AI Request Triggered");
    console.log("Recipe:", recipe.title);
    console.log("History:", userData?.medicalHistory);
    
    getAnalysis(
      recipe, 
      userData?.medicalHistory || [], 
      userData?.name || "Guest"
    );
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!recipe) return <div className="p-10 text-center">Recipe not found.</div>;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      {/* ... Previous Header Code ... */}
      <section className="space-y-4">
        <h1 className="text-4xl font-serif font-bold text-slate-900">{recipe.title}</h1>
        <div className="flex gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1"><ChefHat size={16}/> {recipe.chefName || "Chef Cary Neff"}</span>
          <span className="flex items-center gap-1"><Activity size={16}/> {recipe.difficulty}</span>
        </div>
      </section>

      {/* AI ANALYSIS SECTION */}
      <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-emerald-900 flex items-center gap-2">
              <AlertCircle size={20} /> Conscious Cuisine Insight
            </h3>
            <p className="text-sm text-emerald-700">
              {userData?.medicalHistory?.length > 0 
                ? `Analyzing for: ${userData.medicalHistory.join(", ")}`
                : "No medical conditions set. Analyzing for general wellness."}
            </p>
          </div>
          <button 
            onClick={handleAIRequest}
            // Fix: Only disable if the AI is already loading
            disabled={aiLoading} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {aiLoading ? (
              <span className="flex items-center gap-2 italic">
                <Loader2 size={16} className="animate-spin" /> Consulting Groq...
              </span>
            ) : "Check Safety & Substitutions"}
          </button>
        </div>

        {analysis && (
          <div className="prose prose-emerald max-w-none mt-4 p-6 bg-white rounded-lg shadow-sm border border-emerald-100 animate-in fade-in slide-in-from-top-2">
             {/* Using a cleaner white-space rendering for AI response */}
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
              {analysis}
            </div>
          </div>
        )}
      </section>

      {/* ... Rest of the page (Ingredients/Steps) ... */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-4 text-slate-900">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ing: string, i: number) => (
                <li key={i} className="border-b pb-1 text-slate-700">{ing}</li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
              <Beaker size={18} /> Nutrition Science
            </h4>
            <p className="text-sm text-blue-800 leading-relaxed italic">
              {recipe.nutritionScienceSnippet}
            </p>
          </div>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold mb-4 text-slate-900">Preparation</h3>
          <ol className="space-y-6">
            {recipe.steps?.map((step: string, i: number) => (
              <li key={i} className="flex gap-4">
                <span className="font-bold text-emerald-600 text-2xl leading-none">{i + 1}</span>
                <p className="text-slate-800 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
}