# 📘 Satsfi – Instructions Guide

## 🚀 Project Overview

**Satsfi** is an intent-centric Bitcoin-powered DeFi neobank that helps users stake BTC, earn optimized yield, and borrow stablecoins seamlessly — all with a Revolut-like dashboard interface. It uses:

* **Next.js** for frontend (dashboard + user input)
* **Express.js** for backend (intent resolution, smart contract interaction)
* **Core blockchain** for DeFi operations (BTC staking, borrowing)
* **Civic**, **MongoDB**, and **Chainlink** for identity, data, and pricing

---

## ✅ Prerequisites & Dependencies

Make sure you have the following installed:

* **Node.js** (v18+ recommended)
* **Yarn** or **npm**
* **Docker** (optional, for MongoDB and future containerization)
* Git

---

## 📦 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/satsfi.git
cd satsfi
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
# or
yarn install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
# or
yarn install
```

---

## 🛠️ Running the Project

### ➤ Development Mode

#### 1. Start Backend

```bash
cd backend
npm run dev
# Runs on http://localhost:5000 by default
```

#### 2. Start Frontend

```bash
cd ../frontend
npm run dev
# Runs on http://localhost:3000 by default
```

---

### 🏗️ Production Build

#### Backend

```bash
cd backend
npm run build
npm start
```

#### Frontend

```bash
cd frontend
npm run build
npm start
```

---

## 🧪 Usage Instructions

### Example 1: Yield Intent

User types:

> “Maximize yield on 0.5 BTC”

**Satsfi Flow:**

* Backend parses intent
* Converts BTC → stCORE
* Stakes into best-yield vault
* Frontend displays:
  *"Your 0.5 BTC is earning 6.2% in Pell Vault."*

---

### Example 2: Borrowing Intent

User types:

> “Borrow 2000 USDC without selling BTC”

**Satsfi Flow:**

* Locks BTC at 150% collateral
* Finds best lending pool
* Delivers USDC to wallet
* Frontend displays loan health metrics

---

## ⚙️ Environment Setup (.env)

Create a `.env` file in both `frontend/` and `backend/` folders.

### Example `.env` for `backend/`

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/satsfi
CIVIC_API_KEY=your-civic-api-key
CHAINLINK_NODE_URL=https://your-node.chainlink.com
GEMINI_API_KEY=your-gemini-api-key
CORE_RPC_URL=https://core.rpc.network
```

### Example `.env.local` for `frontend/`

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CIVIC_ENV=dev
NEXT_PUBLIC_CHAIN_ENV=testnet
```

---

## 🗂 File Structure Overview

```bash
satsfi/
├── frontend/             # Next.js frontend app
│   ├── components/       # UI components (widgets, cards, etc.)
│   ├── pages/            # Routes/pages (e.g. index.tsx, dashboard.tsx)
│   ├── utils/            # API functions, helpers
│   └── public/           # Static assets
├── backend/              # Express backend server
│   ├── routes/           # API route handlers
│   ├── controllers/      # Logic for staking, borrowing, etc.
│   ├── services/         # Civic, Gemini, Chainlink integrations
│   ├── models/           # MongoDB schemas
│   └── utils/            # Intent parser, validators, etc.
└── README.md
```

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


