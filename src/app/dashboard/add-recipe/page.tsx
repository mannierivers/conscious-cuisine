"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import ImageUpload from "@/components/dashboard/ImageUpload";
import { ChefHat, Plus, Trash2, Save, ArrowLeft, Utensils, Clapperboard, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AddRecipePage() {
  const { profile } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Anti-Inflammatory");
  const [difficulty, setDifficulty] = useState("Medium");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState(""); // NEW
  const [chefTips, setChefTips] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [isSaving, setIsSaving] = useState(false);

  const addField = (setter: any, current: string[]) => setter([...current, ""]);
  const removeField = (setter: any, current: string[], index: number) => {
    if (current.length > 1) setter(current.filter((_, i) => i !== index));
  };
  const updateField = (setter: any, current: string[], index: number, value: string) => {
    const next = [...current];
    next[index] = value;
    setter(next);
  };

  const handleSave = async () => {
    if (!title) return alert("Title required.");
    setIsSaving(true);
    try {
      await addDoc(collection(db, "recipes"), {
        title, description, category, difficulty, imageUrl, videoUrl, chefTips,
        ingredients: ingredients.filter(i => i.trim() !== ""),
        steps: steps.filter(s => s.trim() !== ""),
        chefName: profile?.name || "Cary Neff",
        createdAt: serverTimestamp(),
        nutritionScienceSnippet: "Awaiting clinical audit by Breanna Neff, CFS..."
      });
      router.push("/recipes");
    } catch (err) { console.error(err); } finally { setIsSaving(false); }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-32">
      <header className="bg-white border-b border-slate-200 py-6 px-8 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={20} /></Link>
            <h1 className="text-2xl font-serif font-bold">New <span className="text-emerald-600">Creation</span></h1>
          </div>
          <button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 text-white px-10 py-3 rounded-full font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Publish Content
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8 grid lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200">
             <ImageUpload onUploadComplete={(url) => setImageUrl(url)} />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-6">
            <h3 className="font-serif font-bold text-xl flex items-center gap-2 border-b pb-4"><Utensils size={20} className="text-emerald-500" /> Essentials</h3>
            <div><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Dish Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" placeholder="e.g. Cedar Plank Salmon" /></div>
            
            <div><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Clinical Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl appearance-none">
              <option>Heart Healthy</option><option>Anti-Inflammatory</option><option>Glycemic Control</option><option>Renal Support</option><option>Brain Health</option>
            </select></div>
            
            <div><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block italic">Video Masterclass URL (Phase 2)</label>
            <div className="flex items-center gap-2 bg-slate-900 text-white p-2 rounded-2xl">
              <div className="bg-slate-800 p-2 rounded-xl"><Clapperboard size={18} className="text-emerald-400" /></div>
              <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full" placeholder="https://..." />
            </div></div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-8 border-b pb-6">
              <h2 className="text-2xl font-serif font-bold">The Palette (Ingredients)</h2>
              <button onClick={() => addField(setIngredients, ingredients)} className="text-emerald-600 font-bold text-sm flex items-center gap-2"><Plus size={18} /> Add Component</button>
            </div>
            <div className="grid gap-3">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-3 group">
                  <input type="text" value={ing} onChange={e => updateField(setIngredients, ingredients, idx, e.target.value)} className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl" placeholder={`Ingredient ${idx + 1}`} />
                  <button onClick={() => removeField(setIngredients, ingredients, idx)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-8 border-b pb-6">
              <h2 className="text-2xl font-serif font-bold">Clinical Process (Steps)</h2>
              <button onClick={() => addField(setSteps, steps)} className="text-emerald-600 font-bold text-sm flex items-center gap-2"><Plus size={18} /> Add Step</button>
            </div>
            <div className="grid gap-6">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <span className="text-4xl font-serif font-black text-slate-100 group-hover:text-emerald-100 transition-colors">{idx + 1}</span>
                  <textarea value={step} onChange={e => updateField(setSteps, steps, idx, e.target.value)} className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl min-h-[100px]" placeholder="Describe the culinary intervention..." />
                  <button onClick={() => removeField(setSteps, steps, idx)} className="text-slate-300 hover:text-rose-500 transition-colors h-fit mt-4"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}