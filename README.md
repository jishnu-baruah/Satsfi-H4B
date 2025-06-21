# 🌐 SatsFi — AI-Powered Onchain Banking on CoreDAO

SatsFi is a next-generation DeFi assistant that lets anyone interact with blockchain-based financial protocols by simply typing what they want to do — like "Stake my CORE for the best yield."

No confusing interfaces. No technical jargon. Just plain language and real results.

**Submission for [Hack4Bengal 4.0](https://hack4bengal.tech/)**

---

## 🌍 Live Demo & Links

- **Live Demo:** [**satsfi.vercel.app**](https://satsfi.vercel.app/)
- **TCORE2 Explorer:** [scan.test2.btcs.network](https://scan.test2.btcs.network)

---

## 🚨 The Problem

DeFi is powerful — but most people never use it.
- **Complexity:** Too many protocols, wallets, and technical terms (gas fees, APYs, staking vs. lending).
- **High Stakes:** One small mistake can lead to a permanent loss of funds.
- **Intimidating:** The onboarding process is overwhelming for newcomers.

---

## ✅ The Solution: SatsFi

SatsFi makes DeFi **as simple as sending a message**.

### Just type:
> "Stake my CORE for the best yield"

### SatsFi will:
- **Understand Your Intent:** Uses the Gemini API to comprehend plain-language commands.
- **Suggest the Best Strategy:** Analyzes live APYs from CoreDAO protocols to find the optimal choice.
- **Secure Confirmation:** Lets you confirm and sign the transaction securely from your connected wallet.
- **Display Results:** Shows your earnings and positions in a clean, intuitive dashboard.

---

## 🚀 Key Features

### 🧠 Powered by AI (Gemini)
- **Intent Understanding:** Deciphers user prompts to determine financial goals.
- **Personalized Recommendations:** Suggests DeFi strategies tailored to the user.
- **Concept Explanations:** Clarifies DeFi concepts in plain English.
- **Dynamic Action Mapping:** Translates user intent into smart contract interactions.

### 🔐 Seamless Web3 Onboarding with Civic
- **One-Click Login:** Utilizes the Civic Embedded Wallet for a passwordless experience.
- **No Seed Phrases:** Removes the biggest hurdle for new Web3 users.
- **External Wallet Support:** Allows experienced users to connect their own wallets for signing transactions.

### 🧱 Built on CoreDAO
- **Native Tokens:** Leverages **CORE** and **stCORE** within the ecosystem.
- **Live on Testnet:** Deployed and running on the **TCORE2 Testnet**.
- **EVM-Compatible:** Built with Solidity for staking and lending smart contracts.
- **Fast & Secure:** Benefits from CoreDAO's low gas fees and Bitcoin-powered security.

### 🗂️ MongoDB Offchain Layer
- **Data Storage:** Persists user prompts, AI outputs, and transaction logs.
- **Enhanced User Experience:** Enables analytics, user context, and real-time dashboard data.
- **Portfolio Aggregation:** Aggregates wallet activity and portfolio data for a comprehensive overview.

---

## 🧪 What Can You Do on Day One?

- ✅ Stake CORE and earn yield via stCORE.
- ✅ Ask: "What's the best way to earn on my crypto?"
- ✅ Borrow against your collateral (coming soon).
- ✅ Track your full portfolio performance in a clean dashboard.
- ✅ Learn DeFi concepts — explained by the AI, in context.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, Wagmi, Ethers.js, TailwindCSS, shadcn/ui
- **Backend:** Node.js, Express, MongoDB
- **Smart Contracts:** Solidity, Hardhat
- **AI Layer:** Gemini API (custom prompt engineering)
- **Auth:** Civic Embedded Wallet + wagmi for Web3 wallet connection
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## 🏁 Getting Started

Follow these instructions to set up and run the project locally.

### 1. Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or later)
- [pnpm](https://pnpm.io/installation)
- [MongoDB](https://www.mongodb.com/try/download/community) account and a connection URI.

### 2. Clone the Repository
```bash
git clone https://github.com/jishnu-baruah/Satsfi-H4B
cd Satsfi-H4B
```

### 3. Setup Backend
```bash
cd backend
pnpm install
```
Create a `.env` file in the `backend` directory and add the following variables:
```env
PORT=5001
MONGODB_URI="your_mongodb_connection_string"
GEMINI_API_KEY="your_gemini_api_key"
COINGECKO_API_KEY="your_coingecko_demo_api_key"
```
Run the backend server:
```bash
pnpm start
```
The backend will be running at `http://localhost:5001`.

### 4. Setup Frontend
```bash
cd ../frontend
pnpm install
```
Create a `.env.local` file in the `frontend` directory and add the following variable:
```env
NEXT_PUBLIC_CIVIC_CLIENT_ID="your_civic_client_id"
NEXT_PUBLIC_API_URL="http://localhost:5001/api"
```
Run the frontend development server:
```bash
pnpm dev
```
The frontend will be available at `http://localhost:3000`.

### 5. Setup Smart Contracts
The contracts are already deployed on the CoreDAO testnet. To compile or redeploy them yourself:
```bash
cd ../contracts
pnpm install
```
Create a `.env` file in the `contracts` directory:
```env
TESTNET_RPC_URL="https://rpc.test2.btcs.network"
PRIVATE_KEY="your_wallet_private_key"
```
To compile the contracts:
```bash
pnpm hardhat compile
```
To run tests:
```bash
pnpm hardhat test
```
To deploy:
```bash
pnpm hardhat run scripts/deploy.ts --network core_testnet
```

---

## 📝 Deployed Smart Contract Addresses (TCORE2)

- **Staking Vault:** `0xE3451D1081232BE36b257F712120B8d78f07e5F6`
- **Lending Pool:** `0xFcE44C16e18F98d58dDC85b8c803B9CaBFeBf542`
- **stCORE Token:** `0x5bDf8f6F713eb68E8740B6c764C389EE5a277990`

---

## 💡 Why It Matters

SatsFi is not just a wallet or dashboard — it's a **Web3-native AI companion** that turns any user's intent into secure, optimized onchain actions.

It's **DeFi that listens. DeFi that guides. DeFi that works — instantly.**

---

## 📌 Coming Soon

- Yield farming across multiple protocols
- More token support (USDT, BTC wrappers)
- Onchain AI agent for automated portfolio optimization
- Fully embedded Civic wallet transactions

---

## 🙌 Built With ❤️ for CoreDAO + Civic + Gemini
SatsFi is a submission to the **Hack4Bengal 4.0** — aiming to simplify DeFi onboarding, maximize onchain yield, and bring millions into Web3 with AI-powered guidance. 