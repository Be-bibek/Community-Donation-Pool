"use client";

import { useWalletStore, POOL_ADDRESS } from "@/lib/wallet-store";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ArrowUpDown, Copy, Check, ExternalLink, Heart, Award, Trophy, Users, Landmark, RotateCw } from "lucide-react";

export function DonorWall() {
  const { donors, totalRaised, fetchDonations, isLoadingDonors } = useWalletStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "amount">("recent");
  const [copiedPool, setCopiedPool] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const copyPoolAddress = () => {
    navigator.clipboard.writeText(POOL_ADDRESS);
    setCopiedPool(true);
    setTimeout(() => setCopiedPool(false), 2000);
  };

  // Find stats
  const totalDonorsCount = donors.length;
  const highestDonation = donors.reduce((max, d) => (d.amount > max ? d.amount : max), 0);
  const highestDonor = donors.find((d) => d.amount === highestDonation);

  // Filter & Sort donors
  const filteredDonors = donors
    .filter((d) => {
      const matchQuery = searchQuery.toLowerCase();
      return (
        d.name.toLowerCase().includes(matchQuery) ||
        d.message.toLowerCase().includes(matchQuery) ||
        d.txHash.toLowerCase().includes(matchQuery)
      );
    })
    .sort((a, b) => {
      if (sortBy === "amount") {
        return b.amount - a.amount;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  return (
    <div className="space-y-8">
      {/* 1. BENTO BOX STATISTICS SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Funds */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-5 rounded-2xl border border-white/10 bg-stone-900/40 backdrop-blur-md flex items-center gap-4 shadow-sm"
        >
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-semibold">Total Funds Raised</p>
            <p className="text-xl font-bold font-display text-white">{totalRaised.toLocaleString()} XLM</p>
          </div>
        </motion.div>

        {/* Card 2: Total Donors */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="p-5 rounded-2xl border border-white/10 bg-stone-900/40 backdrop-blur-md flex items-center gap-4 shadow-sm"
        >
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-semibold">Supporters Pool</p>
            <p className="text-xl font-bold font-display text-white">{totalDonorsCount} Donors</p>
          </div>
        </motion.div>

        {/* Card 3: Top Contributor */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-5 rounded-2xl border border-white/10 bg-stone-900/40 backdrop-blur-md flex items-center gap-4 shadow-sm"
        >
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-semibold">Top Donation</p>
            <p className="text-sm font-bold text-white truncate">
              {highestDonor ? highestDonor.name : "Aria Sterling"}
            </p>
            <p className="text-xs font-mono font-bold text-amber-400">
              {highestDonation.toLocaleString()} XLM
            </p>
          </div>
        </motion.div>

        {/* Card 4: Ledger Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="p-5 rounded-2xl border border-white/10 bg-stone-900/40 backdrop-blur-md space-y-2 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-semibold flex items-center gap-1">
              <Landmark className="w-3 h-3" /> Stellar Ledger Address
            </span>
            <button
              id="copy-pool-addr-btn"
              onClick={copyPoolAddress}
              className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="Copy Pool Public Address"
            >
              {copiedPool ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-xs font-mono font-bold text-stone-200 truncate" title={POOL_ADDRESS}>
            {POOL_ADDRESS}
          </p>
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-stone-500">Horizon Testnet</span>
            <a
              href={`https://stellar.expert/explorer/testnet/account/${POOL_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline flex items-center gap-0.5 font-bold"
            >
              View on Explorer <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* 2. SEARCH, SORT & REFRESH CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/5 bg-stone-900/30 backdrop-blur-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            id="donor-search-input"
            type="text"
            placeholder="Search donors, notes, or transaction hashes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/10 bg-stone-950 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400/50 text-sm transition-all text-white placeholder-stone-500"
          />
        </div>

        {/* Sort & Sync Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex rounded-xl border border-white/10 bg-stone-950 p-1 text-xs">
            <button
              id="sort-recent"
              onClick={() => setSortBy("recent")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
                sortBy === "recent" ? "bg-stone-800 text-amber-400 font-bold shadow-sm" : "text-stone-400 hover:text-white"
              }`}
            >
              <ArrowUpDown className="w-3 h-3" /> Recent
            </button>
            <button
              id="sort-amount"
              onClick={() => setSortBy("amount")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
                sortBy === "amount" ? "bg-stone-800 text-amber-400 font-bold shadow-sm" : "text-stone-400 hover:text-white"
              }`}
            >
              <Heart className="w-3 h-3" /> Top Donors
            </button>
          </div>

          <button
            id="sync-donations-btn"
            onClick={fetchDonations}
            disabled={isLoadingDonors}
            className="p-2 rounded-xl border border-white/10 bg-stone-950 hover:bg-stone-900 text-stone-400 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Ledger Sync"
          >
            <RotateCw className={`w-4 h-4 ${isLoadingDonors ? "animate-spin text-amber-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* 3. CONTRIBUTOR LIST */}
      <div className="space-y-4">
        {isLoadingDonors && donors.length === 0 ? (
          <div className="text-center py-12 space-y-3 rounded-2xl border border-white/10 bg-stone-900/20">
            <svg className="animate-spin h-8 w-8 text-amber-400 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm text-stone-400 font-medium font-sans">Synchronizing with Stellar Testnet Ledger...</p>
          </div>
        ) : filteredDonors.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-white/10 bg-stone-900/20 space-y-1.5">
            <Heart className="w-10 h-10 text-stone-600 mx-auto" />
            <h4 className="text-sm font-semibold text-stone-300 font-sans">No donors found</h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto font-sans">
              {searchQuery ? "No matches for your search. Try another keyword!" : "Be the first to secure hope on the ledger."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredDonors.map((donor, idx) => (
                <motion.div
                  key={donor.isReal ? donor.txHash : donor.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                  whileHover={{ scale: 1.01 }}
                  className="p-5 rounded-2xl border border-white/5 bg-stone-900/40 backdrop-blur-md flex items-start gap-4 shadow-sm hover:border-amber-400/20 transition-all relative overflow-hidden group"
                >
                  {/* Ledger Verified Indicator Banner */}
                  {donor.isReal && (
                    <div className="absolute top-0 right-0 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-mono font-bold rounded-bl-lg border-l border-b border-emerald-500/20">
                      verified ledger
                    </div>
                  )}

                  {/* Seeded Avatar */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={donor.avatar}
                    alt={donor.name}
                    className="w-11 h-11 rounded-xl object-cover border border-white/10"
                  />

                  {/* Donor Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white truncate pr-6">{donor.name}</h4>
                      <span className="shrink-0 text-sm font-extrabold font-display text-amber-400">
                        {donor.amount.toLocaleString()} XLM
                      </span>
                    </div>

                    {/* Donor Message */}
                    <p className="text-xs text-stone-400 italic leading-relaxed line-clamp-3">
                      &ldquo;{donor.message}&rdquo;
                    </p>

                    {/* Footer Tx metadata */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 pt-1.5 border-t border-white/5">
                      <span>{new Date(donor.timestamp).toLocaleDateString()}</span>
                      
                      {donor.isReal ? (
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${donor.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400/80 hover:text-amber-400 hover:underline font-bold flex items-center gap-0.5 transition-colors"
                        >
                          Tx: {donor.txHash.substring(0, 4)}...{donor.txHash.substring(donor.txHash.length - 4)}{" "}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-[9px] uppercase tracking-wider font-bold text-stone-600">baseline ledger</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
