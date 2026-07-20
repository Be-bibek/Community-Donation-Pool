"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "@/components/header";
import { CampaignOverview } from "@/components/campaign-overview";
import { DonorWall } from "@/components/donor-wall";
import { useWalletStore } from "@/lib/wallet-store";
import { Droplet, HelpCircle, ShieldCheck, Heart } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"overview" | "wall">("overview");
  const { fetchDonations } = useWalletStore();

  // Load baseline Stellar donations on mount
  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Premium Sticky Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 pb-24 sm:pb-12 space-y-8">
        
        {/* Mobile Tab Control (Visible only on mobile devices to optimize UX) */}
        <div className="block sm:hidden">
          <div className="grid grid-cols-2 p-1 bg-stone-900/60 border border-white/10 rounded-xl">
            <button
              id="mobile-tab-overview"
              onClick={() => setActiveTab("overview")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${
                activeTab === "overview"
                  ? "bg-stone-800 text-amber-400 shadow-sm border border-white/5"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Campaign
            </button>
            <button
              id="mobile-tab-wall"
              onClick={() => setActiveTab("wall")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${
                activeTab === "wall"
                  ? "bg-stone-800 text-amber-400 shadow-sm border border-white/5"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Donor Wall
            </button>
          </div>
        </div>

        {/* Sliding Page Transition container */}
        <div className="relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === "overview" ? (
              <motion.div
                key="campaign-tab-view"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <CampaignOverview />
              </motion.div>
            ) : (
              <motion.div
                key="donor-wall-view"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <DonorWall />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Trust & Verification Footer (No margin clutter, elegant design) */}
      <footer className="mt-auto border-t border-white/5 bg-stone-950/40 py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p className="flex items-center gap-1 font-sans">
            Made with Love by <span className="text-amber-400 font-bold">Freighter Dev</span> ❤️
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-medium font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Secure Ledger
            </span>
            <span className="font-mono text-stone-600">Stellar Testnet v2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
