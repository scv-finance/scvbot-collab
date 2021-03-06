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
contract ERC20Minter is Minter {
    using SafeERC20 for IERC20;

    address public requiredToken;

    constructor(
        address requiredToken_,
        uint256 requiredTokenAmount_,
        address cpReward_
    ) Minter(requiredTokenAmount_, cpReward_) {
        requiredToken = requiredToken_;
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
        IERC20 token = IERC20(requiredToken);
        return token.balanceOf(addr);
    }

    /**
     * @dev Set a new token to check balance
     */
    function setRequiredToken(address token) public virtual {
        require(
            hasRole(OPERATOR_ROLE, _msgSender()),
            'must have operator role to change required token'
        );
        requiredToken = token;
    }
}
