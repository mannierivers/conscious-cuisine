"use client";

import { motion } from "framer-motion";
import { 
  Beaker, Microscope, BookOpen, 
  Linkedin, Globe, Sparkles,
  ArrowRight, Quote, GraduationCap,
  ShieldCheck, Dna, Activity, Zap, ChefHat, 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Import the new advanced Molecular Lab component
import MolecularLab from "@/components/medical/MolecularLab"; 

export default function ScientistsPage() {
  const BREANNA_IMAGE = "https://substack-post-media.s3.amazonaws.com/public/images/8e5dda52-1549-4cce-bf58-f44807154656_4550x4550.jpeg";

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* --- SECTION 1: LEADERSHIP --- */}
      <section className="relative pt-20 pb-32 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/5 skew-x-12 translate-x-20"></div>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <Microscope size={14} /> Chief Food Scientist
            </div>
            <h1 className="text-6xl md:text-7xl font-serif font-bold text-slate-900 mb-6 leading-tight">
              Breanna <span className="italic text-emerald-600">Neff.</span>
            </h1>
            
            <div className="flex flex-wrap gap-3 mb-8">
               <span className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
                  <GraduationCap size={14} className="text-emerald-500" /> Cornell Food Science
               </span>
               <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
                  IFT Certified Food Scientist
               </span>
            </div>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed font-light italic">
              "We are moving from general nutrition to molecular precision."
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="https://substack.com/@askthefoodscientist" target="_blank" className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200">
                <BookOpen size={18} /> Ask The Food Scientist
              </Link>
              <Link href="https://www.linkedin.com/in/foodscibneff/" target="_blank" className="flex items-center gap-2 border border-slate-200 bg-white px-8 py-4 rounded-full font-bold text-sm hover:bg-slate-50 transition-all">
                <Linkedin size={18} className="text-blue-600" /> LinkedIn Profile
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative h-[650px] rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white group">
            <Image src={BREANNA_IMAGE} alt="Breanna Neff" fill priority className="object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10 right-10 text-white">
               <Quote className="text-emerald-400 mb-4" size={40} />
               <p className="text-2xl font-serif italic leading-relaxed">
                  "Bio-optimization is the science of unlocking the clinical potential within every ingredient."
               </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 2: THE INTERACTIVE MOLECULAR LAB (NEW CENTERPIECE) --- */}
      <section id="lab" className="py-32 px-6 bg-slate-900 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <motion.div {...fadeIn}>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-emerald-500/20">
                <Zap size={14} className="animate-pulse" /> Advanced R&D Module
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
                The Molecular <span className="text-emerald-500">Lab</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                Engineer clinical synergy. Simulate how cooking methods and potentiators 
                interact with active compounds to solve specific biological conditions.
              </p>
            </motion.div>
          </div>
          
          {/* New 2.0 Lab Component */}
          <MolecularLab />
        </div>
      </section>

      {/* --- SECTION 3: THE NEFF HERITAGE --- */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8 italic">The Neff Heritage</h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed font-light">
              "Growing up in my father's kitchen, I learned that food was an intervention. 
              Today, I use my background in Food Science to scale that impact, 
              ensuring that the 'Conscious' standard is applied from hospital menus to home tables."
            </p>
            <Link href="https://consciousfoodsolutions.com" target="_blank" className="flex items-center gap-3 text-emerald-600 font-bold group">
               <Globe size={20} /> Visit Conscious Food Solutions <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
             <div className="relative w-72 h-72 border border-slate-200 rounded-full flex items-center justify-center">
                <Dna size={120} className="text-emerald-500/20 absolute animate-spin-slow" />
                <ChefHat size={80} className="text-slate-300 relative z-10" />
             </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: THE SCIENTIFIC PILLARS --- */}
      <section className="py-24 bg-slate-50 mx-6 rounded-[4rem]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {[
            { title: "Bio-Optimization", icon: <Sparkles />, text: "Analyzing synergistic pairings to maximize compound absorption." },
            { title: "Metabolic Logic", icon: <Activity />, text: "Stabilizing glucose through strategic plant-based formulation." },
            { title: "Clinical Rigor", icon: <ShieldCheck />, text: "Applying FDA/IFT standards to all culinary interventions." }
          ].map((pillar, i) => (
            <motion.div key={i} {...fadeIn} transition={{ delay: i * 0.2 }} className="text-center">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-emerald-600 border border-slate-100">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">{pillar.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{pillar.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}