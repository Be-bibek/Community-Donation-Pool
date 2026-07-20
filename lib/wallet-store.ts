import { create } from "zustand";
import { StellarWalletsKit, Networks } from "@creit.tech/stellar-wallets-kit";
import { FreighterModule } from "@creit.tech/stellar-wallets-kit/modules/freighter";
import {
  Horizon,
  TransactionBuilder,
  Transaction,
  Operation,
  Asset,
  BASE_FEE,
  TimeoutInfinite,
} from "@stellar/stellar-sdk";

// Define the public key of the community donation pool
export const POOL_ADDRESS = "GCPOOLH3X57WUXQGQUYFCEKB6DQXNLW74E7AEM7C3YEPWZ66P6XWLFLG";
export const DONATION_GOAL = 5000; // Goal of 5000 XLM

export interface Donor {
  id: string;
  name: string;
  avatar: string;
  amount: number;
  message: string;
  timestamp: string;
  txHash: string;
  isReal: boolean;
}

interface WalletState {
  publicKey: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  totalRaised: number;
  donors: Donor[];
  isLoadingDonors: boolean;
  error: string | null;
  kitInstance: any;
  
  initKit: () => any;
  connect: () => Promise<string | null>;
  disconnect: () => void;
  fetchDonations: () => Promise<void>;
  donate: (amount: number, name: string, message: string) => Promise<string>;
}

// Default mock donors for fallback and rich layout visual consistency
const DEFAULT_DONORS: Donor[] = [
  {
    id: "1",
    name: "Aria Sterling",
    avatar: "https://picsum.photos/seed/aria/100/100",
    amount: 1500,
    message: "Building a brighter future for the kids. So happy to support this!",
    timestamp: "2026-07-19T14:30:00Z",
    txHash: "8b7fae3223ef...43e2",
    isReal: false,
  },
  {
    id: "2",
    name: "Marcus Vance",
    avatar: "https://picsum.photos/seed/marcus/100/100",
    amount: 850,
    message: "Water is a human right. Hope we hit the goal soon!",
    timestamp: "2026-07-19T09:15:00Z",
    txHash: "a1c2d3e4f5a6...7b8c",
    isReal: false,
  },
  {
    id: "3",
    name: "Elena Rostova",
    avatar: "https://picsum.photos/seed/elena/100/100",
    amount: 500,
    message: "Sending love and strength from Prague! ☀️💛",
    timestamp: "2026-07-18T18:45:00Z",
    txHash: "f1e2d3c4b5a6...9e8d",
    isReal: false,
  },
  {
    id: "4",
    name: "Julian K.",
    avatar: "https://picsum.photos/seed/julian/100/100",
    amount: 250,
    message: "Count me in! Let's make this happen.",
    timestamp: "2026-07-18T11:20:00Z",
    txHash: "d4c3b2a1f5e4...8d9c",
    isReal: false,
  },
];

