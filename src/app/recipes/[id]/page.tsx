"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { useConsciousAI } from "@/hooks/useConsciousAI";

// Components & UI
import MolecularMap from "@/components/recipes/MolecularMap";
import ScientistAudit from "@/components/recipes/ScientistAudit";
import { 
  Loader2, Beaker, ChefHat, Activity, 
  AlertCircle, Play, ChevronLeft, 
  Users, Scale, Zap, ShieldCheck, 
  Heart, Flame, Star, Sparkles
} from "lucide-react";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // Hooks
  const { profile: userData } = useAuth();
  const { getAnalysis, analysis, loading: aiLoading } = useConsciousAI();
  
  // State
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState(4); // Default to 4
  const [imageError, setImageError] = useState(false);

  // 1. Fetch Data
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
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [id]);

  // 2. Ingredient Scaling Logic
  // This finds numbers in strings and scales them based on serving ratio
  const scaleIngredient = (ing: string) => {
    const ratio = servings / 4; // Base recipe is calculated for 4
    return ing.replace(/(\d+(\.\d+)?)/g, (match) => {
      const val = parseFloat(match) * ratio;
      return val % 1 === 0 ? val.toString() : val.toFixed(1);
    });
  };

  // 3. AI Safety Request
  const handleAIRequest = () => {
    if (!recipe) return;
    getAnalysis(recipe, userData?.medicalHistory || [], userData?.name || "Guest");
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-600" size={48} />
    </div>
  );

  if (!recipe) return <div className="p-20 text-center font-serif text-2xl">Recipe not found.</div>;

  return (
    <main className="min-h-screen bg-white pb-32">
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold text-sm uppercase tracking-widest">
          <ChevronLeft size={18} /> Back to Library
        </button>
        <div className="flex items-center gap-4">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clinical ID: {id?.toString().slice(0,8)}</span>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 pt-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-[500px] w-full rounded-[3rem] overflow-hidden shadow-2xl group">
          <Image 
            src={imageError ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000" : recipe.imageUrl} 
            alt={recipe.title} 
            fill 
            priority
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-10 left-10">
            <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block shadow-lg">
              {recipe.category}
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white leading-tight">
              {recipe.title}
            </h1>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-8">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cook Time</span>
                <span className="text-xl font-serif font-bold text-slate-900">25 Mins</span>
             </div>
             <div className="h-8 w-px bg-slate-100"></div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Difficulty</span>
                <span className="text-xl font-serif font-bold text-slate-900 capitalize">{recipe.difficulty}</span>
             </div>
             <div className="h-8 w-px bg-slate-100"></div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audited By</span>
                <span className="text-xl font-serif font-bold text-emerald-600 italic">B. Neff, CFS</span>
             </div>
          </div>

          <p className="text-xl text-slate-500 leading-relaxed font-light">
            {recipe.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link 
              href={`/recipes/${id}/cook`}
              className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95"
            >
              <Play size={20} fill="currentColor" /> Start Guided Cooking
            </Link>
            <button 
              onClick={handleAIRequest}
              disabled={aiLoading}
              className="border-2 border-slate-900 text-slate-900 px-10 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50"
            >
              {aiLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
              Clinical Safety Check
            </button>
          </div>
        </div>
      </section>

      {/* --- PERSONALIZED AI INSIGHT --- */}
      {analysis && (
        <section className="max-w-4xl mx-auto px-6 mt-16">
          <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Zap size={120} className="text-emerald-900" />
            </div>
            <div className="relative z-10">
              <h3 className="text-emerald-900 font-bold flex items-center gap-2 mb-6 uppercase tracking-widest text-xs">
                <Sparkles size={16} /> Personal Intervention for {userData?.name || 'Guest'}
              </h3>
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-serif text-lg">
                {analysis}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- MOLECULAR MAP & AUDIT (Breanna's Logic) --- */}
      <section className="max-w-7xl mx-auto px-6 mt-20 grid md:grid-cols-2 gap-8">
        <MolecularMap category={recipe.category} />
        <ScientistAudit snippet={recipe.nutritionScienceSnippet} />
      </section>

      {/* --- THE KITCHEN GRID --- */}
      <section className="max-w-7xl mx-auto px-6 mt-24 grid lg:grid-cols-3 gap-16">
        
        {/* Ingredients Column */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
            <h3 className="text-3xl font-serif font-bold text-slate-900">Ingredients</h3>
            {/* Dynamic Scaling Control */}
            <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-full">
              <button onClick={() => setServings(Math.max(1, servings - 1))} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600">-</button>
              <span className="text-[10px] font-black uppercase w-14 text-center">{servings} Serves</span>
              <button onClick={() => setServings(servings + 1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600">+</button>
            </div>
          </div>
          <ul className="space-y-4">
            {recipe.ingredients?.map((ing: string, i: number) => (
              <li key={i} className="flex items-start gap-4 text-slate-700 group">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                <span className="text-lg leading-snug">{scaleIngredient(ing)}</span>
              </li>
            ))}
          </ul>

          {/* Chef's Tip Box */}
          <div className="mt-12 bg-amber-50 rounded-[2rem] p-8 border border-amber-100">
             <h4 className="text-amber-900 font-bold flex items-center gap-2 mb-4 uppercase tracking-widest text-xs">
                <ChefHat size={16} /> Cary's Conscious Tip
             </h4>
             <p className="text-amber-800 italic leading-relaxed">
                "{recipe.chefTips || "Remember: Season with intention. The goal is to maximize flavor while respecting the clinical profile of the ingredients."}"
             </p>
          </div>
        </div>

        {/* Preparation Column */}
        <div className="lg:col-span-2">
          <h3 className="text-3xl font-serif font-bold text-slate-900 border-b border-slate-200 pb-6 mb-8">Preparation</h3>
          <div className="space-y-12">
            {recipe.steps?.map((step: string, i: number) => (
              <div key={i} className="flex gap-8 group">
                <span className="text-6xl font-serif font-black text-slate-100 group-hover:text-emerald-50 transition-colors duration-500">{i + 1}</span>
                <div className="pt-2">
                  <p className="text-xl text-slate-800 leading-relaxed font-light">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}