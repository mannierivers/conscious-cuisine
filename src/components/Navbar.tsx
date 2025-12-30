"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { ChefHat, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-emerald-600 p-1.5 rounded-lg">
            <ChefHat className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            Conscious<span className="text-emerald-600">Cuisine</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/recipes" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Recipes</Link>
          <Link href="/scientists" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">The Science</Link>
          <Link href="/chef" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Chef Cary</Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {(profile?.role === 'chef' || profile?.role === 'scientist' || profile?.role === 'admin') && (
                <Link 
                  href="/dashboard" 
                  className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
                  title="Professional Dashboard"
                >
                  <LayoutDashboard size={20} />
                </Link>
              )}
              
              <Link href="/profile" className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-200">
                <User size={16} />
                <span className="hidden sm:inline">{profile?.name?.split(' ')[0] || "Profile"}</span>
              </Link>
              
              <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}