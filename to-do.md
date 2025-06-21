# ✅ SatsFi MVP To-Do Plan

> This to-do list tracks the remaining integration and deployment work for the SatsFi MVP.

---

### 📂 Phase 6: Smart Contract Deployment & Integration

- [x] Write & verify smart contract deployment script (`deploy.ts`)
- [x] Deploy `LendingPool`, `StakingVault`, and `stCORE` to a public testnet
- [x] Replace mock addresses in `frontend/lib/config.ts` with deployed contract addresses
- [x] Connect backend services to deployed contract addresses via `ethers.js`
- [x] Use `.env` to securely manage RPC URLs and contract addresses

---

### 📊 Phase 7: Dashboard & Portfolio Live Data

- [x] Replace mock portfolio metrics with real data from smart contracts
  - [x] Fetch `stCORE` balance from `StakingVault`
  - [x] Fetch `CORE` borrowed from `LendingPool`
  - [x] Fetch health factor from the `LendingPool` contract
- [x] Update or create a `usePortfolio()` hook to pull live smart contract data
- [x] Display the user's health factor and `stCORE` collateral on the Dashboard

---

### 🔐 Phase 8: Wallet Transaction Signing

- [ ] Connect frontend `IntentInput` to backend endpoints like `POST /borrow-core` and `POST /repay-core`
- [ ] Integrate MetaMask/`wagmi` signing flow for transactions initiated from the frontend
- [ ] Implement a gas estimation and transaction feedback modal
- [ ] Ensure the backend can handle native `tCORE` (`msg.value`) for borrowing/repaying from the `LendingPool`

---

### 🧪 Phase 9: Testing & QA

- [ ] Write unit tests for `LendingPool.sol` (at least 5 critical test cases, e.g., borrow, repay, liquidate)
- [ ] Test the full user flow: stake → mint `stCORE` → borrow → repay → see dashboard update
- [ ] Test intent parsing for "Borrow 0.2 CORE" and "Repay CORE" flows
- [ ] Add robust error handling for failed or rejected transactions

---

### 🌐 Phase 10: Production Deployment (Final)

- [ ] Deploy contracts to the Core Mainnet after full testnet validation
- [ ] Move production configuration to `.env.production` files
- [ ] Verify contracts on a block explorer like CoreScan
- [ ] Host the frontend on a service like Vercel or Render

---

### 🔁 Ongoing Maintenance & Optimization

- [ ] Implement auto-refresh for dashboard metrics
- [ ] Optimize loading states across the application
- [ ] (Optional) Add full liquidation logic for when a user's health factor drops below a certain threshold (e.g., 1.25)
- [ ] Document the smart contract architecture for open-source contributors