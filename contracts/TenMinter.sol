// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import '@openzeppelin/contracts/utils/math/Math.sol';
import './interface/ISCVNFT.sol';
import './interface/IWithBalanceOf.sol';
import './Minter.sol';

/**
 * The contract mints a random SCV NFT.
 * Users need to pay with an ERC20 `token` with certain `amount`
 * Random number generated from block.timestamp will be used to
 * choose a NFT spec
 */
contract TenMinter is Minter {
  IWithBalanceOf public farm =
    IWithBalanceOf(0xd15C444F1199Ae72795eba15E8C1db44E47abF62);

  constructor() Minter(2500e18, 0x5ed6B80F0e8b1c7fdB783202d4a926BbED2d49ee) {
    baseSpecId = 41;
    cpShare = 5;
  }

  /**
   * @dev Return the amount of TENFI holds by the address
   */
  function amountInVault(address addr) public view override returns (uint256) {
    return farm.balanceOf(addr);
  }
}
