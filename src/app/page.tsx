"use client";

import dynamic from 'next/dynamic'; // 1. Import dynamic
import { useAuth } from "@/hooks/useAuth";
import Link from 'next/link';
import { ChefHat, HeartPulse, BrainCircuit, ArrowRight, Loader2 } from 'lucide-react';

// 2. Create the internal component
function HomePageContent() {
  const { profile, loading } = useAuth();

  // If auth is still loading, show a clean loading state to prevent flickering
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-100 p-3 rounded-2xl">
              <ChefHat className="text-emerald-600" size={40} />
            </div>
          </div>

          <h1 className="text-6xl font-serif font-bold text-slate-900 mb-6">
            {profile?.role === 'chef' ? `Welcome back, Chef.` : `Conscious Cuisine`}
          </h1>

          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            {profile?.role === 'chef' 
              ? "Your culinary library is currently being analyzed by our clinical AI to support your diners' health." 
              : "Experience the culinary philosophy of Chef Cary Neff. Where nutrition science meets world-class flavor."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/recipes" 
              className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              Explore Recipes <ArrowRight size={20} />
            </Link>
            
            <Link 
              href="/scientists"
              className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all text-center"
            >
              Meet the Scientists
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
        <div className="space-y-4">
          <div className="flex justify-center"><HeartPulse className="text-emerald-500" size={32} /></div>
          <h3 className="text-xl font-bold text-slate-900">Medical Precision</h3>
          <p className="text-slate-500">Every ingredient is analyzed against your specific medical history.</p>
        </div>
        <div className="space-y-4">
          <div className="flex justify-center"><ChefHat className="text-emerald-500" size={32} /></div>
          <h3 className="text-xl font-bold text-slate-900">Flavor First</h3>
          <p className="text-slate-500">Healthy eating never has to mean sacrificing the palate.</p>
        </div>
        <div className="space-y-4">
          <div className="flex justify-center"><BrainCircuit className="text-emerald-500" size={32} /></div>
          <h3 className="text-xl font-bold text-slate-900">AI Powered</h3>
          <p className="text-slate-500">Real-time substitutions and science powered by Groq.</p>
        </div>
      </section>
    </main>
  );
}

// 3. Export with SSR disabled to fix the build error
export default dynamic(() => Promise.resolve(HomePageContent), {
  ssr: false,
});