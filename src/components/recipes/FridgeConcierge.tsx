"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Refrigerator, Sparkles, ArrowRight, Loader2 } from "lucide-react";

export default function FridgeConcierge({ recipes }: { recipes: any[] }) {
  const [ingredients, setIngredients] = useState("");
  const [suggestion, setSuggestion] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const findConsciousMatch = async () => {
    setLoading(true);
    // Logic: Send ingredients to Groq. 
    // Groq looks at your library and picks the closest match + a "Bridge" tip.
    try {
      const res = await fetch("/api/fridge-match", {
        method: "POST",
        body: JSON.stringify({ 
          userIngredients: ingredients,
          library: recipes.map(r => ({ title: r.title, ingredients: r.ingredients, id: r.id }))
        }),
      });
      const data = await res.json();
      setSuggestion(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-emerald-900 rounded-[3rem] p-8 md:p-12 text-white overflow-hidden relative mb-12">
      <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-4">
            <Refrigerator size={18} /> Zero-Waste Clinical Cooking
          </div>
          <h2 className="text-4xl font-serif font-bold mb-6">What's in your fridge?</h2>
          <p className="text-emerald-100/60 mb-8">
            Tell Cary what you have on hand. The AI will find the closest Conscious Recipe 
            and tell you how to bridge the gap.
          </p>
          
          <div className="relative">
            <input 
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g. Wilted kale, half a lemon, some salmon..."
              className="w-full bg-emerald-800/50 border border-emerald-700 rounded-2xl p-4 pr-32 outline-none focus:ring-2 focus:ring-emerald-400 text-white placeholder:text-emerald-700"
            />
            <button 
              onClick={findConsciousMatch}
              disabled={loading || !ingredients}
              className="absolute right-2 top-2 bottom-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-6 rounded-xl font-bold transition-all disabled:opacity-30"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Match"}
            </button>
          </div>
        </div>

        <div className="min-h-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {suggestion ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 w-full"
              >
                <h4 className="text-emerald-400 font-bold text-sm uppercase mb-2">The Conscious Bridge</h4>
                <p className="text-xl font-serif mb-4">"You can almost make my <span className="text-emerald-400 underline">{suggestion.recipeTitle}</span>."</p>
                <p className="text-sm text-emerald-100/80 italic mb-6">"{suggestion.bridgeTip}"</p>
                <button className="text-white font-bold flex items-center gap-2 group">
                  Go to Recipe <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ) : (
              <div className="text-emerald-800/40 italic">Waiting for your ingredients...</div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}