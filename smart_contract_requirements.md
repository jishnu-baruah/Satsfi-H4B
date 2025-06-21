# Smart Contract Requirements for Satsfi (CORE-based Lending)

## 1. Introduction

This document outlines the requirements for a simplified Satsfi smart contract suite operating on the **Core Blockchain TestNet (TCORE2)**. The contracts will power a streamlined DeFi flow: staking native `CORE` to mint `stCORE`, and using `stCORE` as collateral to borrow native `CORE`.

**Target Network:** Core Blockchain TestNet (TCORE2)

## 2. Core Contracts

The system will consist of three primary contracts:
1.  **`stCORE.sol`**: An ERC20 token representing a user's staked `CORE`.
2.  **`StakingVault.sol`**: A contract that accepts native `CORE` deposits and mints `stCORE` in return.
3.  **`LendingPool.sol`**: A contract where users can deposit `stCORE` as collateral to borrow native `CORE`.

---

## 3. Required Features

### 3.1. Staking and Tokenization

*   **`stCORE` Token:**
    *   **Requirement:** An ERC20-compliant token representing a user's staked `CORE`.
    *   **Functionality:** It must be minted 1:1 by the `StakingVault` when a user deposits `CORE` and burned when they withdraw.
*   **`StakingVault` Contract:**
    *   **Requirement:** Users must be able to deposit native `CORE` into the vault.
    *   **Functionality:** The contract will lock the deposited `CORE` and mint an equivalent amount of `stCORE` to the user's wallet. It must also allow users to burn `stCORE` to withdraw their underlying `CORE`.

### 3.2. Collateralized Lending (stCORE → Native CORE)

The `LendingPool.sol` contract will manage all lending operations.

*   **Collateral Deposit:**
    *   **Requirement:** Users must be able to deposit their `stCORE` tokens as collateral.
    *   **Functionality:** Implement a `depositCollateral(uint256 amount)` function that transfers `stCORE` from the user to the `LendingPool`. A `stCORECollateral` mapping will track each user's balance.
*   **Price Oracle Integration (Chainlink):**
    *   **Requirement:** The contract must integrate with Chainlink Price Feeds to get a reliable, real-time price for `CORE` in USD.
    *   **Functionality:** This price feed is critical for calculating collateral value and loan health.
*   **Borrowing Native `CORE`:**
    *   **Requirement:** Users must be able to borrow native `CORE` against their locked `stCORE` collateral.
    *   **Functionality:** Implement a `borrowCORE(uint256 amount)` function that checks the user's health factor and, if safe, transfers the requested amount of native `CORE` from the contract to the user. A `borrowedCORE` mapping will track each user's debt.
*   **Loan Repayment:**
    *   **Requirement:** Users must be able to repay their `CORE` debt.
    *   **Functionality:** Implement a `payable repayCORE()` function. The user sends `CORE` along with the transaction (`msg.value`) to repay their outstanding debt.
*   **Health Factor:**
    *   **Requirement:** The contract must be able to calculate a user's loan health to prevent insolvency.
    *   **Functionality:** Implement a `getHealthFactor(address user) public view` function that returns the user's health factor based on their collateral value and borrowed amount. A health factor below a certain threshold (e.g., 1.0) would make a user eligible for liquidation.

### 3.3. Administrative Controls

*   **Access Control:** All sensitive functions must be protected (e.g., using `Ownable`).
*   **System Parameters:** The contract owner must have the ability to manage critical system parameters in the `LendingPool`, including:
    *   Minimum Collateralization Ratio / Health Factor Threshold
    *   Loan-to-Value (LTV) ratio
    *   Address for the Chainlink Price Feed

---

## 4. Optional Features (Future Enhancements)

*   **Liquidation Mechanism:** Implement a public function to allow third parties to liquidate under-collateralized loans, repaying `CORE` debt in exchange for `stCORE` collateral at a discount.
*   **Decentralized Governance:** Introduce a governance token to manage protocol parameters.
*   **Dynamic Interest Rates:** Implement an interest rate model for borrowing that adjusts based on protocol utilization. 