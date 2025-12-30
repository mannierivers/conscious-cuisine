"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ChefHat, Beaker, ArrowRight } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";

// 1. Defining the interface for the recipe to satisfy TypeScript
interface Recipe {
  id: string;
  title: string; // We use title, not name
  imageUrl?: string;
  category?: string;
  description?: string;
  medicalHistory?: string[];
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { profile } = useAuth();

  // 2. Renamed 'status' to 'badgeTheme' to avoid the "deprecated" global status error
  const getBadgeTheme = () => {
    if (!profile?.medicalHistory?.length) {
      return { 
        styles: 'bg-slate-100 text-slate-600 border-slate-200', 
        label: 'Conscious Cuisine' 
      };
    }
    
    // Check if the recipe category matches the user's primary medical condition
    const isMatch = profile.medicalHistory.some((condition: string) => 
      recipe.category?.toLowerCase().includes(condition.toLowerCase())
    );

    if (isMatch) {
      return { 
        styles: 'bg-emerald-100 text-emerald-700 border-emerald-200', 
        label: 'Perfect Match' 
      };
    }

    return { 
      styles: 'bg-blue-50 text-blue-700 border-blue-100', 
      label: 'Physician Reviewed' 
    };
  };

  const badge = getBadgeTheme();

  return (
    <div className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">
      
      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        {recipe.imageUrl ? (
          <Image 
            src={recipe.imageUrl} 
            alt={recipe.title} // Fixed: using .title
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="text-slate-200" size={48} />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border backdrop-blur-md ${badge.styles}`}>
            {badge.label}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-tighter">
            {recipe.category}
          </p>
          <Beaker className="text-slate-300 group-hover:text-blue-400 transition-colors" size={18} />
        </div>
        
        {/* Fixed: using recipe.title instead of recipe.name */}
        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
          {recipe.title}
        </h3>
        
        <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed">
          {recipe.description || "A masterfully crafted dish focused on clinical integrity and exceptional flavor."}
        </p>

        <div className="flex items-center justify-between pt-5 border-t border-slate-50">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ChefHat size={14} />
            <span className="font-semibold uppercase tracking-widest text-[9px]">Chef Cary Neff Approved</span>
          </div>
          
          <Link 
            href={`/recipes/${recipe.id}`}
            className="p-2 bg-slate-900 text-white rounded-full hover:bg-emerald-600 transition-all active:scale-90"
          >
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}