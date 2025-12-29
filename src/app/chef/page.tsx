import { ChefHat, Quote, Leaf, HeartPulse } from "lucide-react";
import Link from "next/link";

export default function ChefPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-slate-900 py-24 px-6 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <ChefHat size={48} className="mx-auto mb-6 text-emerald-400" />
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 italic">Chef Cary Neff</h1>
          <p className="text-2xl text-slate-300 font-light leading-relaxed">
            "Flavor is a Medical Necessity."
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">The Philosophy of Conscious Cuisine</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Cary Neff revolutionized the way we think about health-focused dining. By focusing on nutrient-dense ingredients and innovative cooking techniques, he proved that clinical wellness doesn't require a compromise on the palate.
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              This platform represents the next evolution: bringing the Chef, the Scientist, and the AI together to serve you.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700"><Leaf size={20}/></div>
                <span className="font-bold text-slate-800 uppercase tracking-widest text-sm">Plant-Forward Innovation</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700"><HeartPulse size={20}/></div>
                <span className="font-bold text-slate-800 uppercase tracking-widest text-sm">Clinically Validated</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-100 rounded-3xl p-12 aspect-square flex flex-col justify-center relative overflow-hidden">
            <Quote className="text-slate-200 absolute -top-4 -left-4" size={120} />
            <p className="text-2xl font-serif italic text-slate-800 relative z-10 leading-relaxed">
              "We aren't just making food. We are crafting a lifestyle where every bite supports the life you want to lead."
            </p>
            <p className="mt-6 font-bold text-emerald-600 tracking-widest uppercase">— Cary Neff</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 py-20 text-center text-white">
        <h2 className="text-3xl font-bold mb-8">Ready to taste the difference?</h2>
        <Link 
          href="/recipes" 
          className="bg-white text-emerald-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all"
        >
          Explore the Library
        </Link>
      </section>
    </main>
  );
}