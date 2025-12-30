"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Beaker, Sparkles, Save, ArrowLeft, Microscope, Info, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AuditDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { profile } = useAuth();
  
  const [recipe, setRecipe] = useState<any>(null);
  const [scienceSnippet, setScienceSnippet] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [isAiGenerating, setIsAiGenerating] = useState(false);

  useEffect(() => {
    async function fetchRecipe() {
      const docSnap = await getDoc(doc(db, "recipes", id as string));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRecipe(data);
        // Clear placeholder so scientist can type fresh
        setScienceSnippet(""); 
      }
    }
    fetchRecipe();
  }, [id]);

  const handleSaveAudit = async () => {
    setIsSaving(true);
    const ref = doc(db, "recipes", id as string);
    await updateDoc(ref, {
      nutritionScienceSnippet: scienceSnippet,
      auditedBy: profile.name,
      auditedAt: new Date().toISOString()
    });
    router.push("/dashboard/science-audit");
  };

  const generateAiSuggestion = async () => {
  setIsAiGenerating(true);
  try {
    const response = await fetch("/api/science-assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: recipe.title,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        category: recipe.category
      }),
    });
    const data = await response.json();
    
    // Instead of replacing, we provide a "Review & Apply" feel
    if (data.suggestion) {
      setScienceSnippet(data.suggestion);
    }
  } catch (err) {
    console.error("AI Error:", err);
  } finally {
    setIsAiGenerating(false);
  }
};

  if (!recipe) return <div className="p-20 text-center">Loading Workspace...</div>;

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Dark Audit Header */}
      <header className="border-b border-slate-800 py-6 px-8 sticky top-16 z-40 bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/science-audit" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Microscope className="text-blue-400" /> Clinical Audit: {recipe.title}
            </h1>
          </div>
          <button 
            onClick={handleSaveAudit}
            disabled={isSaving || scienceSnippet.length < 10}
            className="bg-blue-600 text-white px-8 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-blue-500 transition-all disabled:opacity-50"
          >
            {isSaving ? "Finalizing..." : <><Save size={18}/> Approve & Publish</>}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8 grid md:grid-cols-2 gap-12">
        {/* Left: Chef's Content (ReadOnly) */}
        <div className="space-y-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Chef's Recipe Content</h3>
            <h2 className="text-3xl font-serif font-bold mb-4">{recipe.title}</h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-300">Ingredients</h4>
                <p className="text-sm text-slate-400">{recipe.ingredients.join(", ")}</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-300">Description</h4>
                <p className="text-sm text-slate-400">{recipe.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Scientist Input */}
        <div className="space-y-6">
          <div className="bg-blue-900/20 p-8 rounded-3xl border border-blue-500/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Beaker className="text-blue-400" /> Clinical Annotation
              </h2>
              <button 
               onClick={generateAiSuggestion}
               disabled={isAiGenerating}
               className="text-xs font-bold bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-500/40 transition-all disabled:opacity-50"
               >
                {isAiGenerating ? (
                <Loader2 size={14} className="animate-spin" />
                 ) : (
                  <Sparkles size={14} />
                )}
                  {isAiGenerating ? "Generating..." : "AI Science Assist"}
              </button>
             </div>
            
            <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
              The "Science Behind the Bite" (Visible to Users)
            </label>
            <textarea 
              rows={8}
              value={scienceSnippet}
              onChange={(e) => setScienceSnippet(e.target.value)}
              placeholder="e.g., 'The high sulforaphane content in the roasted cauliflower supports liver phase II detoxification...'"
              className="w-full p-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm leading-relaxed"
            />
            
            <div className="mt-6 flex gap-3 text-slate-400 text-xs">
              <Info size={16} className="shrink-0" />
              <p>This snippet will appear as a "Nutrition Science" nugget on the recipe page once approved.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}