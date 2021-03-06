// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/Context.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/security/Pausable.sol';

import './interface/ISCVNFT.sol';

/**
 * The contract mints a random SCV NFT.
 * Users need to pay with an ERC20 `token` with certain `amount`
 * Random number generated from block.timestamp will be used to
 * choose a NFT spec
 */
abstract contract Minter is Context, AccessControl, Pausable {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant PAUSER_ROLE = keccak256('PAUSER_ROLE');
    bytes32 public constant OPERATOR_ROLE = keccak256('OPERATOR_ROLE');

    uint256 public requiredTokenAmount;
    address public payBy;
    uint256 public price;
    address public nftToken;

    // for transferring the sales of NFTs
    address public scvReward;
    // how to split, base = 10
    uint32 public cpShare;
    address public cpReward;
    uint256 public baseSpecId;

    uint256 public mintedAmount;
    uint256 public maxAmount;

    constructor(uint256 requiredTokenAmount_, address cpReward_) {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(OPERATOR_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());

        requiredTokenAmount = requiredTokenAmount_;

        // buy with token, default = BUSD
        payBy = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56;
        // 10 BUSD = 10 * 1e18
        price = 10 * 1e18;
        // the NFT to be minted
        nftToken = 0xFe3EeA9f826E56cA5702aaD50659D801E4Ea9320;
        // spec ID to start with
        baseSpecId = 14;
        // no limit
        maxAmount = type(uint256).max;
        mintedAmount = 0;

        cpShare = 3;
        cpReward = cpReward_;
        scvReward = 0x079a889eB69013d451EcF45377258948116e2b3e;
    }

    /**
     * @dev Return the amount of ACS which sender holds in the vault
     */
    function amountInVault(address addr) public view virtual returns (uint256);

    /**
     * @dev A very loose randomness for just bringing the users some
     * unbalanced supply of different types
     */
    function getRandomSpecId() private view returns (uint256) {
        bytes memory b = abi.encodePacked(block.timestamp, block.difficulty);
        uint256 seed = uint256(keccak256(b)) % 100;
        if (seed >= 95) {
            // 5%
            return 0;
        } else if (seed >= 80) {
            // 15%
            return 1;
        } else if (seed >= 50) {
            // 30%
            return 2;
        } else {
            // 50%
            return 3;
        }
    }

    /**
     * @dev Creates a new token for `msg.sender`. Its token ID will be automatically
     * assigned (and available on the emitted {IERC721-Transfer} event), and the token
     * URI autogenerated based on the base URI passed at construction.
     */
    function mint() public virtual whenNotPaused {
        if (requiredTokenAmount > 0) {
            require(
                amountInVault(_msgSender()) >= requiredTokenAmount,
                'not enough tokens'
            );
        }
        require( maxAmount > mintedAmount, 'not enough nfts' );

        IERC20 erc20 = IERC20(payBy);
        // transfer to counterparty
        uint256 amount0 = (price * cpShare) / 10;
        if (amount0 > 0 && cpReward != address(0)) {
            erc20.safeTransferFrom(_msgSender(), cpReward, amount0);
        }
        // transfer the rest to SCV
        uint256 amount1 = price - amount0;
        if (amount1 > 0) {
            erc20.safeTransferFrom(_msgSender(), scvReward, amount1);
        }
        // calc the specId from 0~3 and add to baseSpecId
        uint256 specId = baseSpecId + getRandomSpecId();
        ISCVNFT(nftToken).mint(_msgSender(), specId);
        mintedAmount = mintedAmount + 1;
    }

    /**
     * @dev Set a new required `amount` to accquire the NFT
     */
    function setRequiredTokenAmount(uint256 amount) public virtual {
        require(
            hasRole(OPERATOR_ROLE, _msgSender()),
            'must have operator role to change required amount'
        );
        requiredTokenAmount = amount;
    }

    /**
     * @dev Set a new required `amount` to accquire the NFT
     */
    function setBaseSpecId(uint256 baseSpecId_) public virtual {
        require(
            hasRole(OPERATOR_ROLE, _msgSender()),
            'must have operator role to change base spec Id'
        );
        baseSpecId = baseSpecId_;
    }

    /**
     * @dev Set a new required `amount` to accquire the NFT
     */
    function setPayByToken(address token) public virtual {
        require(
            hasRole(OPERATOR_ROLE, _msgSender()),
            'must have operator role to change amount'
        );
        payBy = token;
    }

    /**
     * @dev Set a new required `amount` to accquire the NFT
     */
    function setPrice(uint256 price_) public virtual {
        require(
            hasRole(OPERATOR_ROLE, _msgSender()),
            'must have operator role to change amount'
        );
        price = price_;
    }

    /**
     * @dev Set a new share for counterparty
     */
    function setCPShare(uint32 cpShare_) public virtual {
        require(
            hasRole(OPERATOR_ROLE, _msgSender()),
            'must have operator role to change cp share'
        );
        require(cpShare_ < 10, 'the number is 10 based');
        cpShare = cpShare_;
    }

    /**
     * @dev Set a new address for sharing with CP
     */
    function setCPReward(address cpReward_) public virtual {
        require(
            hasRole(OPERATOR_ROLE, _msgSender()),
            'must have operator role to change cp reward address'
        );
        cpReward = cpReward_;
    }

    /**
     * @dev Set a new address for SCV's share
     */
    function setSCVReward(address scvReward_) public virtual {
        require(
            hasRole(OPERATOR_ROLE, _msgSender()),
            'must have operator role to change cp reward address'
        );
        scvReward = scvReward_;
    }

    /**
     * @dev Set a new `nft` token address to mint the NFT
     */
    function setNFTToken(address nft) public virtual {
        require(
            hasRole(OPERATOR_ROLE, _msgSender()),
            'must have operator role to change nft token'
        );
        nftToken = nft;
    }

    function pause() public virtual {
        require(
            hasRole(PAUSER_ROLE, _msgSender()),
            'must have pauser role to pause'
        );
        _pause();
    }

    function unpause() public virtual {
        require(
            hasRole(PAUSER_ROLE, _msgSender()),
            'must have pauser role to unpause'
        );
        _unpause();
    }
}
