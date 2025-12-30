"use client";

import { useAuth } from "@/hooks/useAuth";
import { ChefHat, Beaker, PlusCircle, List } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { profile, loading } = useAuth();

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!profile) return <div className="p-20 text-center">Please sign in to access the dashboard.</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900">Professional Dashboard</h1>
          <p className="text-slate-500">Welcome, {profile.name}. Role: <span className="capitalize font-bold text-emerald-600">{profile.role}</span></p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Chef Section */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <ChefHat className="text-emerald-600" size={28} />
              <h2 className="text-2xl font-bold">Culinary Lab</h2>
            </div>
            <p className="text-slate-500 mb-8">Add new signature recipes or edit existing flavor profiles.</p>
            <Link href="/dashboard/add-recipe" className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
              <PlusCircle size={20} /> Create New Recipe
            </Link>
          </div>

          {/* Scientist Section */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Beaker className="text-blue-600" size={28} />
              <h2 className="text-2xl font-bold">Clinical Audit</h2>
            </div>
            <p className="text-slate-500 mb-8">Review recipes and add medical annotations or "Science Nuggets."</p>
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all">
              <List size={20} /> Audit Pending Recipes
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}