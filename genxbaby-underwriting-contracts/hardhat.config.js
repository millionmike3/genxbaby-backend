import dotenv from "dotenv";
dotenv.config();

import "@nomicfoundation/hardhat-verify";

export default {
  solidity: "0.8.20",
  networks: {
    amoy: {
      type: "http",
      url: process.env.AMOY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY
    }
  },
  plugins: [
    { id: "@nomicfoundation/hardhat-verify" }
  ]
};
