"use client";

import { motion } from "framer-motion";
import { 
  Beaker, Microscope, BookOpen, 
  Linkedin, Globe, Sparkles,
  ArrowRight, Quote, GraduationCap,
  ShieldCheck, Dna, Activity, ChefHat, 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ScienceLab from "@/components/medical/ScienceLab"; // Import the AI Lab we built

export default function ScientistsPage() {
  // Breanna's Official Professional Portrait
  const BREANNA_IMAGE = "https://substack-post-media.s3.amazonaws.com/public/images/8e5dda52-1549-4cce-bf58-f44807154656_4550x4550.jpeg";

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* --- SECTION 1: THE SCIENTIFIC LEADERSHIP --- */}
      <section className="relative pt-20 pb-32 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/5 skew-x-12 translate-x-20"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
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

            <p className="text-xl text-slate-600 mb-8 leading-relaxed font-light">
              As the Co-Founder of <span className="font-bold text-slate-800 underline decoration-emerald-400">Conscious Food Solutions</span>, 
              Breanna provides the molecular proof for the "Conscious" philosophy. By applying the foundational processes of 
              Cornell Food Science to functional ingredients, she ensures every recipe is a validated clinical intervention.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="https://substack.com/@askthefoodscientist" target="_blank" className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200">
                <BookOpen size={18} /> Ask The Food Scientist
              </Link>
              <Link href="https://www.linkedin.com/in/foodscibneff/" target="_blank" className="flex items-center gap-2 border border-slate-200 bg-white px-8 py-4 rounded-full font-bold text-sm hover:bg-slate-50 transition-all">
                <Linkedin size={18} className="text-blue-600" /> Professional Profile
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-[650px] rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white group"
          >
            <Image 
              src={BREANNA_IMAGE}
              alt="Breanna Neff - Chief Food Scientist"
              fill
              priority
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10 right-10 text-white">
               <Quote className="text-emerald-400 mb-4" size={40} />
               <p className="text-2xl font-serif italic leading-relaxed">
                  "Food science is the bridge that turns a culinary experience into a clinical intervention."
               </p>
               <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">— Breanna Neff, CFS</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 2: THE SCIENTIFIC PILLARS --- */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Molecular Integrity</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Breanna’s audit process at <span className="font-bold">Conscious Food Solutions</span> validates the health claims 
            of every flavor profile in Chef Cary's library.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Bio-Optimization",
              desc: "Analyzing ingredient synergies—like the interaction between piperine and curcumin—to maximize the body's absorption of healing compounds.",
              icon: <Sparkles className="text-emerald-500" />
            },
            {
              title: "Clinical Formulation",
              desc: "Ensuring recipes are balanced for glycemic control, renal support, and cardiovascular health based on the latest peer-reviewed data.",
              icon: <Activity className="text-emerald-500" />
            },
            {
              title: "Bioavailability",
              desc: "Auditing cooking methods to ensure that thermal processing preserves the delicate molecular structures of phytonutrients.",
              icon: <Dna className="text-emerald-500" />
            }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              {...fadeIn} 
              transition={{ delay: i * 0.2 }}
              className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-100/30 hover:border-emerald-500 transition-all group"
            >
              <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                {item.icon}
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SECTION 3: THE NEFF HERITAGE (The Family Connection) --- */}
      <section className="py-24 bg-slate-900 text-white mx-6 rounded-[4rem] overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-5">
           <Microscope size={400} />
        </div>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20 relative z-10">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 italic">The Neff Heritage</h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed font-light">
              "Growing up in my father's kitchen, I learned that food was an intervention. 
              Today, I use my background in Food Science to scale that impact, 
              ensuring that the 'Conscious' standard is applied to every kitchen, from hospital menus to home tables."
            </p>
            <div className="flex items-center gap-4 text-emerald-400 font-bold text-sm uppercase tracking-widest">
               <Globe size={20} />
               <Link href="https://consciousfoodsolutions.com" target="_blank" className="hover:underline">consciousfoodsolutions.com</Link>
            </div>
          </div>
          <div className="md:w-1/2 flex items-center justify-center">
             <div className="relative group">
                <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all"></div>
                <div className="w-64 h-64 border-2 border-slate-700 rounded-full flex items-center justify-center p-8 relative bg-slate-900 shadow-2xl">
                   <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin-slow"></div>
                   <ChefHat size={100} className="text-slate-600" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: THE INTERACTIVE CONSCIOUS LAB (AI FEATURE) --- */}
      <section id="lab" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">The Conscious Lab</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
            Experience the AI engine that powers our medical recommendations. 
            Select an ingredient and a condition to see Breanna's scientific logic in action.
          </p>
        </div>
        
        {/* Integrating the interactive simulator component */}
        <ScienceLab />
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 text-center">
        <motion.div {...fadeIn}>
          <Beaker size={48} className="mx-auto text-emerald-600 mb-8" />
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-12">Ready to see the science in the kitchen?</h2>
          <Link 
            href="/recipes" 
            className="bg-emerald-600 text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-emerald-700 transition-all shadow-2xl flex items-center gap-3 w-fit mx-auto group"
          >
            Explore the Library <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}