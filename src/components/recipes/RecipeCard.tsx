"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChefHat, Beaker, ArrowRight, Microscope } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";

interface Recipe {
  id: string;
  title: string;
  imageUrl?: string;
  category?: string;
  description?: string;
  nutritionScienceSnippet?: string;
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { profile } = useAuth();
  
  // High-fidelity fallback image
  const [imageSrc, setImageSrc] = useState(recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop");

  const getBadgeTheme = () => {
    if (!profile?.medicalHistory?.length) {
      return { styles: 'bg-white/90 text-slate-600 border-slate-200', label: 'Conscious Cuisine' };
    }
    const isMatch = profile.medicalHistory.some((condition: string) => 
      recipe.category?.toLowerCase().includes(condition.toLowerCase())
    );
    if (isMatch) {
      return { styles: 'bg-emerald-500 text-white border-emerald-400 shadow-lg', label: 'Perfect Match' };
    }
    return { styles: 'bg-blue-50/90 text-blue-700 border-blue-100 backdrop-blur-sm', label: 'Physician Reviewed' };
  };

  const badge = getBadgeTheme();

  return (
    <div className="group bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      <div className="relative h-64 w-full overflow-hidden bg-slate-100">
        <Image 
          src={imageSrc} 
          alt={recipe.title} 
          fill 
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-1000"
          onError={() => setImageSrc("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop")}
        />

        <div className="absolute top-5 left-5 z-10">
          <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em] border ${badge.styles} transition-colors duration-300`}>
            {badge.label}
          </span>
        </div>

        <div className="absolute inset-0 bg-emerald-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center p-8 text-white text-center z-20">
          <Microscope className="mx-auto mb-3 text-emerald-400" size={28} />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-emerald-400">Molecular Highlight</p>
          <p className="text-sm font-serif italic leading-relaxed line-clamp-4">
            {recipe.nutritionScienceSnippet || "Clinical audit in progress..."}
          </p>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
            {recipe.category || "Signature Dish"}
          </p>
          <Beaker className="text-slate-300 group-hover:text-blue-400 transition-colors" size={18} />
        </div>
        
        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight line-clamp-1">
          {recipe.title}
        </h3>
        
        <p className="text-slate-500 text-sm line-clamp-2 mb-8 leading-relaxed">
          {recipe.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8">
            <div className="flex flex-col items-center flex-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Sodium</span>
              <span className="text-[11px] font-bold text-emerald-600">LOW</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Fiber</span>
              <span className="text-[11px] font-bold text-emerald-600">HIGH</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Glycemic</span>
              <span className="text-[11px] font-bold text-emerald-600">BALANCED</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                <ChefHat size={14} className="text-slate-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Cary Neff</span>
            </div>
            
            <Link 
              href={`/recipes/${recipe.id}`}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-emerald-600 transition-all active:scale-95 shadow-lg group/btn"
            >
              Explore <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}