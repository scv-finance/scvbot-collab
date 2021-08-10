// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import './interface/ISCVNFT.sol';
import './Minter.sol';

/**
* The contract mints a random SCV NFT.
* Users need to pay with an ERC20 `token` with certain `amount`
* Random number generated from block.timestamp will be used to
* choose a NFT spec
*/
contract BSCNewsMinter is Minter {

  constructor() Minter(0, address(0)) {
    baseSpecId = 45;
    cpShare = 0;
    maxAmount = 500;
  }

  /**
  * @dev Return 0
  */
  function amountInVault(address addr) public view override returns (uint256) {
    return 0;
  }

  /**
  * @dev Set max amount
  */
  function setMaxAmount(uint256 amount) public virtual {
    require(
      hasRole(OPERATOR_ROLE, _msgSender()),
      'must have operator role to set max amount'
    );
    maxAmount = amount;
  }
}
