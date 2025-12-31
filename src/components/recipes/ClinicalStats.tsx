"use client";

export default function ClinicalStats({ recipes }: { recipes: any[] }) {
  const categories = recipes.reduce((acc: any, recipe) => {
    const cat = recipe.category || "General";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {Object.entries(categories).map(([name, count]: [string, any]) => (
        <div key={name} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{name}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-slate-900">{count}</span>
            <span className="text-xs text-emerald-600 font-medium">Dishes</span>
          </div>
        </div>
      ))}
    </div>
  );
}