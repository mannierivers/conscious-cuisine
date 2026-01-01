"use client";

import { motion } from "framer-motion";
import { Microscope, ShieldCheck, Quote, BookOpen, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ScientistAuditProps {
  snippet: string;
}

export default function ScientistAudit({ snippet }: ScientistAuditProps) {
  // Using the verified professional headshot URL
  const BREANNA_IMAGE = "https://substack-post-media.s3.amazonaws.com/public/images/8e5dda52-1549-4cce-bf58-f44807154656_4550x4550.jpeg";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-blue-50/50 rounded-[2.5rem] p-8 md:p-10 border border-blue-100 relative overflow-hidden group"
    >
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
        <Microscope size={180} className="text-blue-900" />
      </div>
      
      <div className="relative z-10">
        {/* Header Label */}
        <div className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-[0.25em] mb-6">
          <ShieldCheck size={16} className="fill-blue-600/10" /> 
          Clinical Audit: Breanna Neff, CFS
        </div>
        
        {/* The Scientific Insight */}
        <div className="relative mb-8">
          <Quote className="text-blue-200 absolute -top-4 -left-4 -z-10" size={48} />
          <p className="text-xl md:text-2xl font-serif italic text-slate-800 leading-relaxed">
            "{snippet || "The molecular profile of this dish is currently being audited to ensure maximum bioavailability and clinical impact for our Conscious community."}"
          </p>
        </div>
        
        {/* Scientist Footer Meta */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-blue-100 pt-8">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md">
              <Image 
                src={BREANNA_IMAGE}
                alt="Breanna Neff, Chief Food Scientist"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">Breanna Neff, CFS</span>
              <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">
                Chief Food Scientist
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="https://substack.com/@askthefoodscientist" 
              target="_blank"
              className="flex items-center gap-2 bg-white border border-blue-100 px-4 py-2 rounded-xl text-[10px] font-bold text-slate-600 hover:bg-blue-500 hover:text-white transition-all shadow-sm group/link"
            >
              <BookOpen size={14} /> 
              Ask The Food Scientist
              <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}