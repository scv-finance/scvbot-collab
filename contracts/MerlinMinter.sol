// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import '@openzeppelin/contracts/utils/math/Math.sol';
import './interface/ISCVNFT.sol';
import './interface/IMerlinFarm.sol';
import './Minter.sol';

/**
 * The contract mints a random SCV NFT.
 * Users need to pay with an ERC20 `token` with certain `amount`
 * Random number generated from block.timestamp will be used to
 * choose a NFT spec
 */
contract MerlinMinter is Minter {
    IMerlinFarm public farm0 = IMerlinFarm(0xfF1Da0430C3C4afd6005c511cd5E271BE04f4738);
    IMerlinFarm public farm1 = IMerlinFarm(0x3b87475ac293eeed0e8bC25713Eb8242A9497C3F);

    constructor() Minter(8e18, 0x4B2EC7CECC80a9a7CFd537aa84F66c7DB50ABfde) {
      baseSpecId = 32;
      cpShare = 3;
    }

    /**
     * @dev Return the amount of ACS which sender holds in the vault
     */
    function amountInVault(address addr)
        public
        view
        override
        returns (uint256)
    {
        return Math.max(farm0.balanceOf(addr), farm1.balanceOf(addr));
    }
}
