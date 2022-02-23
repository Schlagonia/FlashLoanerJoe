
const hre = require("hardhat");

async function main() {
 
  const joeFactory = '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10';
  const pangolinFactory = '0xefa94DE7a4656D787667C749f7E1223D71E9FD88';

  // We get the contract to deploy
  const FlashLoanerJoe = await ethers.getContractFactory("FlashLoanerJoe");
  const flashLoaner = await FlashLoanerJoe.deploy(joeFactory, pangolinFactory);
  await flashLoaner.deployed();

  console.log("Flash Loander deployed to:", flashLoaner.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
