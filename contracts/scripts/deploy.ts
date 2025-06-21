import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // --- Deployment Configuration ---
  // These addresses are for the Core Blockchain Testnet
  const coreTokenAddress = "0x40375C42624790b82c41446193DE212b7D201213"; // Mock tCORE for testing
  const chainlinkPriceFeedAddress = "0x2514895c72f50D8bd8B459FF524e150543abA3cf"; // BTC/USD on Core Testnet
  const civicVerifierAddress = "0x16A242524A723Ab2b5a26e855A5144b598a444d3"; // Example, replace with actual
  const civicGatekeeperNetwork = ethers.encodeBytes32String("uniq-testnet-T1"); // Example network

  // 1. Deploy StakedCore (stCORE)
  const StakedCore = await ethers.getContractFactory("StakedCore");
  const stCore = await StakedCore.deploy();
  await stCore.waitForDeployment();
  console.log("StakedCore (stCORE) deployed to:", await stCore.getAddress());

  // 2. Deploy SatsfiUSD (SUSD)
  const SatsfiUSD = await ethers.getContractFactory("SatsfiUSD");
  const susd = await SatsfiUSD.deploy();
  await susd.waitForDeployment();
  console.log("SatsfiUSD (SUSD) deployed to:", await susd.getAddress());

  // 3. Deploy StakingVault
  const StakingVault = await ethers.getContractFactory("StakingVault");
  const stakingVault = await StakingVault.deploy(coreTokenAddress, await stCore.getAddress());
  await stakingVault.waitForDeployment();
  console.log("StakingVault deployed to:", await stakingVault.getAddress());

  // 4. Deploy LendingPool
  const LendingPool = await ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy(
    await susd.getAddress(),
    await stCore.getAddress(),
    chainlinkPriceFeedAddress,
    civicVerifierAddress,
    civicGatekeeperNetwork
  );
  await lendingPool.waitForDeployment();
  console.log("LendingPool deployed to:", await lendingPool.getAddress());

  // --- Post-Deployment Configuration ---
  console.log("\nTransferring ownership...");

  // 5. Transfer ownership of stCORE to StakingVault
  await stCore.transferOwnership(await stakingVault.getAddress());
  console.log("Transferred StakedCore ownership to StakingVault");

  // 6. Transfer ownership of SUSD to LendingPool
  await susd.transferOwnership(await lendingPool.getAddress());
  console.log("Transferred SatsfiUSD ownership to LendingPool");

  console.log("\nDeployment and configuration complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 