require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
// const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

module.exports = {
  defaultNetwork: "local",
  networks: {
    hardhat: {
      chainId: 1337
    },
    local: {
      chainId: 1337,
      url: "http://localhost:8545",
      accounts: ["0x36ec68020875d606d903a7211612a6c640c895f29453875706d302b85c8e9312"] // add the account that will deploy the contract (private key)
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/396a2718cde6493d8464c563a8683d39", //Infura url with projectId
      accounts: ["0x36ec68020875d606d903a7211612a6c640c895f29453875706d302b85c8e9312"] // add the account that will deploy the contract (private key)
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

