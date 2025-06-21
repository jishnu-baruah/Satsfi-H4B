# 📘 Satsfi – Instructions Guide

## 🚀 Project Overview

**Satsfi** is an intent-centric Bitcoin-powered DeFi neobank that helps users stake BTC, earn optimized yield, and borrow stablecoins seamlessly. It uses AI to parse user requests and interacts with DeFi protocols on the Core blockchain.

*   **Frontend:** Next.js, `wagmi` for wallet connection, and `@civic/auth` for social login.
*   **Backend:** Express.js, Mongoose (MongoDB), and Google's Gemini API for intent parsing.
*   **Smart Contracts:** Solidity contracts for lending and staking (currently mocked in the backend).

---

## ✅ Prerequisites

Make sure you have the following installed:
*   **Node.js** (v18+ recommended)
*   **Yarn** or **pnpm** or **npm**
*   **Git**

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
```

---

## 🛠️ Environment Setup

Create a `.env` file in the `backend/` directory and a `.env.local` file in the `frontend/` directory.

### Backend (`backend/.env`)
The backend requires a MongoDB connection string and a Gemini API key for intent parsing.

```env
# The port the backend server will run on
PORT=5001

# Your MongoDB connection string
MONGODB_URI=mongodb+srv://<user>:<password>@<your-cluster-url>/satsfi?retryWrites=true&w=majority

# Your API key from Google AI Studio for the Gemini API
GEMINI_API_KEY=your-gemini-api-key
```

### Frontend (`frontend/.env.local`)
The frontend requires the URL of the backend API and the Civic Client ID for authentication.

```env
# The full URL of your running backend server
NEXT_PUBLIC_API_URL=http://localhost:5001

# The Client ID for your Civic application.
# Get this from the Civic developer dashboard.
NEXT_PUBLIC_CIVIC_CLIENT_ID=your-civic-client-id
```

---

## 🏃 Running the Project Locally

You must have both the backend and frontend servers running.

```bash
# Terminal 1: Start the backend server
cd backend
npm run dev
# Server will run on http://localhost:5001

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
│   ├── controllers/      # Handles business logic (staking, borrowing, users)
│   ├── models/           # Mongoose schemas (Transaction, User)
│   ├── routes/           # Defines API endpoints
│   └── services/         # Connects to external services (Gemini API)
│
├── frontend/             # Next.js App
│   ├── app/              # App Router directory structure
│   ├── components/       # Reusable UI components (Navbar, IntentInput, etc.)
│   ├── hooks/            # Custom React hooks
│   └── services/         # Connects to external services (CoinGecko via backend proxy)
│
└── contracts/            # Solidity Smart Contracts
    ├── contracts/        # Source code for the .sol files
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


