import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Conscious Cuisine | Chef Cary Neff",
  description: "Experience the culinary philosophy of Chef Cary Neff. Where nutrition science meets world-class flavor.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Conscious",
  },
  formatDetection: {
    telephone: false,
    },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            
            {/* The page content renders here */}
            <div className="flex-grow">
              {children}
            </div>

            <footer className="border-t border-slate-200 bg-white py-12">
              <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-slate-400 text-sm italic font-serif">
                  "Flavor is a Medical Necessity" — Chef Cary Neff
                </p>
                <p className="text-slate-300 text-[10px] mt-4 uppercase tracking-[0.2em]">
                  © {new Date().getFullYear()} Conscious Cuisine Platform. All Rights Reserved.
                </p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}