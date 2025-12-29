"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ShieldCheck, Activity, Heart, AlertTriangle, Save, CheckCircle2 } from "lucide-react";

const COMMON_CONDITIONS = [
  "Hypertension", "Type 2 Diabetes", "Celiac Disease", 
  "Chronic Kidney Disease", "Nut Allergy", "Dairy-Free", 
  "Low Sodium", "Heart Healthy", "Anti-Inflammatory"
];

export default function ProfilePage() {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // For this demo, we'll use a hardcoded user ID. 
  // In a full app, this comes from Firebase Auth (e.g., user.uid)
  const USER_ID = "guest_user_123";

  useEffect(() => {
    async function loadProfile() {
      const docRef = doc(db, "users", USER_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserName(data.name || "");
        setSelectedConditions(data.medicalHistory || []);
      }
    }
    loadProfile();
  }, []);

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition) 
        : [...prev, condition]
    );
  };

  const saveProfile = async () => {
    setSaving(true);
    await setDoc(doc(db, "users", USER_ID), {
      name: userName,
      medicalHistory: selectedConditions,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-emerald-100 p-3 rounded-2xl">
            <ShieldCheck className="text-emerald-600" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Medical Profile</h1>
            <p className="text-slate-500 text-sm">This data powers your AI Conscious Cuisine analysis.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Your Name</label>
            <input 
              type="text" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Cary Neff"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Medical Considerations</label>
            <div className="grid grid-cols-2 gap-3">
              {COMMON_CONDITIONS.map((condition) => (
                <button
                  key={condition}
                  onClick={() => toggleCondition(condition)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    selectedConditions.includes(condition)
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                      : "border-slate-100 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="font-medium">{condition}</span>
                  {selectedConditions.includes(condition) && <CheckCircle2 size={18} className="text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : saved ? "Profile Updated!" : <><Save size={20}/> Save Medical Profile</>}
          </button>
        </div>
      </div>
    </main>
  );
}