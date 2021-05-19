// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ISwampFarm {
    function stakedWantTokens(uint256 _pid, address _user)
        external
        view
        returns (uint256);
}
