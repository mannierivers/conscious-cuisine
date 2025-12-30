"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { 
  ChefHat, Plus, Trash2, Save, ArrowLeft, 
  Sparkles, Beaker, Utensils 
} from "lucide-react";
import Link from "next/link";

export default function AddRecipePage() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Anti-Inflammatory");
  const [difficulty, setDifficulty] = useState("Medium");
  const [chefTips, setChefTips] = useState("");
  
  // Dynamic Lists
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  
  const [isSaving, setIsSaving] = useState(false);

  // Handlers for dynamic lists
  const addField = (setter: any, current: string[]) => setter([...current, ""]);
  const removeField = (setter: any, current: string[], index: number) => {
    if (current.length > 1) setter(current.filter((_, i) => i !== index));
  };
  const updateField = (setter: any, current: string[], index: number, value: string) => {
    const next = [...current];
    next[index] = value;
    setter(next);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || profile.role !== 'chef' && profile.role !== 'admin') {
      alert("Unauthorized: Only chefs can publish recipes.");
      return;
    }

    setIsSaving(true);
    try {
      const docRef = await addDoc(collection(db, "recipes"), {
        title,
        description,
        category,
        difficulty,
        chefTips,
        ingredients: ingredients.filter(i => i.trim() !== ""),
        steps: steps.filter(s => s.trim() !== ""),
        chefName: profile.name,
        chefId: profile.uid,
        createdAt: serverTimestamp(),
        nutritionScienceSnippet: "Awaiting Clinical Review by Science Team...", // Placeholder for scientists
      });
      
      router.push(`/recipes/${docRef.id}`);
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Failed to save recipe.");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) return <div className="p-20 text-center">Verifying credentials...</div>;
  
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 py-6 px-8 sticky top-16 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ChefHat className="text-emerald-600" /> New Conscious Creation
            </h1>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-emerald-600 text-white px-8 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {isSaving ? "Publishing..." : <><Save size={18}/> Publish Recipe</>}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-8 grid md:grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Utensils size={18} /> Dish Essentials
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Recipe Title</label>
                <input 
                  type="text" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Cedar Plank Salmon"
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                <select 
                  value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                >
                  <option>Anti-Inflammatory</option>
                  <option>Heart Healthy</option>
                  <option>Low Glycemic</option>
                  <option>Plant Forward</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                <textarea 
                  rows={3} value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  placeholder="Describe the flavor profile..."
                />
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
            <h3 className="font-bold mb-2 text-amber-900 flex items-center gap-2">
              <Sparkles size={18} /> Chef's Tip
            </h3>
            <textarea 
              rows={4} value={chefTips} onChange={e => setChefTips(e.target.value)}
              className="w-full mt-1 p-3 bg-white/50 border border-amber-200 rounded-lg outline-none"
              placeholder="Any conscious techniques for this dish?"
            />
          </div>
        </div>

        {/* Right Column: Ingredients and Steps */}
        <div className="md:col-span-2 space-y-8">
          {/* Ingredients */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Ingredients</h2>
              <button 
                onClick={() => addField(setIngredients, ingredients)}
                className="text-emerald-600 text-sm font-bold flex items-center gap-1 hover:underline"
              >
                <Plus size={16} /> Add Ingredient
              </button>
            </div>
            <div className="space-y-3">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2">
                  <input 
                    type="text" value={ing} 
                    onChange={e => updateField(setIngredients, ingredients, idx, e.target.value)}
                    placeholder={`Ingredient ${idx + 1}`}
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                  <button onClick={() => removeField(setIngredients, ingredients, idx)} className="p-3 text-slate-300 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Preparation Steps</h2>
              <button 
                onClick={() => addField(setSteps, steps)}
                className="text-emerald-600 text-sm font-bold flex items-center gap-1 hover:underline"
              >
                <Plus size={16} /> Add Step
              </button>
            </div>
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="bg-slate-100 text-slate-400 font-bold w-10 h-10 flex items-center justify-center rounded-full shrink-0">
                    {idx + 1}
                  </span>
                  <textarea 
                    value={step} 
                    onChange={e => updateField(setSteps, steps, idx, e.target.value)}
                    placeholder="Describe this step..."
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                  <button onClick={() => removeField(setSteps, steps, idx)} className="mt-3 text-slate-300 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}