//SPDX-License-Identifier: Unlicense
pragma solidity >=0.5.0;

interface IPangolinFactory {
    
    function getPair(address tokenA, address tokenB) external view returns (address pair);


}