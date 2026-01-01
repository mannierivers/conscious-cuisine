"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChefHat, Beaker, ArrowRight, Microscope, Play } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";

interface Recipe {
  id: string;
  title: string;
  imageUrl?: string;
  videoUrl?: string;
  category?: string;
  description?: string;
  nutritionScienceSnippet?: string;
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { profile } = useAuth();
  const [imgSrc, setImgSrc] = useState(recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000");

  const isMatch = profile?.medicalHistory?.some((condition: string) => 
    recipe.category?.toLowerCase().includes(condition.toLowerCase())
  );

  return (
    <div className="group bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative">
      
      {/* Visual Header */}
      <div className="relative h-64 w-full overflow-hidden bg-slate-100">
        <Image 
          src={imgSrc} alt={recipe.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000"
          onError={() => setImgSrc("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000")}
        />
        
        {/* VIDEO INDICATOR */}
        {recipe.videoUrl && (
          <div className="absolute top-5 right-5 z-20 bg-emerald-500/90 backdrop-blur-md p-2 rounded-full text-white shadow-lg">
            <Play size={14} fill="white" />
          </div>
        )}

        <div className="absolute top-5 left-5 z-20">
          <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm ${isMatch ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-white/90 text-slate-600 border-slate-200'}`}>
            {isMatch ? 'Perfect Match' : 'Conscious Cuisine'}
          </span>
        </div>

        {/* Hover Science Snap */}
        <div className="absolute inset-0 bg-slate-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center p-8 text-center z-30">
          <Microscope className="mx-auto mb-3 text-emerald-400" size={28} />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-emerald-400 italic">Molecular Insight</p>
          <p className="text-sm font-serif italic text-white leading-relaxed line-clamp-4">
            {recipe.nutritionScienceSnippet || "Clinical audit in progress..."}
          </p>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{recipe.category || "Signature Series"}</p>
          <Beaker className="text-slate-200 group-hover:text-blue-400 transition-colors" size={18} />
        </div>
        
        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3 line-clamp-1 group-hover:text-emerald-700 transition-colors">{recipe.title}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-8 leading-relaxed font-light">{recipe.description}</p>

        {/* Metrics Box */}
        <div className="mt-auto">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8">
            {['Sodium', 'Fiber', 'Glycemic'].map((m) => (
              <div key={m} className="flex flex-col items-center">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter mb-1">{m}</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">{m === 'Sodium' ? 'Low' : m === 'Fiber' ? 'High' : 'Bal.'}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center"><ChefHat size={14} className="text-slate-400" /></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Cary Neff</span>
            </div>
            <Link href={`/recipes/${recipe.id}`} className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-emerald-600 transition-all active:scale-95 flex items-center gap-2">
              Explore <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}