export const useWalletStore = create<WalletState>((set, get) => ({
  publicKey: null,
  isConnected: false,
  isConnecting: false,
  totalRaised: 3100, // Starts with default mock totals, added with real pool transactions
  donors: DEFAULT_DONORS,
  isLoadingDonors: false,
  error: null,
  kitInstance: null,

  initKit: () => {
    if (get().kitInstance) return get().kitInstance;

    const kit = StellarWalletsKit.init({
      network: Networks.TESTNET,
      modules: [new FreighterModule()],
    });

    set({ kitInstance: kit });
    return kit;
  },

  connect: async () => {
    set({ isConnecting: true, error: null });
    try {
      const kit = get().initKit();
      
      // Call authModal as requested
      await kit.authModal();
      
      const { address } = await kit.getAddress();
      if (address) {
        set({
          publicKey: address,
          isConnected: true,
          isConnecting: false,
        });
        
        // Save to localStorage
        localStorage.setItem("pool_wallet_connected_addr", address);
        return address;
      }
      set({ isConnecting: false });
      return null;
    } catch (err: any) {
      console.error("Wallet connection error:", err);
      set({
        error: err.message || "Failed to connect Freighter wallet",
        isConnecting: false,
      });
      return null;
    }
  },

  disconnect: () => {
    set({ publicKey: null, isConnected: false });
    localStorage.removeItem("pool_wallet_connected_addr");
  },

  fetchDonations: async () => {
    set({ isLoadingDonors: true });
    try {
      const server = new Horizon.Server("https://horizon-testnet.stellar.org");
      
      // 1. Fetch account info to get the actual live balance if it exists
      let liveBalance = 0;
      try {
        const accountInfo = await server.loadAccount(POOL_ADDRESS);
        const nativeAsset = accountInfo.balances.find((b) => b.asset_type === "native");
        if (nativeAsset) {
          liveBalance = parseFloat(nativeAsset.balance);
        }
      } catch (e) {
        console.log("Pool account does not exist or has 0 balance:", e);
      }

      // 2. Fetch payments sent to the pool address
      let horizonDonors: Donor[] = [];
      try {
        const paymentsPage = await server
          .payments()
          .forAccount(POOL_ADDRESS)
          .order("desc")
          .limit(30)
          .call();

        // Map payment operations to Donor model
        horizonDonors = paymentsPage.records
          .filter((rec: any) => rec.type === "payment" && rec.to === POOL_ADDRESS && rec.asset_type === "native")
          .map((rec: any) => {
            // Retrieve local customized metadata if this user donated during this browser session
            const savedMetadata = localStorage.getItem(`tx_metadata_${rec.transaction_hash}`);
            let donorName = `Stellar Wallet (${rec.from.substring(0, 4)}...${rec.from.substring(rec.from.length - 4)})`;
            let message = "Contributed to the Community Fund! 🌟";
            
            if (savedMetadata) {
              try {
                const parsed = JSON.parse(savedMetadata);
                donorName = parsed.name || donorName;
                message = parsed.message || message;
              } catch (_) {}
            }

            const avatarSeed = rec.from.substring(2, 6);

            return {
              id: rec.id,
              name: donorName,
              avatar: `https://picsum.photos/seed/${avatarSeed}/100/100`,
              amount: parseFloat(rec.amount),
              message: message,
              timestamp: rec.created_at,
              txHash: rec.transaction_hash,
              isReal: true,
            };
          });
      } catch (e) {
        console.error("Failed to fetch payments from Horizon:", e);
      }

      // 3. Merge live transactions with mock list for a robust, premium display
      const mergedDonors = [...horizonDonors, ...DEFAULT_DONORS];
      
      // Ensure unique IDs
      const uniqueDonorsMap = new Map<string, Donor>();
      mergedDonors.forEach((d) => {
        if (d.isReal) {
          // Real always overrides
          uniqueDonorsMap.set(d.txHash, d);
        } else {
          uniqueDonorsMap.set(d.id, d);
        }
      });
      
      const uniqueDonorsList = Array.from(uniqueDonorsMap.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Total is mock baseline (3100) + any additional real testnet transactions
      const realTotalFromHorizon = horizonDonors.reduce((acc, d) => acc + d.amount, 0);
      const totalCalculated = Math.max(3100 + realTotalFromHorizon, liveBalance);

      set({
        donors: uniqueDonorsList,
        totalRaised: Math.round(totalCalculated * 100) / 100,
        isLoadingDonors: false,
      });
    } catch (err: any) {
      console.error("Error fetching donation data:", err);
      set({ isLoadingDonors: false });
    }
  },

  donate: async (amount: number, name: string, message: string) => {
    const { publicKey } = get();
    if (!publicKey) {
      throw new Error("Wallet not connected. Please connect your wallet first.");
    }

    try {
      const kit = get().initKit();
      const server = new Horizon.Server("https://horizon-testnet.stellar.org");
      
      // Load donor account
      const account = await server.loadAccount(publicKey);
      
      // Build payment transaction to POOL_ADDRESS
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: "Test SDF Network ; September 2015",
      })
        .addOperation(
          Operation.payment({
            destination: POOL_ADDRESS,
            asset: Asset.native(),
            amount: amount.toString(),
          })
        )
        .setTimeout(TimeoutInfinite)
        .build();

      const xdr = transaction.toXDR();
      
      // Sign with kit
      const signResult = await kit.sign({
        xdr,
        publicKey,
        network: Networks.TESTNET,
      });

      const signedXdr = typeof signResult === "string" ? signResult : (signResult.signedTxXdr || signResult.result);
      if (!signedXdr) {
        throw new Error("Failed to sign transaction. Sign result was empty.");
      }

      // Submit transaction to Horizon
      const response = await server.submitTransaction(
        new Transaction(signedXdr, "Test SDF Network ; September 2015")
      );
      
      const txHash = response.hash;

      // Store metadata in localStorage to load on next fetch
      localStorage.setItem(
        `tx_metadata_${txHash}`,
        JSON.stringify({
          name: name || "Anonymous Hero",
          message: message || "Contributed to the Community Fund!",
        })
      );

      // Refresh donations list
      await get().fetchDonations();

      return txHash;
    } catch (err: any) {
      console.error("Donation transaction failed:", err);
      // In a real testnet app, we might get an error if the source account doesn't have funds
      // Let's throw a helpful message
      let msg = err.message || "Stellar transaction failed";
      if (err.response?.data?.extras?.result_codes?.operations?.[0] === "op_underfunded") {
        msg = "Transaction failed: Your Testnet account has insufficient XLM funds.";
      } else if (err.response?.data?.extras?.result_codes?.transaction === "tx_bad_seq") {
        msg = "Transaction failed: Bad Sequence number. Please try again.";
      }
      throw new Error(msg);
    }
  },
}));
