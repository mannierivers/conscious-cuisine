"use client";
import { Zap, Shield, Heart, Brain } from "lucide-react";

export default function MolecularMap({ category }: { category: string }) {
  const getMicroData = () => {
    switch(category) {
      case "Anti-Inflammatory": 
        return { molecule: "Curcumin", benefit: "Cytokine Inhibition", icon: <Shield className="text-orange-500" /> };
      case "Heart Healthy": 
        return { molecule: "Nitrates", benefit: "Vasodilation", icon: <Heart className="text-red-500" /> };
      case "Brain Health": 
        return { molecule: "Omega-3", benefit: "Neuro-protection", icon: <Brain className="text-blue-500" /> };
      default: 
        return { molecule: "Phytochemicals", benefit: "General Wellness", icon: <Zap className="text-emerald-500" /> };
    }
  };

  const data = getMicroData();

  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative group">
      <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
        {data.icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-4">Molecular Superstar</p>
      <h4 className="text-2xl font-serif font-bold mb-1">{data.molecule}</h4>
      <p className="text-slate-400 text-xs mb-4 uppercase tracking-widest">{data.benefit}</p>
      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 w-3/4"></div>
      </div>
    </div>
  );
}