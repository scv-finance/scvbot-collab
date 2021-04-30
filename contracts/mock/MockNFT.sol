// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

import '../interface/ISCVNFT.sol';

contract MockNFT is ERC721URIStorage, ISCVNFT {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdTracker;

    constructor() ERC721('Mock', 'Mock') {}

    function _baseURI() internal view virtual override returns (string memory) {
        return 'ipfs://mock/';
    }

    function mint(address to, uint256 specId) public virtual override {
        uint256 tokenId = _tokenIdTracker.current();
        _safeMint(to, tokenId);
        _tokenIdTracker.increment();
        string memory uri =
            string(abi.encodePacked(specId.toString(), '.json'));
        _setTokenURI(tokenId, uri);
    }
}
