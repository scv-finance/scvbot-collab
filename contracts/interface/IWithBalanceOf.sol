// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IWithBalanceOf {
  function balanceOf(address _user) external view returns (uint256);
}
