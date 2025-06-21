import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const TCORE2_RPC_URL = process.env.TESTNET_RPC_URL || "https://rpc.test2.btcs.network";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    core_testnet: {
      url: TCORE2_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 1114,
    },
  },
  etherscan: {
    apiKey: {
      core_testnet: "your_dummy_api_key" // Replace with a real key if needed for verification
    },
    customChains: [
      {
        network: "core_testnet",
        chainId: 1114,
        urls: {
          apiURL: "https://scan.test2.btcs.network/api",
          browserURL: "https://scan.test2.btcs.network"
        }
      }
    ]
  }
};

export default config;
