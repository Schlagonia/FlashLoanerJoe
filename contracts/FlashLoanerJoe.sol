//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import './UniswapV2Library.sol';
import './interfaces/IUniswapV2Router02.sol';
import './interfaces/IUniswapV2Pair.sol';
import './interfaces/IERC20.sol';

import '@openzeppelin/contracts/utils/math/SafeMath.sol';

import 'hardhat/console.sol';

contract FlashLoanerJoe {

  using SafeMath for uint;
  address immutable factory;
  IUniswapV2Router02 immutable pangolinRouter;
  address immutable routerAddress;
  address owner;

  constructor(address _factory, address _pangolinRouter) {
    factory = _factory;  
    pangolinRouter = IUniswapV2Router02(_pangolinRouter);
    routerAddress = _pangolinRouter;
    owner = msg.sender;
  }

  function joeCall(address _sender, uint _amount0, uint _amount1, bytes calldata _data) external {
      address[] memory path = new address[](2);
      uint amountToken = _amount0 == 0 ? _amount1 : _amount0;
 
      address token0 = IUniswapV2Pair(msg.sender).token0();
      address token1 = IUniswapV2Pair(msg.sender).token1();
  
      require(msg.sender == UniswapV2Library.pairFor(factory, token0, token1), "Unauthorized"); 

      path[0] = _amount0 == 0 ? token1 : token0;
      path[1] = _amount0 == 0 ? token0 : token1;

      IERC20 token = IERC20(_amount0 == 0 ? token1 : token0);
  
      (uint reserveIn, uint reserveOut) = UniswapV2Library.getReserves(factory, (_amount0 == 0 ? token0 : token1), (_amount0 == 0 ? token1 : token0));
      
      token.approve(routerAddress, amountToken);
      
      uint amountRequired = UniswapV2Library.getAmountIn(amountToken, reserveIn, reserveOut);
      
      pangolinRouter.swapTokensForExactTokens(amountRequired, amountToken, path, msg.sender, block.timestamp);

      token.transfer(_sender, token.balanceOf(address(this)));
      
  }


}