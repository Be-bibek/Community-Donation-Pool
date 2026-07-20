# 💧 CoFund - Community Donation Pool ☀️

A trustworthy, modern, and highly polished crowdfunding web application designed to raise community funds transparently. Integrated with the **Stellar Network (Testnet)** and the modern **Freighter Wallet (Stellar Wallets Kit v2)**, CoFund demonstrates how low-fee, instant-settlement blockchain payments can power real-world humanitarian efforts.

![Home Screen](https://picsum.photos/seed/cofund-banner/1200/600)

## 🌟 Overview

CoFund focuses on a single, compelling local cause: **digging a solar-powered community water well** in Hope Village. By mapping every single donation directly to the blockchain, CoFund establishes unprecedented donor trust. Donors can see real-time campaign progress, submit contributions via their wallet extension, and view their names, customized messages, and transaction records permanently sealed on the **Stellar Testnet Ledger**.

---

## ✨ Key Features

- **Massive Golden Progress Bar**: A glowing, responsive header tracker displaying real-time funds raised against the goal, powered by actual ledger balances.
- **Web3 Wallet Connection**: Fully integrated with the `@creit.tech/stellar-wallets-kit` (v2 API) for secure, popup-free authentication.
- **Direct Ledger Payments**: Builds, signs, and broadcasts real payment transactions securely via `@stellar/stellar-sdk` on the Stellar Horizon Testnet.
- **Interactive Donor Wall**: A beautifully styled wall showing public contributors, their personalized support message, and direct explorer verification links.
- **System-Connected Themes**: Implements a warm, elegant Light and Dark mode using custom CSS variables, preventing styling breakage.
- **Visual Micro-Interactions**: Framer Motion powered slide page transitions, staggered list entrances, and button hovering scaling.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://motion.dev/)
- **Blockchain Core**: `@stellar/stellar-sdk` & `@creit.tech/stellar-wallets-kit`
- **State Engine**: [Zustand](https://github.com/pmndrs/zustand)
- **Theme Manager**: `next-themes`
- **Icons**: `lucide-react`

---

## 🚀 Getting Started

### Prerequisites

1. Install the [Freighter Wallet browser extension](https://www.freighter.app/).
2. Change the network setting inside Freighter to **Testnet** (Settings > Network > Select Testnet).
3. Fund your Freighter account with Testnet XLM using the [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=testnet) or directly from our in-app link.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the application.

### Building for Production

To produce a standalone production build:
```bash
npm run build
npm run start
```

---

Made with Love by **Freighter Dev** ❤️
