"use client";

import { motion } from "framer-motion";

interface RecipeIndexProps {
  recipes: any[];
  onLetterClick: (letter: string) => void;
  activeLetter: string | null;
}

export default function RecipeIndex({ recipes, onLetterClick, activeLetter }: RecipeIndexProps) {
  // Generate unique starting letters from the current recipe list
  const letters = Array.from(new Set(recipes.map(r => r.title[0].toUpperCase()))).sort();

  return (
    <div className="hidden lg:flex flex-col gap-2 sticky top-32 h-fit pr-8 border-r border-slate-200">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">A-Z Index</p>
      <button 
        onClick={() => onLetterClick("")}
        className={`text-left text-xs font-bold transition-all ${!activeLetter ? 'text-emerald-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
      >
        ALL
      </button>
      {letters.map(letter => (
        <button
          key={letter}
          onClick={() => onLetterClick(letter)}
          className={`text-left text-sm font-serif font-bold transition-all ${activeLetter === letter ? 'text-emerald-600 scale-125 pl-2' : 'text-slate-300 hover:text-slate-900'}`}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}