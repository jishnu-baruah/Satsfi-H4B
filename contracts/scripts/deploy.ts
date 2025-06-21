import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // --- Deployment Configuration ---
  const chainlinkPriceFeedAddress = "0x2514895c72f50d8bd8b459ff524e150543aba3cf"; // BTC/USD on Core Testnet

  // 1. Deploy stCORE
  const StakedCore = await ethers.getContractFactory("StakedCore");
  const stCore = await StakedCore.deploy();
  await stCore.waitForDeployment();
  console.log("stCORE deployed to:", await stCore.getAddress());

  // 2. Deploy StakingVault
  const StakingVault = await ethers.getContractFactory("StakingVault");
  const stakingVault = await StakingVault.deploy(await stCore.getAddress());
  await stakingVault.waitForDeployment();
  console.log("StakingVault deployed to:", await stakingVault.getAddress());

  // 3. Deploy LendingPool
  const LendingPool = await ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy(
    await stCore.getAddress(),
    chainlinkPriceFeedAddress
  );
  await lendingPool.waitForDeployment();
  console.log("LendingPool deployed to:", await lendingPool.getAddress());

  // --- Post-Deployment Configuration ---
  console.log("\nTransferring ownership of stCORE to StakingVault...");
  const tx = await stCore.transferOwnership(await stakingVault.getAddress());
  console.log(`Ownership transfer transaction sent. Waiting for confirmation... (Tx hash: ${tx.hash})`);
  await tx.wait(1); // Wait for 1 confirmation
  console.log("Ownership transfer transaction confirmed.");
  
  console.log("\nVerifying new owner...");
  const newOwner = await stCore.owner();
  const vaultAddress = await stakingVault.getAddress();
  console.log(`On-chain owner of stCORE is now: ${newOwner}`);
  console.log(`StakingVault address is:         ${vaultAddress}`);

  if (newOwner.toLowerCase() !== vaultAddress.toLowerCase()) {
    throw new Error("Ownership transfer failed! The owner was not set correctly.");
  }
  console.log("✅ SUCCESS: StakingVault is confirmed as the new owner of stCORE.");

  console.log("\nDeployment and configuration complete!");
  console.log({
    stCore: await stCore.getAddress(),
    stakingVault: await stakingVault.getAddress(),
    lendingPool: await lendingPool.getAddress(),
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 