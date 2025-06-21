import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const CORE_RPC_URL = "https://rpc.test.btcs.network";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    core_testnet: {
      url: CORE_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 1115,
    },
  },
};

export default config;
