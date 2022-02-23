
const hre = require("hardhat");

async function main() {
 
  const joeFactory = '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10';
  const pangolinRouter = '0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106';
  const pangolinFactory = '0xefa94DE7a4656D787667C749f7E1223D71E9FD88';

  // We get the contract to deploy
  const FlashLoanerJoe = await ethers.getContractFactory("FlashLoanerJoe2");
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
