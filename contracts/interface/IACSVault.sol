// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IACSVault {
    function balanceOf(address account) external view returns (uint256);

    function getPricePerFullShare() external view returns (uint256);

    function decimals() external pure returns (uint8);
}
