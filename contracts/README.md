# Satsfi Smart Contracts

This directory contains the Solidity smart contracts for the Satsfi protocol, built with the Hardhat development environment.

## Overview

The core of the protocol consists of four main contracts:

*   **`StakingVault.sol`**: Manages the depositing and withdrawing of the base asset (e.g., `tCORE`).
*   **`stCORE.sol`**: An ERC20 token representing a user's share in the staking vault.
*   **`LendingPool.sol`**: Allows users to lock `stCORE` as collateral to borrow `SUSD`. It integrates with Chainlink for price feeds and Civic for identity verification.
*   **`SUSD.sol`**: An ERC20 stablecoin that can only be minted by the `LendingPool`.

## Development

This project uses Hardhat. Make sure you have Node.js and npm/yarn installed.

### 1. Install Dependencies

Navigate to the `contracts` directory and install the required packages.

```shell
cd contracts
npm install
```

### 2. Compile Contracts

To compile the smart contracts and generate the ABI files, run:

```shell
npx hardhat compile
```

This will create an `artifacts` directory containing the compiled bytecode and ABI for each contract.

### 3. Run Tests

To execute the test suite (currently limited due to the focus on integration), run:

```shell
npx hardhat test
```
The tests use mock contracts (`MockV3Aggregator` for Chainlink and `MockCivicVerifier` for Civic) to simulate external dependencies.

### 4. Deployment

The project includes a basic deployment script in `scripts/deploy.ts`. To use it, you must first configure your network in `hardhat.config.ts` and set the required environment variables (e.g., `PRIVATE_KEY`, `RPC_URL`).

```shell
# Example command (after configuration)
npx hardhat run scripts/deploy.ts --network your_network_name
```
