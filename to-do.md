# ✅ SatsFi MVP To-Do Plan

> This to-do list tracks the remaining integration and deployment work for the SatsFi MVP.

---

### 🚀 Phase 6: Final Deployment & Live Data

- [x] Write & verify robust smart contract deployment script (`deploy.ts`).
- [x] Deploy `LendingPool`, `StakingVault`, and `stCORE` to Core Testnet.
- [x] Verify `StakingVault` as owner of `stCORE` contract on-chain.
- [x] Update frontend and backend with final, verified contract addresses.
- [x] Connect backend services to deployed contract addresses via `ethers.js`.
- [x] Replace mock portfolio metrics with real, live data from smart contracts.
- [x] Implement wallet transaction signing (`wagmi`) on the frontend for all intents.
- [x] Implement a refresh mechanism for the dashboard to handle RPC lag.

### 🧠 Phase 7: AI Chatbot Integration

- [x] Add `GeminiChatbot` component to the dashboard.
- [x] Create a new backend endpoint (`/api/chatbot/query`) to handle chat messages.
- [x] Provide the AI with user-specific context (portfolio balances, health factor).
- [x] Provide the AI with real-time market data (prices via `priceCacheService`).
- [x] Craft a detailed system prompt to give the AI its persona and instructions.
- [x] Connect the frontend `GeminiChatbot` component to the new backend endpoint.
- [x] Implement conversation history for context preservation.
- [x] Implement a dynamic, database-driven knowledge base for the AI.
- [x] Add a "Clear Chat" button and corresponding backend logic.
- [ ] Remove mock responses and implement live, streaming AI responses.

### 🧪 Phase 8: Testing & QA

- [ ] Test the full user flow: stake → mint `stCORE` → see dashboard update.
- [ ] Test intent parsing for "Borrow 0.2 CORE" and "Repay CORE" flows.
- [ ] Add robust error handling for failed or rejected transactions.

### 🌐 Phase 9: Production Deployment (Final)

- [ ] Prepare production environment variables (e.g., for Render).
- [ ] Deploy contracts to the Core Mainnet after full testnet validation.
- [ ] Verify contracts on a block explorer like CoreScan.
- [ ] Host the frontend on a service like Vercel or Render.

---

### 🔁 Ongoing Maintenance & Optimization

- [ ] (Optional) Add full liquidation logic for when a user's health factor drops below a certain threshold.
- [ ] Document the smart contract architecture for open-source contributors.
- [ ] Enhance UI/UX based on final testing.