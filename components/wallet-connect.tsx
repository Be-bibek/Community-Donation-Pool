"use client";

import { useWalletStore } from "@/lib/wallet-store";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wallet, LogOut, Copy, Check, ShieldAlert } from "lucide-react";

export function WalletConnect() {
  const { publicKey, isConnected, isConnecting, connect, disconnect, error } = useWalletStore();
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Check if wallet was connected previously in this browser session
  useEffect(() => {
    const savedAddr = localStorage.getItem("pool_wallet_connected_addr");
    if (savedAddr && !publicKey) {
      // Re-initialize state
      useWalletStore.setState({ publicKey: savedAddr, isConnected: true });
    }
  }, [publicKey]);

  const handleConnect = async () => {
    await connect();
  };

  const copyAddress = () => {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddress = publicKey
    ? `${publicKey.substring(0, 5)}...${publicKey.substring(publicKey.length - 5)}`
    : "";

  return (
    <div className="relative inline-block text-left">
      <AnimatePresence mode="wait">
        {!isConnected ? (
          <motion.button
            id="wallet-connect-btn"
            key="connect-btn"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 cursor-pointer"
          >
            {isConnecting ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Connecting Freighter...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </>
            )}
          </motion.button>
        ) : (
          <div key="connected-group" className="flex items-center gap-2">
            <motion.div
              id="wallet-info-pill"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card/60 backdrop-blur-md cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {/* Active Pulse Dot */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-medium text-foreground">{shortAddress}</span>
            </motion.div>

            <button
              id="wallet-disconnect-btn"
              onClick={disconnect}
              className="p-2.5 rounded-xl border border-border bg-card/50 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all cursor-pointer"
              title="Disconnect Wallet"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </AnimatePresence>

      {/* Copy notification option when connected */}
      {isConnected && (
        <button
          id="copy-address-btn"
          onClick={copyAddress}
          className="absolute -bottom-6 right-0 text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy address
            </>
          )}
        </button>
      )}

      {/* Error Banner */}
      {error && (
        <div className="absolute right-0 top-12 z-50 w-72 p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 text-xs flex items-start gap-2 backdrop-blur-md">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Wallet Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
