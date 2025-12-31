"use client";

import dynamic from 'next/dynamic';
import { useAuth } from "@/hooks/useAuth";
import Link from 'next/link';
import { motion } from "framer-motion";
import { 
  ChefHat, 
  Refrigerator, 
  FlaskConical, 
  Mic, 
  HeartPulse, 
  ArrowRight, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

function HomePageContent() {
  const { profile, user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm mb-8"
          >
            <Sparkles className="text-emerald-500" size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              The Future of Conscious Cuisine
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-serif font-bold leading-tight mb-8"
          >
            {profile?.role === 'chef' ? (
              <>Welcome back, <span className="text-emerald-600 italic">Chef.</span></>
            ) : (
              <>Flavor is a <br /><span className="text-emerald-600 italic">Medical Necessity.</span></>
            )}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {profile?.role === 'chef' 
              ? "Your clinical-culinary engine is live. Monitor your recipes, audit the science, and serve your community's health." 
              : "Experience Chef Cary Neff’s philosophy through a digital lens. Real-time clinical AI meets world-class gastronomy."}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/recipes" 
              className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-200"
            >
              Enter the Library <ArrowRight size={20} />
            </Link>
            {!user && (
              <Link 
                href="/login"
                className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all text-center"
              >
                Create Medical Profile
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* --- INTERACTIVE HUB (The "Wow" Grid) --- */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 -mt-16 mb-32">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Fridge Concierge */}
          <Link href="/recipes">
            <motion.div variants={item} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-emerald-500 transition-all group h-full">
              <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Refrigerator size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Fridge Concierge</h3>
              <p className="text-sm text-slate-500 mb-4">Turn what you have into clinical wellness. Zero waste cooking.</p>
              <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                Try AI Match <ArrowRight size={14} />
              </span>
            </motion.div>
          </Link>

          {/* Science Lab */}
          <Link href="/scientists">
            <motion.div variants={item} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-blue-500 transition-all group h-full">
              <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <FlaskConical size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Clinical Lab</h3>
              <p className="text-sm text-slate-500 mb-4">Simulate molecular synergies between ingredients and conditions.</p>
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                Enter Lab <ArrowRight size={14} />
              </span>
            </motion.div>
          </Link>

          {/* Guided Cooking */}
          <Link href="/recipes">
            <motion.div variants={item} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-amber-500 transition-all group h-full">
              <div className="bg-amber-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Mic size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Voice Cooking</h3>
              <p className="text-sm text-slate-500 mb-4">Hands-free instruction designed for professional kitchen environments.</p>
              <span className="text-amber-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                View Demo <ArrowRight size={14} />
              </span>
            </motion.div>
          </Link>

          {/* Safety Engine */}
          <Link href="/profile">
            <motion.div variants={item} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-rose-500 transition-all group h-full">
              <div className="bg-rose-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Conscious Audit</h3>
              <p className="text-sm text-slate-500 mb-4">Real-time medical cross-referencing for every single bite.</p>
              <span className="text-rose-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                Update Profile <ArrowRight size={14} />
              </span>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* --- THE CHEF'S MISSION --- */}
      <section className="py-24 bg-slate-900 text-white rounded-[4rem] mx-6 mb-24 overflow-hidden relative">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 italic">"We are not just cooking; we are interventionists."</h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Chef Cary Neff revolutionized the medical world by proving that clinical food could taste like fine dining. 
              Today, we use AI to scale that expertise to every home kitchen.
            </p>
            <div className="flex gap-8">
               <div>
                  <p className="text-3xl font-serif font-bold text-emerald-400">100%</p>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Clinically Audited</p>
               </div>
               <div>
                  <p className="text-3xl font-serif font-bold text-emerald-400">AI</p>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Real-time Insight</p>
               </div>
            </div>
          </div>
          <div className="md:w-1/2 bg-slate-800 aspect-square rounded-full border-[12px] border-slate-700/50 flex items-center justify-center overflow-hidden">
             <ChefHat size={200} className="text-slate-700 opacity-20" />
             <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent"></div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default dynamic(() => Promise.resolve(HomePageContent), {
  ssr: false,
});