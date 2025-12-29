import { Beaker, Microscope, ShieldCheck } from "lucide-react";

export default function ScientistsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6 text-emerald-600">
          <Microscope size={48} />
        </div>
        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6">
          The Science of <span className="text-emerald-600">Conscious Cuisine</span>
        </h1>
        <p className="text-xl text-slate-600 mb-12 leading-relaxed">
          Led by Chef Cary Neff, our clinical team bridge the gap between world-class gastronomy and medical necessity. 
          Every recipe undergoes a multi-point scientific audit.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <Beaker className="text-emerald-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Nutrient Density</h3>
            <p className="text-sm text-slate-500">We analyze ingredients at the molecular level to maximize bioavailability.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <ShieldCheck className="text-emerald-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Clinical Safety</h3>
            <p className="text-sm text-slate-500">Registered Dietitians flag contraindications for chronic conditions.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <Microscope className="text-emerald-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">AI Validation</h3>
            <p className="text-sm text-slate-500">Powered by Groq, our AI cross-references your medical history in milliseconds.</p>
          </div>
        </div>
      </div>
    </main>
  );
}