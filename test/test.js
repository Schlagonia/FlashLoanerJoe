const { expect } = require("chai");
const { ethers } = require("hardhat");

const joeFactory = '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa100';
const pangolinRouter = '0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106';


describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const FlashLoanerJoe = await ethers.getContractFactory("FlashLoanderJoe");
    const flashLoaner = await FlashLoanerJoe.deploy(joeFactory, pangolinRouter);
    await flashLoaner.deployed();

    expect(await flash.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
