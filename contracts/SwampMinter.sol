// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import './interface/ISCVNFT.sol';
import './interface/ISwampFarm.sol';
import './Minter.sol';

/**
 * The contract mints a random SCV NFT.
 * Users need to pay with an ERC20 `token` with certain `amount`
 * Random number generated from block.timestamp will be used to
 * choose a NFT spec
 */
contract SwampMinter is Minter {
    ISwampFarm public swampFarm;

    constructor(
        address swampFarm_,
        uint256 requiredTokenAmount_,
        address cpReward_
    ) Minter(requiredTokenAmount_, cpReward_) {
        swampFarm = ISwampFarm(swampFarm_);
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
        return swampFarm.stakedWantTokens(2, addr);
    }

    /**
     * @dev Set a new token to check balance
     */
    function setSwampFarm(address addr) public virtual {
        require(
            hasRole(OPERATOR_ROLE, _msgSender()),
            'must have operator role to change swapm farm address'
        );
        swampFarm = ISwampFarm(addr);
    }
}
