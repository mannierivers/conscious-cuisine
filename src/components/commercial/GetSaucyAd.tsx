"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ShieldCheck, Star, Sparkles, CheckCircle2, Leaf } from "lucide-react";
import Image from "next/image";

export default function GetSaucyAd() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden bg-[#0c0c02] rounded-[3rem] p-1 shadow-2xl border border-emerald-900/30"
    >
      <div className="bg-[#0c0c02] rounded-[2.8rem] p-8 md:p-12 relative overflow-hidden">
        {/* Subtle Branding Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#385b44]/20 blur-[120px] -mr-48 -mt-48"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          
          {/* Product Visual */}
          <div className="w-full lg:w-1/3">
            <div className="relative aspect-square bg-slate-800 rounded-3xl border border-slate-700 flex items-center justify-center group overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=600" 
                alt="Get Saucy Signature Sauce"
                fill
                className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c02] via-transparent to-transparent"></div>
              <div className="absolute bottom-4 inset-x-0 text-center">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Nightshade Free</span>
              </div>
            </div>
          </div>

          {/* Marketing Content */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-[#385b44] text-emerald-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-700/50">
                Clinical Kitchen Essential
              </div>
              <div className="h-px flex-1 bg-slate-800"></div>
            </div>

            <h3 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
              Eat Different. <span className="text-emerald-500 italic font-light text-3xl md:text-4xl">Feel Different.™</span>
            </h3>

            <p className="text-slate-300 text-lg leading-relaxed font-light max-w-xl">
              Clean, nutrient-dense sauces & seasonings formulated for <span className="text-white font-medium">Autoimmune Protocol (AIP)</span> and <span className="text-white font-medium">Whole30®</span>. Every jar features 7+ whole vegetables and zero nightshades.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
              {[
                "Top 9 Allergen-Free",
                "Nightshade-Free (No Peppers)",
                "No Seed Oils or Refined Sugar",
                "Certified Organic & Plant-Based"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center gap-8 border-t border-slate-800">
              <a 
                href="https://getsaucy.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-500 text-[#0c0c02] px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white transition-all active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3"
              >
                <ShoppingBag size={18} /> Shop Get Saucy™
              </a>
              
              <div className="flex items-center gap-4">
                <div className="flex gap-0.5">
                   {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-emerald-400 text-emerald-400" />)}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Inclusive Mealtime <br />Standard
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}