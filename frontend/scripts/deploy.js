const hre = require("hardhat");
const fs = require('fs');

require('dotenv').config();

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  // 3 parameters being accepted here
  // 1st - _mintingStartTime
  // 2nd - _mintingEndTime
  // for 1st and 2nd parameters please use date & time to unix timestamp in seconds to get
  // a value. i.e. https://www.unixtimestamp.com/index.php
  // 3rd - _maxMintLimit
  const nftMarketplace = await NFTMarketplace.deploy(process.env.MINTING_START_TIME, process.env.MINTING_END_TIME, process.env.MAX_MINT_LIMIT);
  await nftMarketplace.deployed();
  console.log("nftMarketplace deployed to:", nftMarketplace.address);

  fs.writeFileSync('./config.js', `
  export const marketplaceAddress = "${nftMarketplace.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
