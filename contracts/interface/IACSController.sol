// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP. Does not include
 * the optional functions; to access them see {ERC20Detailed}.
 */
interface IACSController {
    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function rewards() external view returns (address);
}
