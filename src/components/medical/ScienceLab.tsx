"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Beaker, Sparkles, Activity, ShieldPlus, Zap } from "lucide-react";

const INGREDIENTS = ["Red Beets", "Turmeric Root", "Wild Salmon", "Cruciferous Greens", "Raw Cacao"];
const CONDITIONS = ["Hypertension", "Type 2 Diabetes", "Inflammation", "Cognitive Decline", "Gut Health"];

export default function ScienceLab() {
  const [selectedIng, setSelectedIng] = useState(INGREDIENTS[0]);
  const [selectedCond, setSelectedCond] = useState(CONDITIONS[0]);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeSynergy = async () => {
    setLoading(true);
    setInsight("");
    try {
      const res = await fetch("/api/science-simulator", {
        method: "POST",
        body: JSON.stringify({ ingredient: selectedIng, condition: selectedCond }),
      });
      const data = await res.json();
      setInsight(data.insight);
    } catch (err) {
      setInsight("Connection to the clinical engine failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-800">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-3 bg-emerald-500/20 rounded-2xl">
          <Beaker className="text-emerald-400" size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-serif font-bold text-white tracking-tight">Clinical Synergy Simulator</h3>
          <p className="text-slate-400 text-sm">Cross-reference Cary's ingredients with clinical pathology.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Selection Controls */}
        <div className="space-y-8">
          <div>
            <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-4 block">Select Ingredient</label>
            <div className="flex flex-wrap gap-2">
              {INGREDIENTS.map(ing => (
                <button
                  key={ing}
                  onClick={() => setSelectedIng(ing)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedIng === ing ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {ing}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4 block">Select Condition</label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(cond => (
                <button
                  key={cond}
                  onClick={() => setSelectedCond(cond)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCond === cond ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={analyzeSynergy}
            disabled={loading}
            className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all active:scale-95"
          >
            {loading ? <Activity className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? "Analyzing Molecular Bonds..." : "Analyze Clinical Synergy"}
          </button>
        </div>

        {/* AI Result Area */}
        <div className="relative min-h-[300px] flex items-center justify-center border-2 border-dashed border-slate-800 rounded-[2rem] p-8">
          <AnimatePresence mode="wait">
            {!insight && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-slate-600">
                <ShieldPlus size={48} className="mx-auto mb-4 opacity-20" />
                <p>Select parameters and initiate <br />clinical analysis.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex flex-col items-center gap-4 text-emerald-400"
              >
                <div className="relative">
                  <Zap size={48} className="animate-pulse" />
                  <div className="absolute inset-0 blur-xl bg-emerald-500/50 animate-pulse"></div>
                </div>
                <p className="font-mono text-xs tracking-widest uppercase">Consulting Groq Llama 3...</p>
              </motion.div>
            )}

            {insight && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 w-full"
              >
                <div className="prose prose-invert prose-emerald max-w-none">
                  <div className="whitespace-pre-wrap text-slate-200 leading-relaxed font-serif italic text-lg">
                    {insight}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}