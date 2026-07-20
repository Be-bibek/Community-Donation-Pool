"use client";

import { ThemeToggle } from "./theme-toggle";
import { WalletConnect } from "./wallet-connect";
import { Sparkles } from "lucide-react";

interface HeaderProps {
  activeTab: "overview" | "wall";
  setActiveTab: (tab: "overview" | "wall") => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-stone-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-amber-400 text-stone-950 shadow-md">
            {/* Custom SVG Community Hands and Pool Logo */}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253"
              />
            </svg>
            <div className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-[8px] text-white ring-2 ring-stone-950 font-bold animate-pulse">
              ✓
            </div>
          </div>
          <div>
            <h1 className="text-base font-black font-display tracking-tight leading-none text-white flex items-center gap-1">
              CoFund <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h1>
            <p className="text-[10px] text-stone-500 font-mono">Testnet Pool</p>
          </div>
        </div>

        {/* Tab Switcher - Segmented Glass Control */}
        <div className="hidden sm:flex p-1 bg-stone-900/60 backdrop-blur-sm border border-white/10 rounded-xl">
          <button
            id="tab-overview"
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-stone-800 text-amber-400 shadow-sm font-semibold border border-white/5"
                : "text-stone-400 hover:text-white"
            }`}
          >
            Campaign Overview
          </button>
          <button
            id="tab-wall"
            onClick={() => setActiveTab("wall")}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === "wall"
                ? "bg-stone-800 text-amber-400 shadow-sm font-semibold border border-white/5"
                : "text-stone-400 hover:text-white"
            }`}
          >
            Donor Wall
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
