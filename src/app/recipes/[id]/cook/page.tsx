"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Play, CheckCircle, Loader2 } from "lucide-react";

export default function CookModePage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [recipe, setRecipe] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);

  // 1. Fetch the recipe
  useEffect(() => {
    async function fetchRecipe() {
      const snap = await getDoc(doc(db, "recipes", id as string));
      if (snap.exists()) {
        setRecipe(snap.data());
      }
    }
    fetchRecipe();
  }, [id]);

  // 2. Declare totalSteps and handle Voice Control
  // We place this inside a useEffect that only runs once 'recipe' is loaded
  const totalSteps = recipe?.steps?.length || 0;

  useEffect(() => {
    if (!recipe || totalSteps === 0) return;

    // Check for browser support for Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log("Voice Command:", transcript);

        if (transcript.includes("next")) {
          setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1));
        }
        if (transcript.includes("back") || transcript.includes("previous")) {
          setCurrentStep(prev => Math.max(0, prev - 1));
        }
      };

      recognition.start();
      return () => recognition.stop();
    }
  }, [recipe, totalSteps]); // Re-run when recipe is loaded

  if (!recipe) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
      </div>
    );
  }

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <main className="fixed inset-0 bg-white z-[100] flex flex-col">
      {/* Progress Bar */}
      <div className="h-2 bg-slate-100 w-full">
        <div 
          className="h-full bg-emerald-500 transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-slate-100">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-900">
          <X size={28} />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
            Step {currentStep + 1} of {totalSteps}
          </p>
          <h2 className="font-serif font-bold text-slate-900">{recipe.title}</h2>
        </div>
        <div className="w-8">
            {isListening && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" title="Voice Control Active"></div>}
        </div>
      </header>

            {/* Top Hero Image */}
        {recipe.imageUrl && (
        <div className="relative w-full h-[400px] rounded-3xl overflow-hidden mb-8 shadow-2xl">
            <Image 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            fill 
            priority
            className="object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
            <span className="bg-emerald-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2 inline-block">
                {recipe.category}
            </span>
            <h1 className="text-5xl font-serif font-bold">{recipe.title}</h1>
            </div>
        </div>
        )}

      {/* Main Instruction */}
      <div className="flex-grow flex items-center justify-center p-8 md:p-20 text-center">
        <div className="max-w-3xl animate-in fade-in zoom-in duration-500" key={currentStep}>
          <p className="text-3xl md:text-5xl font-serif text-slate-800 leading-tight">
            {recipe.steps[currentStep]}
          </p>
        </div>
      </div>

      {/* Footer Controls */}
      <footer className="p-8 flex justify-between items-center max-w-4xl mx-auto w-full">
        <button 
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="p-4 rounded-full bg-slate-100 text-slate-900 disabled:opacity-20 transition-all"
        >
          <ChevronLeft size={32} />
        </button>

        <div className="flex flex-col items-center">
             <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                <Play size={14} /> {isListening ? "Voice Active: Say 'Next'" : "Voice Unsupported"}
             </div>
        </div>

        <button 
          onClick={() => {
            if (currentStep < totalSteps - 1) {
              setCurrentStep(prev => prev + 1);
            } else {
              router.push(`/recipes/${id}`);
            }
          }}
          className="p-4 rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-200 active:scale-95 transition-all"
        >
          {currentStep === totalSteps - 1 ? <CheckCircle size={32} /> : <ChevronRight size={32} />}
        </button>
      </footer>
    </main>
  );
}