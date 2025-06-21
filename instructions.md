# 📘 Satsfi – Instructions Guide

## 🚀 Project Overview

**Satsfi** is an intent-centric DeFi neobank. It uses AI to parse user requests and interacts with smart contracts on the Core blockchain to manage staking and lending.

*   **Frontend:** Next.js, `wagmi` for wallet connection, and `@civic/auth` for social login.
*   **Backend:** Express.js, Mongoose (MongoDB), and Google's Gemini API for intent parsing.
*   **Smart Contracts:** Solidity contracts for lending (`LendingPool`) and staking (`StakingVault`).

---

## ✅ Prerequisites

*   Node.js (v18+ recommended)
*   npm, pnpm, or yarn
*   Git

---

## 📦 Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd satsfi

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Install contract dependencies
cd ../contracts
npm install
```

---

## 🛠️ Environment Setup

Create a `.env` file in the `backend/` directory and a `.env.local` file in the `frontend/` directory. You will also need one in `contracts/` for deployment.

### Backend (`backend/.env`)
```env
# The port the backend server will run on
PORT=5001
# Your MongoDB connection string
MONGODB_URI=mongodb+srv://<user>:<password>@<your-cluster-url>/satsfi?retryWrites=true&w=majority
# Your API key from Google AI Studio for the Gemini API
GEMINI_API_KEY=your-gemini-api-key
```

### Frontend (`frontend/.env.local`)
```env
# The full URL of your running backend server
NEXT_PUBLIC_API_URL=http://localhost:5000
# The Client ID for your Civic application from the Civic developer dashboard
NEXT_PUBLIC_CIVIC_CLIENT_ID=your-civic-client-id
```

### Smart Contracts (`contracts/.env`)
Used for deploying contracts to a live network.
```env
# The RPC URL for the network (e.g., Core Testnet)
TESTNET_RPC_URL=https://rpc.test2.btcs.network
# The private key of the wallet you are deploying from
PRIVATE_KEY=your-wallet-private-key
```

---

## 🏃 Running the Project Locally

```bash
# Terminal 1: Start the backend server
cd backend
npm run dev

# Terminal 2: Start the frontend server
cd frontend
npm run dev
# App will run on http://localhost:3000
```

---

## 🗂 High-Level Architecture

```
satsfi/
├── backend/              # Express.js API
│   ├── controllers/      # Business logic (staking, lending, users)
│   ├── models/           # Mongoose schemas (Transaction, User)
│   └── services/         # Connects to external services (Gemini API)
│
├── frontend/             # Next.js App
│   ├── app/              # App Router directory structure
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks (e.g., usePortfolio)
│   └── services/         # Frontend services (e.g., priceService)
│
└── contracts/            # Solidity Smart Contracts
    ├── contracts/        # Source code for .sol files
    ├── scripts/          # Deployment scripts (e.g., deploy.ts)
    └── hardhat.config.ts # Hardhat configuration
```

---

## 🧪 Usage Instructions

### Example 1: Yield Intent

User types:

> "Maximize yield on 0.5 BTC"

**Satsfi Flow:**

* Backend parses intent
* Converts BTC → stCORE
* Stakes into best-yield vault
* Frontend displays:
  *"Your 0.5 BTC is earning 6.2% in Pell Vault."*

---

### Example 2: Borrowing Intent

User types:

> "Borrow 2000 USDC without selling BTC"

**Satsfi Flow:**

* Locks BTC at 150% collateral
* Finds best lending pool
* Delivers USDC to wallet
* Frontend displays loan health metrics

---

## 🧩 Common Issues & Troubleshooting

| Issue                              | Fix                                                                               |
| ---------------------------------- | --------------------------------------------------------------------------------- |
| **Civic API not authenticating**   | Check `.env` key, make sure you're on correct Civic environment (`dev`, `prod`)   |
| **MongoDB not connecting**         | Ensure your cluster is live and IP whitelisted. Use `0.0.0.0/0` for testing.      |
| **Chainlink prices not returning** | Verify your node endpoint and aggregator availability                             |
| **Frontend CORS issues**           | Make sure the Express server has CORS enabled and frontend points to correct port |
| **Intent not resolving**           | Check backend intent parser logic (`intentParser.js`) and debug output            |

---

## 📬 Contribution & Community

Want to help build Satsfi?
Please open an issue, PR, or reach out on [Discord](#) or [Telegram](#).


