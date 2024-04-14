require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "arb",
  networks:{
    arb:{
      url:process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
     gnc:{
      url: "http://127.0.0.1:7545",
      accounts: ["0x2b163b63af537cce7ad1cc6477cf1f8924569b2162e220e5ebc1f8eef4e98089"],
    },
  },

  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};
