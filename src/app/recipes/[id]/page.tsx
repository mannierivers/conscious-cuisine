"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth"; // Important: Added this
import { useConsciousAI } from "@/hooks/useConsciousAI"; // Important: Added this
import { 
  Loader2, 
  Beaker, 
  ChefHat, 
  Activity, 
  AlertCircle, 
  Play 
} from "lucide-react";

export default function RecipeDetailPage() {
  const { id } = useParams();
  
  // 1. Initialize Hooks
  const { profile: userData } = useAuth(); // We map 'profile' to 'userData' for your UI
  const { getAnalysis, analysis, loading: aiLoading } = useConsciousAI();
  
  // 2. Local State
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 3. Fetch Recipe Data
  useEffect(() => {
    async function fetchRecipe() {
      if (!id) return;
      try {
        const docRef = doc(db, "recipes", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecipe(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [id]);

  // 4. Define the missing AI handler function
  const handleAIRequest = () => {
    if (!recipe) return;
    getAnalysis(
      recipe, 
      userData?.medicalHistory || [], 
      userData?.name || "Guest"
    );
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-emerald-600" size={48} />
    </div>
  );

  if (!recipe) return <div className="p-20 text-center">Recipe not found.</div>;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <section className="space-y-4">
        <h1 className="text-4xl font-serif font-bold text-slate-900">{recipe.title}</h1>
        <div className="flex gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1"><ChefHat size={16}/> {recipe.chefName || "Chef Cary Neff"}</span>
          <span className="flex items-center gap-1"><Activity size={16}/> {recipe.difficulty || "Medium"}</span>
        </div>
      </section>

      {/* AI ANALYSIS & COOK MODE SECTION */}
      <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
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
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleAIRequest}
              disabled={aiLoading} 
              className="bg-emerald-100 text-emerald-700 px-6 py-2.5 rounded-full font-bold hover:bg-emerald-200 transition-all disabled:opacity-50"
            >
              {aiLoading ? "Consulting Groq..." : "Check Safety"}
            </button>

            <Link 
              href={`/recipes/${id}/cook`}
              className="bg-emerald-600 text-white px-8 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
            >
              <Play size={18} fill="currentColor" /> Start Guided Cooking
            </Link>
          </div>
        </div>

        {analysis && (
          <div className="prose prose-emerald max-w-none mt-4 p-6 bg-white rounded-lg shadow-sm border border-emerald-100 animate-in fade-in slide-in-from-top-2">
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
              {analysis}
            </div>
          </div>
        )}
      </section>

      {/* Recipe Body */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-4 text-slate-900 border-b pb-2">Ingredients</h3>
            <ul className="space-y-3">
              {recipe.ingredients?.map((ing: string, i: number) => (
                <li key={i} className="text-slate-700 flex items-start gap-2">
                  <span className="text-emerald-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
              <Beaker size={18} /> Nutrition Science
            </h4>
            <p className="text-sm text-blue-800 leading-relaxed italic">
              {recipe.nutritionScienceSnippet}
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-xl font-bold mb-4 text-slate-900 border-b pb-2">Preparation</h3>
          <ol className="space-y-6">
            {recipe.steps?.map((step: string, i: number) => (
              <li key={i} className="flex gap-4">
                <span className="font-serif font-bold text-emerald-600 text-2xl leading-none">{i + 1}</span>
                <p className="text-slate-800 leading-relaxed text-lg">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
}