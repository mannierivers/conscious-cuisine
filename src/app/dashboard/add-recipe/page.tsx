"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { ChefHat, Plus, Trash2, Save, ArrowLeft, Utensils } from "lucide-react";
import Link from "next/link";
// 1. IMPORT THE NEW COMPONENT
import ImageUpload from "@/components/dashboard/ImageUpload"; 

export default function AddRecipePage() {
  const { profile } = useAuth();
  const router = useRouter();

  // --- FORM STATE ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Anti-Inflammatory");
  const [difficulty, setDifficulty] = useState("Medium");
  
  // 2. ADD THIS STATE TO STORE THE IMAGE URL
  const [imageUrl, setImageUrl] = useState(""); 
  
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [isSaving, setIsSaving] = useState(false);

  // --- HANDLERS ---
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
    if (!title || ingredients.length < 1) {
      alert("Please add a title and ingredients.");
      return;
    }

    setIsSaving(true);
    try {
      // 3. INCLUDE THE IMAGE URL IN THE FIRESTORE DOCUMENT
      await addDoc(collection(db, "recipes"), {
        title,
        description,
        category,
        difficulty,
        imageUrl, // <--- This saves the link from the upload component
        ingredients: ingredients.filter(i => i.trim() !== ""),
        steps: steps.filter(s => s.trim() !== ""),
        chefName: profile?.name || "Chef Cary Neff",
        createdAt: serverTimestamp(),
        nutritionScienceSnippet: "Awaiting Clinical Review by Science Team...",
      });
      
      router.push("/recipes");
    } catch (error) {
      console.error("Error saving recipe:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 py-6 px-8 sticky top-16 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">New Creation</h1>
          </div>
          <button 
            onClick={handleSave}
            className="bg-emerald-600 text-white px-8 py-2.5 rounded-full font-bold"
          >
            {isSaving ? "Publishing..." : "Publish Recipe"}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          
          {/* 4. THE IMAGE UPLOAD COMPONENT IS CALLED HERE */}
          {/* We pass 'setImageUrl' as the prop so the child can send the URL back up */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Recipe Imagery</label>
            <ImageUpload onUploadComplete={(url) => setImageUrl(url)} />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Utensils size={18} /> Dish Essentials
            </h3>
            <input 
              type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Recipe Title"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg mb-4"
            />
            {/* ... other basic info fields ... */}
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
           {/* ... Ingredients and Steps sections ... */}
        </div>
      </div>
    </main>
  );
}