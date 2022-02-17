// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");
const pairAbi = require('./pair.json')

// cly block 11000534
//pefi 11002626

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');
    const abi = [
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_from",
                    "type": "address"
                },
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "balance",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                },
                {
                    "name": "_spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "payable": true,
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        }
    ]
    const usdc = '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664';
    const joe = '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd';
    const wavax = '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7'
    const cly = '0xec3492a2508ddf4fdc0cd76f31f340b30d1793e6';
    const pefiAddress = '0xe896cdeaac9615145c0ca09c8cd5c25bced6384c';
    const one = '1000000000000000000';
    const two = '30000000000000000000'
    //const two = '10000000000000000000'

    const clyPair = '0x0B2777b0c55AEaAeb56E86B6eEFa6cC2Cfa00e07';
    const pefiPair = '0xb78c8238bD907c42BE45AeBdB4A8C8a5D7B49755';
    const ptpPair = '0xCDFD91eEa657cc2701117fe9711C9a4F61FEED23'
    // We get the contract to deploy
    const joeFactory = '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10';
    const pangolinFactory = '0xefa94DE7a4656D787667C749f7E1223D71E9FD88';
  const pangolinRouter = '0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106';

  // We get the contract to deploy
  const FlashLoanerJoe = await ethers.getContractFactory("FlashLoanerJoe2");
  const flashLoaner = await FlashLoanerJoe.deploy(joeFactory, pangolinFactory);
  await flashLoaner.deployed();

    console.log("Flash Loander deployed to:", flashLoaner.address);

    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: ["0xbACe4786dc66623bc7506FF85Dc0a5E6466EB74D"],
    });

    const signer = await ethers.provider.getSigner("0xbACe4786dc66623bc7506FF85Dc0a5E6466EB74D");

    const Wavax = new ethers.Contract(wavax, abi, signer);
    //const Usdc = new ethers.Contract(usdc, abi, signer);
    const Cly = new ethers.Contract(cly, abi, signer)
    const JoePair = new ethers.Contract(ptpPair, pairAbi, signer);
    console.log("initiated")

    const reserves = await JoePair.getReserves();
    const price = reserves[1] / reserves[0]
    console.log(price);

    console.log(await signer.getBalance())

    const gasLimit = await JoePair.estimateGas.swap(
        0,
        one,
        flashLoaner.address,
        ethers.utils.toUtf8Bytes('1'),
      );
      console.log("Gas Limit ", gasLimit)
    
    const gasPrice = await signer.getGasPrice();

      const options = {
        gasPrice,
        gasLimit
      };

    let tx = await JoePair.connect(signer).swap(
        0,
        one,
        flashLoaner.address,
        ethers.utils.toUtf8Bytes('1'), options
      );

    await tx.wait()
    console.log(tx);
    console.log(await signer.getBalance())
       
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
