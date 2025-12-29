import Link from 'next/link';
import { ChefHat, HeartPulse, BrainCircuit, ArrowRight } from 'lucide-react';

export default function HomePage() {
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
            Conscious <span className="text-emerald-600">Cuisine</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Experience the culinary philosophy of Chef Cary Neff. 
            Where nutrition science meets world-class flavor, personalized for your medical journey.
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
            className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all text-center inline-block"
            >
            Meet the Scientists
            </Link>
            
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center"><HeartPulse className="text-emerald-500" size={32} /></div>
          <h3 className="text-xl font-bold text-slate-900">Medical Precision</h3>
          <p className="text-slate-500">Every ingredient is analyzed against your specific medical history for absolute safety.</p>
        </div>
        <div className="text-center space-y-4">
          <div className="flex justify-center"><ChefHat className="text-emerald-500" size={32} /></div>
          <h3 className="text-xl font-bold text-slate-900">Flavor First</h3>
          <p className="text-slate-500">Developed by Chef Cary Neff to prove that "healthy" never has to mean "bland."</p>
        </div>
        <div className="text-center space-y-4">
          <div className="flex justify-center"><BrainCircuit className="text-emerald-500" size={32} /></div>
          <h3 className="text-xl font-bold text-slate-900">AI Powered Insights</h3>
          <p className="text-slate-500">Real-time substitutions and nutrition science powered by Groq Llama 3 AI.</p>
        </div>
      </section>
    </main>
  );
}