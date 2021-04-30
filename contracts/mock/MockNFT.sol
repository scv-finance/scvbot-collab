// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721Pausable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

import '../interface/ISCVNFT.sol';

contract MockNFT is ERC721, ERC721Pausable, ISCVNFT {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdTracker;

    constructor() ERC721('Mock', 'Mock') {
        _setBaseURI('ipfs://mock/');
    }

    function mint(address to, uint256 specId)
        public
        virtual
        override
        whenNotPaused
    {
        uint256 tokenId = _tokenIdTracker.current();
        _safeMint(to, tokenId);
        _tokenIdTracker.increment();
        string memory uri =
            string(abi.encodePacked(specId.toString(), '.json'));
        _setTokenURI(tokenId, uri);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Pausable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
