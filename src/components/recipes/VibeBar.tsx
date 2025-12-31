"use client";

import { motion } from "framer-motion";
import { Brain, Moon, Zap, ShieldAlert, Sparkles } from "lucide-react";

const VIBES = [
  { id: "brain", label: "Brain Fog", icon: <Brain size={16} />, color: "border-purple-200 text-purple-700 bg-purple-50", tag: "Cognitive" },
  { id: "sleep", label: "Deep Sleep", icon: <Moon size={16} />, color: "border-indigo-200 text-indigo-700 bg-indigo-50", tag: "Low Glycemic" },
  { id: "energy", label: "Pure Energy", icon: <Zap size={16} />, color: "border-amber-200 text-amber-700 bg-amber-50", tag: "High Protein" },
  { id: "stress", label: "Stress Relief", icon: <ShieldAlert size={16} />, color: "border-rose-200 text-rose-700 bg-rose-50", tag: "Anti-Inflammatory" },
];

export default function VibeBar({ activeVibe, onVibeChange }: { activeVibe: string | null, onVibeChange: (vibe: any) => void }) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button 
        onClick={() => onVibeChange(null)}
        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${!activeVibe ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200'}`}
      >
        All Recipes
      </button>
      {VIBES.map((vibe) => (
        <button
          key={vibe.id}
          onClick={() => onVibeChange(vibe)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${activeVibe === vibe.id ? vibe.color : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
        >
          {vibe.icon}
          {vibe.label}
        </button>
      ))}
    </div>
  );
}