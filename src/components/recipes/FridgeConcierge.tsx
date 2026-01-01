"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Refrigerator, Sparkles, ArrowRight, Loader2, Mic, MicOff } from "lucide-react";
import Link from "next/link";

export default function FridgeConcierge({ recipes }: { recipes: any[] }) {
  const [ingredients, setIngredients] = useState("");
  const [suggestion, setSuggestion] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // --- Voice Search Logic ---
  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIngredients(transcript);
    };

    recognition.start();
  };

  // --- AI Match Logic ---
  const findConsciousMatch = async () => {
    setLoading(true);
    setSuggestion(null);
    try {
      const res = await fetch("/api/fridge-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userIngredients: ingredients,
          library: recipes.map(r => ({ title: r.title, ingredients: r.ingredients, id: r.id }))
        }),
      });
      const data = await res.json();
      setSuggestion(data);
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-emerald-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 text-white overflow-hidden relative mb-12 shadow-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
        <Refrigerator size={300} />
      </div>

      <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-6">
            <Refrigerator size={16} /> Clinical Kitchen Concierge
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
            What's in <br /> your <span className="italic text-emerald-400">fridge?</span>
          </h2>
          <p className="text-emerald-100/60 text-lg mb-10 leading-relaxed font-light">
            Tell Cary what you have on hand. Our AI will scan the library to find the perfect 
            molecular match and bridge the gaps.
          </p>
          
          {/* --- THE FIXED INPUT GROUP --- */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-emerald-950/50 p-2 rounded-[2rem] border border-emerald-800/50 shadow-inner">
            <div className="flex items-center flex-1 w-full px-4 gap-3">
              <button 
                onClick={startVoiceSearch}
                className={`p-2 rounded-full transition-all ${isListening ? "bg-red-500 text-white animate-pulse" : "text-emerald-500 hover:bg-emerald-800/50"}`}
                title="Voice Search"
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <input 
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g. Salmon, kale, lemon..."
                className="w-full bg-transparent border-none outline-none py-3 text-white placeholder:text-emerald-800 text-lg"
              />
            </div>
            
            {/* The Match Button - Forced to stay on one line */}
            <button 
              onClick={findConsciousMatch}
              disabled={loading || !ingredients}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-10 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all disabled:opacity-30 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              {loading ? "Matching..." : "Find Match"}
            </button>
          </div>
        </div>

        {/* --- AI RESULT DISPLAY --- */}
        <div className="min-h-[250px] flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {suggestion ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/10 backdrop-blur-xl p-8 rounded-[3rem] border border-white/20 w-full shadow-2xl"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-widest mb-4">
                  <Sparkles size={14} /> The Conscious Bridge
                </div>
                <h4 className="text-2xl md:text-3xl font-serif mb-4 leading-tight">
                  "You can almost make my <span className="text-emerald-400 underline decoration-emerald-400/30 underline-offset-8 italic">{suggestion.recipeTitle}</span>."
                </h4>
                <p className="text-emerald-100/70 italic leading-relaxed mb-8 font-light">
                  "{suggestion.bridgeTip}"
                </p>
                <Link 
                  href={`/recipes/${suggestion.recipeId}`}
                  className="inline-flex items-center gap-2 bg-white text-emerald-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-emerald-50 transition-all group"
                >
                  Go to Recipe <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full border-2 border-emerald-800/50 flex items-center justify-center mx-auto mb-4">
                   <Refrigerator size={32} className="text-emerald-800" />
                </div>
                <p className="text-emerald-800 font-serif italic text-lg uppercase tracking-widest">Awaiting Inventory...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}