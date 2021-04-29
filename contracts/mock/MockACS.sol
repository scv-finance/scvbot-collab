// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

import '@openzeppelin/contracts/math/SafeMath.sol';

import '../interface/IACSController.sol';
import '../interface/IACSVault.sol';

contract MockACS is IACSController, IACSVault {
    using SafeMath for uint256;

    function rewards() public pure override returns (address) {
        return 0x8650ab7e2C53E705d484c3b98bE14C1Ba1e8D690;
    }

    function balanceOf(address account) public pure override returns (uint256) {
        return 1e19;
    }

    function getPricePerFullShare() public pure override returns (uint256) {
        return 1e18;
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
