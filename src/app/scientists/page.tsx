"use client";

import { motion } from "framer-motion";
import { 
  Beaker, 
  Microscope, 
  Brain, 
  Activity, 
  ShieldCheck, 
  Dna, 
  Sprout,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import ScienceLab from "@/components/medical/ScienceLab";

export default function ScientistsPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.div {...fadeIn}>
            <span className="text-emerald-400 font-bold uppercase tracking-[0.3em] text-sm mb-4 block">
              The Clinical Kitchen
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
              Flavor as a <span className="italic text-emerald-500">Medical Necessity</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              We bridge the gap between world-class gastronomy and evidence-based nutrition science. 
              Every recipe is a clinical intervention.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The 3 Pillars of Conscious Science */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Dna className="text-emerald-500" />,
              title: "Bioavailability",
              desc: "We don't just count calories. We analyze how ingredients interact to maximize nutrient absorption."
            },
            {
              icon: <Brain className="text-emerald-500" />,
              title: "Cognitive Health",
              desc: "Focusing on the Gut-Brain axis through anti-inflammatory ingredients and healthy fats."
            },
            {
              icon: <Activity className="text-emerald-500" />,
              title: "Metabolic Logic",
              desc: "Designing dishes that stabilize glucose and support cardiovascular integrity without sacrifice."
            }
          ].map((pillar, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100"
            >
              <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{pillar.title}</h3>
              <p className="text-slate-500 leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">The Conscious Lab</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Experience the AI engine that powers our medical recommendations. 
            Select an ingredient and a condition to see the science in action.
          </p>
        </div>
        
        <ScienceLab />
      </section>

      {/* The Audit Process Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-8 leading-tight">
              The Conscious <br /> <span className="text-emerald-600">Audit Process</span>
            </h2>
            <div className="space-y-8">
              {[
                { step: "01", label: "Culinary Genesis", text: "Chef Cary Neff drafts the flavor profile using seasonal, whole-food ingredients." },
                { step: "02", label: "Clinical Analysis", text: "Registered Dietitians analyze the profile against 14 distinct medical conditions." },
                { step: "03", label: "AI Personalization", text: "Groq Llama 3 AI generates real-time substitutions for specific user health history." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <span className="text-3xl font-serif italic text-emerald-200">{item.step}</span>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.label}</h4>
                    <p className="text-slate-500 text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[500px] bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
             {/* Use a placeholder image or a medical graphic here */}
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                <Microscope size={120} className="text-white/40 animate-pulse" />
             </div>
             <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Live Clinical Data</p>
                <p className="text-slate-800 text-sm italic">"Our goal is to ensure that the diner never feels like a patient."</p>
             </div>
          </div>
        </div>
      </section>

      {/* Science Nuggets Showcase */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Beaker className="mx-auto text-emerald-600 mb-6" size={40} />
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Real-Time Medical Intelligence</h2>
          <p className="text-slate-500 mb-10">
            When you view a recipe, our AI doesn't just show you ingredients. 
            It creates what we call **"Science Nuggets"**—personalized medical insights 
            delivered in milliseconds.
          </p>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-left shadow-sm inline-block max-w-lg mx-auto">
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">
              <ShieldCheck size={14} /> Example Science Nugget
            </div>
            <p className="text-slate-700 italic">
              "Chef Cary's use of cold-pressed olive oil here is intentional; the high oleocanthal 
              concentration mimics the anti-inflammatory effect of ibuprofen, supporting your 
              joint health while stabilizing cardiovascular pressure."
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 font-serif">Ready to see the data in action?</h2>
        <Link 
          href="/recipes" 
          className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition-all inline-flex items-center gap-2 group"
        >
          Explore the Library <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </main>
  );
}