// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

interface ISCVNFT is IERC721, IAccessControl {
  function mint(address to, uint256 specId) external;

  function MINT_ROLE() external view returns (bytes32);
}
