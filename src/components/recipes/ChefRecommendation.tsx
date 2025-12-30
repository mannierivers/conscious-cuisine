"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useConsciousAI } from "@/hooks/useConsciousAI";
import { Sparkles, ChefHat, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ChefRecommendation({ recipes }: { recipes: any[] }) {
  const { profile } = useAuth();
  const { getAnalysis, analysis, loading } = useConsciousAI();
  const [recommendedRecipe, setRecommendedRecipe] = useState<any>(null);

  useEffect(() => {
    if (profile && recipes.length > 0 && !recommendedRecipe) {
      // Pick a random recipe to recommend or one matching their first condition
      const match = recipes.find(r => r.category === profile.medicalHistory?.[0]) || recipes[0];
      setRecommendedRecipe(match);
    }
  }, [profile, recipes, recommendedRecipe]);

  const handleGetInsight = () => {
    getAnalysis(
      recommendedRecipe, 
      profile?.medicalHistory || [], 
      profile?.name || "Guest"
    );
  };

  if (!profile || !recommendedRecipe) return null;

  return (
    <section className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl mb-12 border border-slate-800">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image Side */}
        <div className="relative h-64 md:h-auto overflow-hidden">
          {recommendedRecipe.imageUrl ? (
            <Image 
              src={recommendedRecipe.imageUrl} 
              alt={recommendedRecipe.title} 
              fill 
              className="object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
              <ChefHat size={64} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent"></div>
        </div>

        {/* Content Side */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-4">
            <Sparkles size={16} /> Personalized for Your Health
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Chef’s Choice: {recommendedRecipe.title}
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Based on your history of <span className="text-slate-200 font-bold">{profile.medicalHistory?.join(", ")}</span>, 
            Cary recommends this dish for its anti-inflammatory properties and glycemic balance.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link 
              href={`/recipes/${recommendedRecipe.id}`}
              className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              View Recipe <ArrowRight size={18} />
            </Link>
            
            <button 
              onClick={handleGetInsight}
              disabled={loading}
              className="bg-slate-800 text-slate-200 px-8 py-3 rounded-full font-bold hover:bg-slate-700 transition-all border border-slate-700"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Why this for me?"}
            </button>
          </div>

          {analysis && (
            <div className="mt-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 text-sm text-slate-300 italic leading-relaxed animate-in fade-in slide-in-from-top-2">
              {analysis}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}