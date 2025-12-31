"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { ChefHat, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-emerald-600 p-1.5 rounded-lg">
            <ChefHat className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            Conscious<span className="text-emerald-600">Cuisine</span>
          </span>
        </Link>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/recipes" className="text-sm font-medium text-slate-600 hover:text-emerald-600">Recipes</Link>
          <Link href="/scientists" className="text-sm font-medium text-slate-600 hover:text-emerald-600">The Science</Link>
          <Link href="/chef" className="text-sm font-medium text-slate-600 hover:text-emerald-600">Chef Cary</Link>
        </div>

        {/* Auth & Mobile Toggle */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              {(profile?.role === 'chef' || profile?.role === 'scientist') && (
                <Link href="/dashboard" className="p-2 text-slate-500 hover:text-emerald-600"><LayoutDashboard size={20} /></Link>
              )}
              <Link href="/profile" className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium">
                <User size={16} /> <span>{profile?.name?.split(' ')[0] || "Profile"}</span>
              </Link>
              <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500"><LogOut size={20} /></button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold">Sign In</Link>
          )}

          {/* Mobile Hamburger Button */}
          <button onClick={toggleMenu} className="md:hidden p-2 text-slate-600">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 p-6 flex flex-col gap-6 shadow-xl animate-in slide-in-from-top-2">
          <Link href="/recipes" onClick={toggleMenu} className="text-lg font-bold text-slate-900">Recipes Library</Link>
          <Link href="/scientists" onClick={toggleMenu} className="text-lg font-bold text-slate-900">Clinical Science</Link>
          <Link href="/chef" onClick={toggleMenu} className="text-lg font-bold text-slate-900">About Chef Cary</Link>
          <hr />
          {user ? (
            <>
              <Link href="/profile" onClick={toggleMenu} className="text-lg font-bold text-emerald-600 flex items-center gap-2"><User size={20}/> My Profile</Link>
              <button onClick={() => { logout(); toggleMenu(); }} className="text-lg font-bold text-red-500 flex items-center gap-2"><LogOut size={20}/> Sign Out</button>
            </>
          ) : (
            <Link href="/login" onClick={toggleMenu} className="bg-emerald-600 text-white text-center py-4 rounded-2xl font-bold">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}