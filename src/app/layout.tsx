import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ChefHat, Search, User } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Conscious Cuisine | Chef Cary Neff",
  description: "A culinary platform where flavor meets medical science.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Universal Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <ChefHat className="text-white" size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                Conscious<span className="text-emerald-600">Cuisine</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/recipes" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
                Recipes
              </Link>
              <Link href="/scientists" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
                The Science
              </Link>
              <Link href="/chef" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
                Chef Cary
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-slate-600">
                <Search size={20} />
              </button>
              <button className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-200 transition-all">
                <User size={16} />
                <span>Sign In</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        {children}

        {/* Simple Footer */}
        <footer className="border-t border-slate-200 bg-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Conscious Cuisine by Chef Cary Neff. All Rights Reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}