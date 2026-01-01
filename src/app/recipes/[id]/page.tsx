"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { useConsciousAI } from "@/hooks/useConsciousAI";

// Components
import MolecularMap from "@/components/recipes/MolecularMap";
import ScientistAudit from "@/components/recipes/ScientistAudit";
import VideoPlayer from "@/components/recipes/VideoPlayer";
import GetSaucyAd from "@/components/commercial/GetSaucyAd";

// Icons
import { 
  Loader2, ChefHat, ShieldCheck, Play, 
  ChevronLeft, Zap, Sparkles, Camera, 
  Clapperboard, ShoppingBag, Leaf
} from "lucide-react";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { profile: userData } = useAuth();
  const { getAnalysis, analysis, loading: aiLoading } = useConsciousAI();
  
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState(4);
  const [viewMode, setViewMode] = useState<'image' | 'video'>('image');

  useEffect(() => {
    async function fetchRecipe() {
      if (!id) return;
      try {
        const docRef = doc(db, "recipes", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setRecipe(docSnap.data());
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    }
    fetchRecipe();
  }, [id]);

  const scaleIngredient = (ing: string) => {
    const ratio = servings / 4;
    return ing.replace(/(\d+(\.\d+)?)/g, (match) => {
      const val = parseFloat(match) * ratio;
      return val % 1 === 0 ? val.toString() : val.toFixed(1);
    });
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-white"><Loader2 className="animate-spin text-emerald-600" size={48} /></div>;
  if (!recipe) return <div className="p-20 text-center font-serif text-2xl text-slate-400">Recipe not found.</div>;

  return (
    <main className="min-h-screen bg-white pb-32">
      {/* --- TOP STICKY NAV --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-widest">
          <ChevronLeft size={18} /> Back to Library
        </button>
        <div className="flex items-center gap-3">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 leading-none">Nightshade Free</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Get Saucy™ Protocol</span>
           </div>
           <Leaf size={20} className="text-emerald-500" />
        </div>
      </nav>

      {/* --- HERO CONTENT --- */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex items-center justify-center gap-2 mb-8 bg-slate-100 w-fit mx-auto p-1.5 rounded-full border border-slate-200">
          <button onClick={() => setViewMode('image')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'image' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Camera size={14} className="inline mr-2" /> Gallery</button>
          <button onClick={() => setViewMode('video')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'video' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><Clapperboard size={14} className="inline mr-2" /> Video Lesson</button>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'image' ? (
            <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative h-[600px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl group bg-slate-100">
              <Image src={recipe.imageUrl} alt={recipe.title} fill priority className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-12 left-12">
                <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block shadow-lg">Clinical Series</span>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">{recipe.title}</h1>
              </div>
            </motion.div>
          ) : (
            <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <VideoPlayer videoUrl={recipe.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-chef-cutting-vegetables-in-a-kitchen-4028-large.mp4"} poster={recipe.imageUrl} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* --- QUICK ACTION BAR --- */}
      <section className="max-w-7xl mx-auto px-6 mt-16 grid lg:grid-cols-3 gap-16 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-wrap items-center gap-8 py-8 border-y border-slate-100">
             <div className="flex flex-col flex-1 min-w-[120px]"><span className="text-[10px] font-black text-slate-400 uppercase mb-1">Time</span><span className="text-xl font-serif font-bold">25 Mins</span></div>
             <div className="h-8 w-px bg-slate-100"></div>
             <div className="flex flex-col flex-1 min-w-[120px]"><span className="text-[10px] font-black text-slate-400 uppercase mb-1">Category</span><span className="text-xl font-serif font-bold capitalize">{recipe.category}</span></div>
             <div className="h-8 w-px bg-slate-100"></div>
             <div className="flex flex-col flex-1 min-w-[120px]"><span className="text-[10px] font-black text-slate-400 uppercase mb-1">Scientist</span><span className="text-xl font-serif font-bold text-emerald-600 italic">B. Neff, CFS</span></div>
          </div>
          
          <p className="text-2xl text-slate-500 font-light leading-relaxed italic">"{recipe.description}"</p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href={`/recipes/${id}/cook`} className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-xl active:scale-95"><Play size={20} fill="currentColor" /> Start Guided Cooking</Link>
            <button onClick={() => getAnalysis(recipe, userData?.medicalHistory || [], userData?.name || 'Guest')} disabled={aiLoading} className="border-2 border-slate-900 text-slate-900 px-10 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-slate-900 hover:text-white transition-all">{aiLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />} Safety Audit</button>
          </div>
        </div>
        <div className="lg:col-span-1"><MolecularMap category={recipe.category} /></div>
      </section>

      {/* --- AI FEEDBACK --- */}
      {analysis && (
        <section className="max-w-5xl mx-auto px-6 mt-16 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-[3rem] p-10">
            <h3 className="text-emerald-900 font-bold flex items-center gap-2 mb-6 uppercase tracking-widest text-xs"><Sparkles size={16} /> Clinical Insight for {userData?.name || 'Guest'}</h3>
            <div className="whitespace-pre-wrap text-slate-800 leading-relaxed font-serif text-xl">{analysis}</div>
          </div>
        </section>
      )}

      {/* --- INGREDIENTS & BWS AD --- */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-12">
          <h3 className="text-4xl font-serif font-bold text-slate-900">The Palette</h3>
          <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-full border border-slate-100 shadow-inner">
            <button onClick={() => setServings(Math.max(1, servings - 1))} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm font-bold">-</button>
            <span className="text-[11px] font-black uppercase w-20 text-center">{servings} Serves</span>
            <button onClick={() => setServings(servings + 1)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm font-bold">+</button>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <ul className="space-y-6">
            {recipe.ingredients?.map((ing: string, i: number) => (
              <li key={i} className="text-xl text-slate-600 border-b border-slate-50 pb-4 flex items-start gap-6 group transition-all">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-3 group-hover:scale-150 transition-transform"></div>
                <span className="group-hover:text-slate-900 transition-colors">{scaleIngredient(ing)}</span>
              </li>
            ))}
          </ul>
          <div className="bg-amber-50 rounded-[3rem] p-10 border border-amber-100 h-fit">
            <h4 className="text-amber-900 font-bold flex items-center gap-2 mb-4 uppercase tracking-[0.2em] text-[10px]"><ChefHat size={16} /> Chef Cary's Technique</h4>
            <p className="text-amber-800 text-lg italic leading-relaxed">"{recipe.chefTips || "Flavor is the driver, but clinical integrity is the engine."}"</p>
          </div>
        </div>

        {/* --- FULL WIDTH GET SAUCY AD --- */}
        <GetSaucyAd />
      </section>

      {/* --- PREPARATION & SCIENTIST AUDIT --- */}
      <section className="max-w-7xl mx-auto px-6 mt-32">
        <h3 className="text-4xl font-serif font-bold border-b border-slate-100 pb-6 mb-12 text-slate-900">Clinical Process</h3>
        <div className="grid lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-20">
            {recipe.steps?.map((step: string, i: number) => (
              <div key={i} className="flex gap-12 group">
                <span className="text-8xl font-serif font-black text-slate-100 leading-none group-hover:text-emerald-100 transition-colors duration-500">{i + 1}</span>
                <p className="text-2xl text-slate-700 leading-relaxed pt-4 font-light">{step}</p>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
             <ScientistAudit snippet={recipe.nutritionScienceSnippet} />
          </div>
        </div>
      </section>
    </main>
  );
}