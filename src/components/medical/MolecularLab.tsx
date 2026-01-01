"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dna, Flame, Droplets, Zap, 
  ShieldCheck, Activity, Loader2, Sparkles, Check 
} from "lucide-react";

const INGREDIENTS = ["Turmeric", "Tomatoes", "Kale", "Wild Salmon", "Beets"];
const POTENTIATORS = ["Black Pepper", "Heat/Roasting", "Healthy Fats", "Citrus/Acid", "Raw/Fermented"];
const CONDITIONS = ["Inflammation", "Heart Health", "Metabolic Balance", "Brain Health"];

export default function MolecularLab() {
  const [ing, setIng] = useState(INGREDIENTS[0]);
  const [pot, setPot] = useState(POTENTIATORS[0]);
  const [cond, setCond] = useState(CONDITIONS[0]);
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/molecular-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredient: ing, potentiator: pot, condition: cond }),
      });
      const data = await res.json();
      setAudit(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
      {/* Visual background element */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
        <Dna size={400} />
      </div>

      <div className="grid lg:grid-cols-2 gap-16 relative z-10">
        {/* Selectors Column */}
        <div className="space-y-10">
          <header>
            <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
              <Sparkles size={12} className="text-emerald-500" /> Advanced Simulation
            </div>
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-2">Molecular Lab 2.0</h3>
            <p className="text-slate-500 font-medium">Engineer clinical synergy through bioavailability.</p>
          </header>

          <div className="space-y-8">
            <Selector 
              label="Primary Compound" 
              active={ing} 
              items={INGREDIENTS} 
              onChange={setIng} 
              type="emerald" 
            />
            <Selector 
              label="Potentiator / Method" 
              active={pot} 
              items={POTENTIATORS} 
              onChange={setPot} 
              type="blue" 
            />
            <Selector 
              label="Target Condition" 
              active={cond} 
              items={CONDITIONS} 
              onChange={setCond} 
              type="rose" 
            />
          </div>

          <button 
            onClick={runAudit}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-200"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
            {loading ? "Sequencing Compounds..." : "Execute Molecular Audit"}
          </button>
        </div>

        {/* Result Panel Column */}
        <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8 flex flex-col justify-center min-h-[400px] relative">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-4">
                <div className="relative w-20 h-20 mx-auto">
                  <Dna size={80} className="text-emerald-500 animate-pulse" />
                </div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Analyzing Bio-Pathways...</p>
              </motion.div>
            ) : audit ? (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Detected Compound</p>
                    <h4 className="text-3xl font-serif font-bold text-slate-900">{audit.activeCompound}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bio-Score</p>
                    <span className="text-3xl font-serif font-bold text-emerald-600">{audit.bioavailabilityScore}%</span>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-200">
                  <div className="flex gap-4 items-start">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Droplets size={18} /></div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Synergy Logic</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{audit.synergyLogic}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="bg-rose-100 p-2 rounded-lg text-rose-600"><Activity size={18} /></div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Biological Impact</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{audit.biologicalImpact}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-600 text-white p-6 rounded-2xl relative overflow-hidden mt-4">
                  <Sparkles className="absolute top-2 right-2 opacity-20" size={40} />
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Breanna's Clinical Pro-Tip</p>
                  <p className="text-sm font-medium italic leading-relaxed">"{audit.breannaTip}"</p>
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-slate-300">
                <ShieldCheck size={64} className="mx-auto mb-4 opacity-10" />
                <p className="font-serif italic text-slate-400">Configure parameters and initiate <br />molecular simulation.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Fixed Selector Component with explicit color classes
function Selector({ label, items, active, onChange, type }: { label: string, items: string[], active: string, onChange: (val: string) => void, type: 'emerald' | 'blue' | 'rose' }) {
  
  const getStyles = (item: string) => {
    const isActive = active === item;
    
    // Explicit mapping to prevent Tailwind JIT issues
    const colorMap = {
      emerald: isActive ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100" : "bg-white border-slate-200 text-slate-500 hover:border-emerald-300",
      blue: isActive ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white border-slate-200 text-slate-500 hover:border-blue-300",
      rose: isActive ? "bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-100" : "bg-white border-slate-200 text-slate-500 hover:border-rose-300"
    };

    return `flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${colorMap[type]}`;
  };

  return (
    <div>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">{label}</label>
      <div className="flex flex-wrap gap-2">
        {items.map((item: string) => (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={getStyles(item)}
          >
            {active === item && <Check size={12} className="animate-in zoom-in" />}
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}