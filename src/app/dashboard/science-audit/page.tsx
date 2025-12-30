"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Beaker, AlertCircle, ArrowRight, ClipboardCheck } from "lucide-react";
import Link from "next/link";

export default function ScienceAuditListPage() {
  const { profile } = useAuth();
  const [pendingRecipes, setPendingRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPending() {
      // Find recipes that haven't been audited yet
      const q = query(
        collection(db, "recipes"), 
        where("nutritionScienceSnippet", "==", "Awaiting Clinical Review by Science Team...")
      );
      
      const snap = await getDocs(q);
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPendingRecipes(docs);
      setLoading(false);
    }
    fetchPending();
  }, []);

  if (profile?.role !== 'scientist' && profile?.role !== 'admin') {
    return <div className="p-20 text-center">Unauthorized: Scientist Access Only.</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <Beaker className="text-blue-600" size={36} /> Clinical Audit Queue
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Reviewing {pendingRecipes.length} recipes for nutritional integrity.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 italic text-slate-400 text-xl">Loading Queue...</div>
        ) : pendingRecipes.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
            <ClipboardCheck size={48} className="mx-auto text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">Queue Clear!</h3>
            <p className="text-slate-500">All recipes currently meet Conscious Cuisine standards.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingRecipes.map(recipe => (
              <Link 
                key={recipe.id} 
                href={`/dashboard/science-audit/${recipe.id}`}
                className="group bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-blue-400 transition-all shadow-sm"
              >
                <div>
                  <h3 className="font-bold text-xl text-slate-900">{recipe.title}</h3>
                  <p className="text-slate-500 text-sm">Chef: {recipe.chefName} • Added: {new Date(recipe.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3 text-blue-600 font-bold uppercase tracking-widest text-xs">
                  Audit Recipe <ArrowRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}