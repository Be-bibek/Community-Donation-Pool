"use client";

import { useWalletStore, DONATION_GOAL, POOL_ADDRESS } from "@/lib/wallet-store";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart, Flame, ShieldCheck, HelpCircle, ArrowRight, Sun, Droplets, CheckCircle2 } from "lucide-react";

export function CampaignOverview() {
  const { totalRaised, isConnected, donate, connect, isConnecting } = useWalletStore();
  
  // Form States
  const [donateAmount, setDonateAmount] = useState<string>("50");
  const [donorName, setDonorName] = useState<string>("");
  const [donorMessage, setDonorMessage] = useState<string>("");
  
  // Transaction Steps
  const [txStep, setTxStep] = useState<"idle" | "preparing" | "signing" | "submitting" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const percentage = Math.min(Math.round((totalRaised / DONATION_GOAL) * 100), 100);

  const handlePreset = (amount: number) => {
    setDonateAmount(amount.toString());
  };

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(donateAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    if (!isConnected) {
      setTxStep("signing"); // Guide to wallet connection flow
      try {
        const addr = await connect();
        if (addr) {
          setTxStep("idle");
        } else {
          setTxStep("idle");
        }
      } catch (err) {
        setTxStep("idle");
      }
      return;
    }

    setTxStep("preparing");
    setErrorMsg(null);

    try {
      // Step 2: Signing
      setTxStep("signing");
      const hash = await donate(amountNum, donorName, donorMessage);
      
      // Step 3: Success
      setTxHash(hash);
      setTxStep("success");
      
      // Reset form on success
      setDonateAmount("50");
      setDonorName("");
      setDonorMessage("");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong during transaction execution.");
      setTxStep("error");
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. MASSIVE, VISUALLY STRIKING PROGRESS BAR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-stone-900/40 backdrop-blur-md p-6 sm:p-8 shadow-xl"
      >
        {/* Subtle Decorative Grid Pattern / Aura */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-15" />
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-yellow-400/10 blur-3xl" />

        {/* Header Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 mb-3 border border-amber-500/20">
              <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-amber-500" /> Active Campaign
            </span>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white font-display">
              Water is Life & Hope 💧
            </h2>
            <p className="text-stone-400 text-sm max-w-xl leading-relaxed">
              Solar-powered well construction and filtration system to provide safe, sustainable drinking water for over 350 families in Hope Valley.
            </p>
          </div>
          
          <div className="flex md:flex-col justify-between items-end gap-2 shrink-0 bg-stone-900/60 p-4 rounded-2xl border border-white/5 min-w-[200px]">
            <div className="flex flex-col">
              <span className="text-stone-500 text-xs font-medium">Raised so far</span>
              <span className="text-3xl font-extrabold tabular-nums text-amber-400 font-display">
                {totalRaised.toLocaleString()} XLM
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-stone-500 text-xs font-medium">Target Goal</span>
              <span className="text-sm font-semibold tabular-nums text-stone-300">
                {DONATION_GOAL.toLocaleString()} XLM
              </span>
            </div>
          </div>
        </div>

        {/* Progress Container */}
        <div className="relative mt-8">
          {/* Progress Label / Tooltip */}
          <div className="flex justify-between text-xs font-mono font-bold text-stone-400 mb-2 px-1">
            <span>Progress: {percentage}% Raised</span>
            <span>Goal: {DONATION_GOAL} XLM</span>
          </div>

          {/* Bar track */}
          <div className="relative h-10 w-full bg-stone-900/80 rounded-2xl overflow-hidden p-1.5 border border-white/5">
            {/* Glowing inner bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-xl progress-glow relative overflow-hidden"
            >
              {/* Highlight shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xs font-black text-stone-200 tracking-wider font-mono">
                {percentage}% COMPLETED
              </span>
            </div>
          </div>

          {/* Mini Stats Grid inside Progress section */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/5">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-mono font-bold">Completed</p>
              <p className="text-lg font-bold font-display text-white">{percentage}%</p>
            </div>
            <div className="text-center border-x border-white/5">
              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-mono font-bold">Status</p>
              <p className="text-lg font-bold font-display text-emerald-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Trusted
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-mono font-bold">Ledger Contract</p>
              <p className="text-xs font-mono font-bold text-amber-400 hover:underline cursor-pointer truncate px-2" title="Click to view address">
                {POOL_ADDRESS.substring(0, 5)}...{POOL_ADDRESS.substring(POOL_ADDRESS.length - 5)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. TWO-COLUMN BENTO BOX ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cause Story / Bento Info Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Cause Main Bento Card */}
          <div className="rounded-3xl border border-white/10 bg-stone-900/40 backdrop-blur-md p-6 space-y-4">
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-amber-400" /> Safe Water for Families ☀️
            </h3>
            <p className="text-sm leading-relaxed text-stone-300">
              Currently, women and children in Hope Valley must walk over 4.5 miles daily to collect water of dubious safety from river banks. This campaign raises funding to dig a 180-meter community borehole powered by high-efficiency solar panels and install five distribution tapstands across the village.
            </p>
            <p className="text-sm leading-relaxed text-stone-400">
              By utilizing the high-speed and ultra-low-fee <strong className="text-stone-200">Stellar Network</strong>, 100% of your contributions go directly toward on-the-ground construction costs, fully auditable and verified on-ledger.
            </p>
          </div>

          {/* Bento Grid Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-white/5 bg-stone-900/30 backdrop-blur-sm space-y-2">
              <div className="p-2 w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">100% Solar Powered</h4>
              <p className="text-xs text-stone-400">Zero-emission water extraction pumps powered entirely by reliable sunlight.</p>
            </div>

            <div className="p-5 rounded-2xl border border-white/5 bg-stone-900/30 backdrop-blur-sm space-y-2">
              <div className="p-2 w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">Stellar Auditable</h4>
              <p className="text-xs text-stone-400">Track funds transparently. Every transaction can be examined on the ledger.</p>
            </div>
          </div>
        </motion.div>

        {/* DONATE NOW INPUT FORM COLUMN */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-5"
        >
          <div className="rounded-3xl border border-white/10 bg-stone-900/60 p-6 shadow-xl space-y-6 relative backdrop-blur-md">
            <div className="absolute top-4 right-4 flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </div>

            <div className="border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-amber-400 fill-current animate-pulse" /> Support This Project
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">Your donation makes an immediate impact.</p>
            </div>

            {/* Donation Form */}
            <form onSubmit={handleDonateSubmit} className="space-y-4">
              {/* Optional Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-400 flex justify-between">
                  <span>Your Name (Optional)</span>
                  <span className="text-[10px] font-mono text-stone-500">Publicly visible</span>
                </label>
                <input
                  id="donor-name-input"
                  type="text"
                  placeholder="Anonymous Hero 🌟"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-stone-900/80 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400/50 text-sm font-medium transition-all text-white placeholder-stone-500"
                  maxLength={30}
                />
              </div>

              {/* Optional Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-400">Support Message (Optional)</label>
                <textarea
                  id="donor-msg-input"
                  placeholder="Leave an encouraging note for the community... ❤️"
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-stone-900/80 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400/50 text-sm font-medium h-16 resize-none transition-all text-white placeholder-stone-500"
                  maxLength={100}
                />
              </div>

              {/* Highly Visible Amount Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-400 flex items-center justify-between">
                  <span>Donation Amount</span>
                  <span className="font-mono text-[10px] text-stone-500">Horizon Testnet XLM</span>
                </label>
                <div className="relative rounded-xl border border-white/10 bg-stone-900/80 overflow-hidden focus-within:ring-2 focus-within:ring-amber-400/20 focus-within:border-amber-400/50 transition-all">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-lg">Ξ</span>
                  <input
                    id="donation-amount-input"
                    type="number"
                    min="1"
                    step="any"
                    required
                    placeholder="50"
                    value={donateAmount}
                    onChange={(e) => setDonateAmount(e.target.value)}
                    className="w-full pl-10 pr-16 py-3.5 bg-transparent text-xl font-bold font-display focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-white placeholder-stone-500"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                    <span className="text-sm font-extrabold text-amber-400 font-display">XLM</span>
                  </div>
                </div>
              </div>

              {/* Presets - quick select */}
              <div className="grid grid-cols-4 gap-2">
                {[10, 50, 100, 250].map((amt) => (
                  <button
                    key={amt}
                    id={`preset-${amt}-btn`}
                    type="button"
                    onClick={() => handlePreset(amt)}
                    className={`py-2 rounded-lg text-xs font-bold font-mono transition-all border cursor-pointer ${
                      donateAmount === amt.toString()
                        ? "bg-amber-400/10 border-amber-400 text-amber-400"
                        : "bg-stone-900 hover:bg-stone-800 text-stone-400 border-white/5"
                    }`}
                  >
                    +{amt}
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <button
                id="submit-donation-btn"
                type="submit"
                disabled={txStep !== "idle" && txStep !== "success" && txStep !== "error"}
                className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-75 font-sans"
              >
                {!isConnected ? (
                  <>
                    Connect Wallet to Donate
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-current" />
                    Donate {donateAmount || "0"} XLM
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* 3. TRANSACTION STEP OVERLAY / MODAL MODULAR POPUP */}
      <AnimatePresence>
        {txStep !== "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6"
            >
              {txStep === "preparing" && (
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto relative">
                    <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold font-display text-foreground">Preparing Transaction...</h4>
                  <p className="text-xs text-muted-foreground">
                    Querying account sequence and building payment operations on Stellar Horizon Testnet.
                  </p>
                </div>
              )}

              {txStep === "signing" && (
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto relative animate-pulse">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold font-display text-foreground">Awaiting Signature</h4>
                  <p className="text-xs text-muted-foreground">
                    Please approve and sign the transaction popup inside your Freighter Wallet extension.
                  </p>
                </div>
              )}

              {txStep === "submitting" && (
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto relative">
                    <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold font-display text-foreground">Broadcasting to Ledger</h4>
                  <p className="text-xs text-muted-foreground">
                    Submitting signed XDR to the Stellar Testnet. This usually takes 3-5 seconds.
                  </p>
                </div>
              )}

              {txStep === "success" && (
                <div className="text-center space-y-4 py-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <h4 className="text-xl font-bold font-display text-foreground">Thank You! 🎉</h4>
                  <p className="text-xs text-muted-foreground">
                    Your contribution of <strong className="text-foreground">{donateAmount} XLM</strong> was successfully submitted and permanently recorded on the Stellar Testnet ledger!
                  </p>
                  
                  {txHash && (
                    <div className="p-3 bg-muted/60 border border-border rounded-xl font-mono text-[10px] break-all select-all flex flex-col items-center gap-1">
                      <span className="text-muted-foreground uppercase font-bold">Transaction Hash</span>
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-bold text-center block"
                      >
                        {txHash}
                      </a>
                    </div>
                  )}

                  <button
                    id="success-close-btn"
                    onClick={() => setTxStep("idle")}
                    className="w-full py-2.5 rounded-xl font-semibold text-xs border border-border bg-card text-foreground hover:bg-muted/80 transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}

              {txStep === "error" && (
                <div className="text-center space-y-4 py-2">
                  <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold font-display text-foreground">Transaction Failed</h4>
                  <p className="text-xs text-rose-500 font-medium">
                    {errorMsg}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Make sure you have Freighter unlocked, connected to the <strong className="text-foreground">TESTNET</strong> network, and funded with testnet XLM.
                  </p>

                  <div className="flex gap-2">
                    <a
                      href="https://friendbot.stellar.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-xl text-center font-semibold text-[10px] border border-border bg-card hover:bg-muted/80 text-foreground transition-all"
                    >
                      Fund with Friendbot
                    </a>
                    <button
                      id="error-close-btn"
                      onClick={() => setTxStep("idle")}
                      className="flex-1 py-2 rounded-xl font-semibold text-[10px] bg-primary text-primary-foreground hover:bg-primary/95 transition-all cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
