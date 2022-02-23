
require('dotenv').config();


const privateKey = process.env.PRIVATE_KEY;
// your contract address
const flashLoanerAddress = process.env.FLASH_LOANER1;

const { ethers } = require('ethers');

// uni/joeswap ABIs
const UniswapV2Pair = require('./ABIs/IUniswapV2Pair.json');
const UniswapV2Factory = require('./ABIs/IUniswapV2Factory.json');

const rpc = 'https://api.avax.network/ext/bc/C/rpc';

const provider = new ethers.providers.JsonRpcProvider(rpc)

let wallet = new ethers.Wallet(privateKey, provider);

const joeFactoryAddress = '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10'
const pangolinFactoryAddress = '0xefa94DE7a4656D787667C749f7E1223D71E9FD88'

//Token address to pass into pairAddress variable
const daiAddress = '0xd586e7f844cea2f87f50152665bcbc2c279d8d70'; //dai.e
const spellAddress = '0xce1bffbd5374dac86a2893119683f4911a2f7814';
const yakAddress = '0x59414b3089ce2AF0010e7523Dea7E2b35d776ec7;'
const clyAddress = '0xec3492a2508ddf4fdc0cd76f31f340b30d1793e6';
const pefiAddress = '0xe896cdeaac9615145c0ca09c8cd5c25bced6384c';
const iceAddress = '0xe0Ce60AF0850bF54072635e66E79Df17082A1109';
const aaveAddress = '0x63a72806098bd3d9520cc43356dd78afe5d386d9';
const pngAddress ='0x60781c2586d68229fde47564546784ab3faca982';

//Amounts that would be traded
const AVAX_TRADE = 1;
const AVAX_TRADE_FEE = AVAX_TRADE *.997
const PAIR_TRADE = 215;
const PAIR_TRADE_FEE = PAIR_TRADE * .997

const runBot = async () => {
  const JoeFactory = new ethers.Contract(
    joeFactoryAddress,
    UniswapV2Factory.abi, wallet,
  );
  const PangolinFactory = new ethers.Contract(
    pangolinFactoryAddress,
    UniswapV2Factory.abi, wallet,
  );
  
  const wavaxAddress = '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7'; 
  const pairAddress = pefiAddress

  let joePool;
  let pangolinPool;

  const loadPairs = async () => {
    joePool = new ethers.Contract(
      await JoeFactory.getPair(wavaxAddress, pairAddress),
      UniswapV2Pair.abi, wallet,
    );
    pangolinPool = new ethers.Contract(
      await PangolinFactory.getPair(wavaxAddress, pairAddress),
      UniswapV2Pair.abi, wallet,
    );
  };

  await loadPairs();

  provider.on('block', async (blockNumber) => {
    try {
      console.log(blockNumber);

      const joeReserves = await joePool.getReserves();  
      const pangolinReserves = await pangolinPool.getReserves();
    
      const reserve0joe = Number(ethers.utils.formatUnits(joeReserves[0], 18));
      const reserve1joe = Number(ethers.utils.formatUnits(joeReserves[1], 18));

      const reserve0Pan = Number(ethers.utils.formatUnits(pangolinReserves[0], 18));
      const reserve1Pan = Number(ethers.utils.formatUnits(pangolinReserves[1], 18));
      
      const pricePangolin = reserve1Pan / reserve0Pan;
      const priceJoe = reserve1joe / reserve0joe;
      
      const shouldStartAvax = pricePangolin > priceJoe;
      console.log("Start with AVAx? ", shouldStartAvax);
   
      //Takes what is needed to be put back in and determines how much would need to go into pangolin. 
      // If what comes out of JOe is >  than what needs to go in Pang then its profitable
      // AVAX is TOKEN0
      let needs = (shouldStartAvax ? 
        (reserve1joe * AVAX_TRADE ) / ((reserve0joe - AVAX_TRADE) *.997 ) :
        (reserve0joe * PAIR_TRADE ) / ((reserve1joe - PAIR_TRADE) * .997 )
      )
      console.log("Needs ", needs)
      
      let panNeeded = (shouldStartAvax ? 
        (reserve0Pan * needs ) / ((reserve1Pan - needs) * .997 ) :
        (reserve1Pan * needs ) / ((reserve0Pan - needs) *.997 ) 
      )
      console.log("PanNeeded ", panNeeded)

        profit = shouldStartAvax ? (AVAX_TRADE - panNeeded) : (PAIR_TRADE - panNeeded)
      //Trade is profitable if out is greater than needed
      const shouldTrade = profit > 0
      
      console.log("Profit ", profit);
      console.log(`Paangolin PRICE ${pricePangolin}`);
      console.log(`Joe PRICE ${priceJoe}`);
      console.log(`PROFITABLE? ${shouldTrade}`);
      console.log(`CURRENT SPREAD: ${(priceJoe / pricePangolin - 1) * 100}%`);

      if (!shouldTrade) return;
    
      //if avax has higher dollar value then avaxreserve/pair reserve == number > 1
      //If avax is the token0
      const gasLimit = await joePool.estimateGas.swap(
        shouldStartAvax ? String(AVAX_TRADE * 1e18) : 0,
        !shouldStartAvax ? String(PAIR_TRADE * 1e18) : 0,
        flashLoanerAddress,
        ethers.utils.toUtf8Bytes('1'),
      );

      let gasPrice = await provider.getGasPrice();
      
      const gasCost = Number(ethers.utils.formatEther(gasPrice.mul(gasLimit)));

      // need to compate gasCost in AVAx to whatever the profit is in
      const shouldSendTx = gasCost < (shouldStartAvax ?  profit : profit / priceJoe );

      // don't trade if gasCost is higher than the spread
      if (!shouldSendTx) return;

      const options = {
        gasPrice,
        gasLimit,
      };

      const tx = await joePool.connect(wallet).swap(
        shouldStartAvax ? String(AVAX_TRADE * 1e18) : 0,
        !shouldStartAvax ? String(PAIR_TRADE * 1e18) : 0,
        flashLoanerAddress,
        ethers.utils.toUtf8Bytes('1'), options,
      );

      console.log('ARBITRAGE EXECUTED! PENDING TX TO BE MINED');
      console.log(tx);

      await tx.wait();

      console.log('SUCCESS! TX MINED');
    } catch (err) {
      console.error(err);
    }
  });
};

console.log('Bot started!');

runBot();