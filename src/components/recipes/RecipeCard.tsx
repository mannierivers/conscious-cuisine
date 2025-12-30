import Link from 'next/link';
import Image from 'next/image';
import { ChefHat, Beaker, ArrowRight } from 'lucide-react';

export default function RecipeCard({ recipe }: { recipe: any }) {
  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {recipe.category || "Conscious Cuisine"}
          </span>
          {/* Replace the top div/icon section with this */}
            <div className="relative h-48 w-full">
              {recipe.imageUrl ? (
                <Image 
                  src={recipe.imageUrl} 
                  alt={recipe.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                  <ChefHat className="text-slate-300" size={40} />
                </div>
              )}
            </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
          {recipe.title}
        </h3>
        
        <p className="text-slate-500 text-sm line-clamp-2 mb-6">
          {recipe.description || "A signature dish focused on flavor and nutritional integrity."}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <ChefHat size={16} />
            <span>Chef Neff Approved</span>
          </div>
          
          <Link 
            href={`/recipes/${recipe.id}`}
            className="flex items-center gap-1 text-emerald-600 font-bold text-sm hover:gap-2 transition-all"
          >
            Explore <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}