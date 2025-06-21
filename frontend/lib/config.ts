import StakingVault from "./abi/StakingVault.json";
import LendingPool from "./abi/LendingPool.json";

// To bypass persistent environment variable loading issues in the Next.js dev server,
// we are temporarily hardcoding the API URL. This ensures all components
// receive the exact same, correct value.
export const API_URL = "https://satfi-h4b.onrender.com/api";

export const STAKING_VAULT_ADDRESS = "0xE3451D1081232BE36b257F712120B8d78f07e5F6";
export const LENDING_POOL_ADDRESS = "0xFcE44C16e18F98d58dDC85b8c803B9CaBFeBf542";
export const STCORE_ADDRESS = "0x5bDf8f6F713eb68E8740B6c764C389EE5a277990";

export const StakingVaultABI = StakingVault;
export const LendingPoolABI = LendingPool; 