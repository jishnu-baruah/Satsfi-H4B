# Smart Contract Requirements for Satsfi

## 1. Introduction

This document outlines the functional and technical requirements for the Satsfi smart contract suite. The contracts will be designed to power the platform's core DeFi functionalities: staking, yield optimization, and collateralized borrowing.

**Target Network:** Core Blockchain TestNet

## 2. Core Principles

*   **Security:** Adherence to security best practices (e.g., Checks-Effects-Interactions pattern, Reentrancy Guards, proper access control) is the highest priority.
*   **Modularity:** Contracts will be designed in a modular way to allow for straightforward upgrades, maintenance, and future expansion.
*   **Gas Efficiency:** Code will be optimized for gas efficiency to ensure low transaction costs for users on the Core network.
*   **Clarity:** The codebase must be well-documented and clearly written to facilitate audits and community contributions.

---

## 3. Required Features (Must-Haves for MVP)

These features are essential for the initial launch and core functionality of the Satsfi platform.

### 3.1. Tokenization

*   **stCORE Token:**
    *   **Requirement:** An ERC20-compliant token representing a user's staked `tCORE`.
    *   **Functionality:** It must be minted 1:1 by the Staking Contract when a user deposits `tCORE` and burned when they withdraw. This token represents their share of the staking pool.
*   **SUSD Stablecoin:**
    *   **Requirement:** An ERC20-compliant stablecoin, pegged to the US Dollar.
    *   **Functionality:** The Lending Contract will have the exclusive authority to mint `SUSD` when a user borrows against their collateral and burn `SUSD` when a user repays their loan.

### 3.2. Staking & Yield Vault

*   **Staking (`tCORE` Deposit):**
    *   **Requirement:** Users must be able to deposit `tCORE` into a central staking contract.
    *   **Functionality:** The contract will lock the `tCORE` and mint an equivalent amount of `stCORE` to the user's wallet.
*   **Unstaking (`tCORE` Withdrawal):**
    *   **Requirement:** Users must be able to withdraw their `tCORE` at any time, provided it is not locked as collateral.
    *   **Functionality:** The user burns their `stCORE`, and the contract transfers the corresponding amount of `tCORE` back to them.
*   **Yield Distribution:**
    *   **Requirement:** The contract must be ableto accrue yield generated from underlying strategies.
    *   **Functionality:** A simple, admin-callable `distributeYield()` function that allocates accrued rewards to `stCORE` holders.

### 3.3. Collateralized Lending & Borrowing

*   **Collateral Management:**
    *   **Requirement:** Users must be able to lock their `stCORE` tokens as collateral in the Lending Contract.
*   **Price Oracle Integration (Chainlink):**
    *   **Requirement:** The contract must integrate with Chainlink Price Feeds to get a reliable, real-time price for `tCORE` in USD.
    *   **Functionality:** This price feed is critical for calculating the value of a user's collateral and determining their borrowing capacity and loan health.
*   **Borrowing `SUSD`:**
    *   **Requirement:** Users must be able to borrow `SUSD` against their locked collateral.
    *   **Functionality:** The amount of `SUSD` a user can borrow is determined by their collateral's value and the system's Collateralization Ratio.
*   **Collateralization Ratio (CR):**
    *   **Requirement:** The contract must enforce a minimum CR (e.g., 150%) to ensure all loans are over-collateralized.
    *   **Functionality:** A user cannot perform any action (e.g., borrow more, withdraw collateral) that would cause their CR to drop below the minimum threshold.
*   **Loan Repayment:**
    *   **Requirement:** Users must be able to repay their `SUSD` debt, plus any accrued interest.
*   **Liquidation Mechanism:**
    *   **Requirement:** The contract must include a public function to liquidate under-collateralized loans.
    *   **Functionality:** When a user's CR falls below a specified liquidation threshold (e.g., 125%), third-party liquidators can repay a portion of the user's `SUSD` debt in exchange for an equivalent amount of their `stCORE` collateral at a discount.

### 3.4. Identity Verification (Civic Integration)

*   **On-Chain Pass Verification:**
    *   **Requirement:** The borrowing functionality must be protected by Civic Pass.
    *   **Functionality:** Before executing a borrow request, the Lending Contract **must** invoke the `IGatewayTokenVerifier` contract to validate that the user's address holds an active Civic Pass for the designated Gatekeeper Network. The transaction must revert if the verification fails.

### 3.5. Administrative Controls

*   **Access Control:** All contracts must implement robust access control (e.g., `Ownable`) for sensitive functions.
*   **System Parameters:** The contract owner must have the ability to manage and update critical system parameters, including:
    *   Minimum Collateralization Ratio
    *   Liquidation Threshold and Discount
    *   Borrowing Interest Rate
    *   Addresses for the Chainlink Price Feed and Civic Verifier contract
    *   The Civic Gatekeeper Network ID

---

## 4. Optional Features (Future Enhancements)

These features are not required for the initial launch but can be implemented in future versions to improve the platform.

*   **Automated Yield Strategies:**
    *   **Concept:** Implement a Vault architecture where the staked `tCORE` can be automatically deployed to external, audited DeFi protocols to generate yield, instead of relying on manual distribution.
*   **Decentralized Governance:**
    *   **Concept:** Introduce a `SATSFI` governance token that allows token holders to vote on protocol upgrades and parameter changes, reducing reliance on a single admin.
*   **Dynamic Interest Rates:**
    *   **Concept:** Implement a dynamic interest rate model for borrowing that adjusts automatically based on the utilization of the `SUSD` liquidity pool.
*   **Multi-Collateral Support:**
    *   **Concept:** Allow users to borrow `SUSD` against other assets in addition to `stCORE`, such as `wBTC` or `ETH`. 