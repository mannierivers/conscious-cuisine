"use client";

import { motion } from "framer-motion";
import { 
  ChefHat, 
  Quote, 
  Leaf, 
  HeartPulse, 
  Microscope, 
  ShieldCheck, 
  UtensilsCrossed, 
  Grape,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ChefPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* --- HERO SECTION: THE VISIONARY --- */}
      <section className="relative h-[80vh] flex items-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          {/* Chef Cary Image Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent z-10"></div>
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn} className="max-w-3xl">
            <span className="text-emerald-400 font-bold uppercase tracking-[0.4em] text-xs mb-6 block">
              The Founder of Conscious Cuisine
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-8 leading-tight">
              Chef Cary <br /> <span className="italic text-emerald-500">Neff.</span>
            </h1>
            <div className="flex items-start gap-4 border-l-2 border-emerald-500 pl-6 py-2">
              <Quote className="text-emerald-500 shrink-0" size={32} />
              <p className="text-2xl md:text-3xl font-serif text-slate-200 italic leading-relaxed">
                "We aren’t just making food. We are crafting a lifestyle where every bite supports the life you want to lead."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- THE PHILOSOPHY PILLARS --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">
              The Birth of <br /> <span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">Conscious Cuisine</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Cary Neff revolutionized the culinary world by proving that clinical excellence doesn’t require a compromise on the palate. He bridged the gap between the medical community and the kitchen, transforming "dietary restrictions" into "culinary opportunities."
            </p>
            <div className="space-y-6">
              {[
                { icon: <Leaf />, title: "Plant-Forward Focus", text: "Maximizing phytonutrients without losing the soul of the dish." },
                { icon: <Microscope />, title: "Molecular Integrity", text: "Using cooking techniques that preserve the bioavailability of vitamins." },
                { icon: <HeartPulse />, title: "Clinical Interventions", text: "Every recipe is a scientifically audited response to chronic conditions." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="bg-emerald-100 p-2 rounded-xl text-emerald-700 h-fit">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Scientific Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-slate-100 rounded-[4rem] p-12 aspect-square relative flex flex-col justify-center overflow-hidden border-8 border-white shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5">
               <Dna size={300} className="text-slate-900" />
            </div>
            <div className="relative z-10 text-center">
               <span className="text-emerald-600 font-black text-6xl block mb-2">20+</span>
               <p className="text-slate-500 uppercase tracking-widest font-bold text-sm mb-8">Years of Clinical Gastronomy</p>
               <hr className="border-slate-200 mb-8" />
               <p className="text-xl font-serif italic text-slate-700">
                  "Healthy food shouldn't taste like hospital food. Flavor is a medical necessity."
               </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- CLINICAL DATA STRIP --- */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Anti-Inflammatory", value: "Curcumin Synergy", detail: "Chef Cary pairs turmeric with piperine to boost absorption by 2000%." },
              { label: "Cardiovascular", value: "Nitric Oxide", detail: "Strategic use of nitrates in root vegetables to support blood pressure." },
              { label: "Glycemic Control", value: "Low-GI Profiling", detail: "Slow-release carbohydrate structures to prevent insulin spiking." },
              { label: "Bioavailability", value: "Molecular Roasting", detail: "Specific temperatures that maintain the integrity of Sulforaphane." }
            ].map((stat, i) => (
              <motion.div key={i} {...fadeIn} transition={{ delay: i * 0.1 }}>
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                <h3 className="text-2xl font-serif font-bold mb-4">{stat.value}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{stat.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CARY'S WISDOM GRID --- */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4 text-center">Chef's Wisdom</h2>
            <p className="text-slate-500">Quotes and philosophies from Cary's private journals.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100">
              <p className="text-2xl font-serif italic text-slate-800 leading-relaxed">
                "The doctor of the future will no longer treat the human frame with drugs, but rather will cure and prevent disease with nutrition."
              </p>
            </div>
            <div className="bg-emerald-600 p-12 rounded-[3rem] shadow-xl text-white flex flex-col justify-center">
              <p className="text-2xl font-serif italic mb-6 leading-relaxed">
                "Food is the only medicine we take three times a day. We should make it count."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-px bg-emerald-400 flex-grow"></div>
                <span className="text-xs font-bold uppercase tracking-widest">Cary Neff</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 text-center px-6">
        <motion.div {...fadeIn}>
          <ChefHat size={48} className="mx-auto text-emerald-600 mb-8" />
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6 italic">Ready to experience the science?</h2>
          <p className="text-slate-500 max-w-xl mx-auto mb-12">
            Chef Cary Neff’s life work is now accessible in your kitchen. 
            Audited by scientists, powered by AI, and served for your health.
          </p>
          <Link 
            href="/recipes" 
            className="bg-slate-900 text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-emerald-600 transition-all shadow-2xl flex items-center gap-3 w-fit mx-auto"
          >
            Enter the Conscious Library <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

// Simple DNA Icon for visual flair
function Dna({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      className={className} 
      width={size} height={size} 
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M8 3c.5 0 2.5 2 2.5 4s-2 4-2.5 4-2.5-2-2.5-4 2-4 2.5-4z"/><path d="M16 21c-.5 0-2.5-2-2.5-4s2-4 2.5-4 2.5 2 2.5 4-2 4-2.5 4z"/><path d="M4.5 6.5c.5-.5 1-1 2-1s1.5.5 2 1 1 1 2 1 1.5-.5 2-1 1-1 2-1 1.5.5 2 1"/><path d="M4.5 17.5c.5-.5 1-1 2-1s1.5.5 2 1 1 1 2 1 1.5-.5 2-1 1-1 2-1 1.5.5 2 1"/><path d="M12 2v20"/>
    </svg>
  );
}