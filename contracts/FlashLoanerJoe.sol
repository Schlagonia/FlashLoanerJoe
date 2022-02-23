//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import './UniswapV2Library.sol';
import './interfaces/IUniswapV2Pair.sol';
import './interfaces/IERC20.sol';
import './interfaces/IPangolinFactory.sol';

import '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract FlashLoanerJoe {

  using SafeMath for uint;
  address immutable factory;
  IPangolinFactory immutable pangolinFactory;
 
  constructor(address _factory, address _pangolinFactory) {
    factory = _factory;  
    pangolinFactory = IPangolinFactory(_pangolinFactory);
  }

  function joeCall(address _sender, uint _amount0, uint _amount1, bytes calldata _data) external {
      bool zero = _amount0 == 0 ? true : false;
      
      address tokenIn = zero ? IUniswapV2Pair(msg.sender).token1() : IUniswapV2Pair(msg.sender).token0();

      address tokenOut =zero ? IUniswapV2Pair(msg.sender).token0() : IUniswapV2Pair(msg.sender).token1();

      (uint reserveIn, uint reserveOut) = UniswapV2Library.getReserves(factory, tokenOut, tokenIn);

      uint joeAmountRequired = UniswapV2Library.getAmountIn((zero ? _amount1 : _amount0), reserveIn, reserveOut);
      
      IUniswapV2Pair pool = IUniswapV2Pair(pangolinFactory.getPair(tokenIn, tokenOut));
      (reserveIn, reserveOut,) = pool.getReserves();

      uint panIn = UniswapV2Library.getAmountIn(joeAmountRequired, (zero ? reserveOut : reserveIn), (zero ? reserveIn : reserveOut));
      
      IERC20(tokenIn).transfer(address(pool), panIn);

      pool.swap((zero ? joeAmountRequired : 0), (zero ? 0 : joeAmountRequired), msg.sender, new bytes(0));
      IERC20(tokenIn).transfer(_sender, IERC20(tokenIn).balanceOf(address(this)));
  }
 


}