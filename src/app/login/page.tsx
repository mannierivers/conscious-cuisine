"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ChefHat, Mail, Lock, Chrome, Apple, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { loginWithGoogle, loginWithApple, loginWithEmail } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginWithEmail(email, password);
      router.push("/recipes");
    } catch (err: any) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (method: () => Promise<void>) => {
    try {
      await method();
      router.push("/recipes");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 text-center bg-slate-900 text-white">
          <div className="bg-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ChefHat size={28} />
          </div>
          <h1 className="text-2xl font-serif font-bold italic">Conscious Cuisine</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your clinical kitchen</p>
        </div>

        <div className="p-8 space-y-6">
          {error && <p className="text-red-500 text-center text-sm font-medium">{error}</p>}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="email" placeholder="Email Address" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="password" placeholder="Password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase font-bold">Or continue with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleSocialLogin(loginWithGoogle)}
              className="flex items-center justify-center gap-2 border border-slate-200 py-3 rounded-xl hover:bg-slate-50 transition-all font-medium"
            >
              <Chrome size={18} className="text-slate-600" /> Google
            </button>
            <button 
              onClick={() => handleSocialLogin(loginWithApple)}
              className="flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl hover:bg-slate-900 transition-all font-medium"
            >
              <Apple size={18} /> Apple
            </button>
          </div>

          <p className="text-center text-slate-500 text-sm">
            Don't have an account? <button className="text-emerald-600 font-bold hover:underline">Create profile</button>
          </p>
        </div>
      </div>
    </main>
  );
}