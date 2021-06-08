// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IMerlinFarm {
    function balanceOf(address _user)
        external
        view
        returns (uint256);
}
