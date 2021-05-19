// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '../interface/ISwampFarm.sol';

contract MockSwampFarm is ISwampFarm {
    function stakedWantTokens(uint256 _pid, address _user)
        external
        pure
        override
        returns (uint256)
    {
        return 2e18;
    }
}
