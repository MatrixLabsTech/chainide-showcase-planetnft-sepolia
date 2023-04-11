// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// @title Theirsverse NFT
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./libs/ERC721A.sol";
import "./interfaces/IPlanet.sol";

contract Planet is IPlanet, Ownable, ERC721A, AccessControl, ReentrancyGuard {
    uint256 public immutable maxSupply;
    uint256 public constant MAX_BATCH_SIZE = 5;

    address payable public payment;
    uint256 public saleStartTime;
    uint256 public salePrice;
    string public baseURI;

    // 1000000000
    constructor(
        uint256 _salePrice,
        uint256 _maxSupply
    ) ERC721A("PLANETNFT", "PNFT") {
        salePrice = _salePrice;
        maxSupply = _maxSupply;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mint(uint256 _quantity) external payable nonReentrant {
        require(totalSupply() + _quantity <= maxSupply, "Max supply exceed");
        uint256 totalPrice = salePrice * _quantity;
        require(msg.value >= totalPrice, "Not enough funds");
        _batchMint(msg.sender, _quantity);
        refundIfOver(totalPrice);
    }

    function withdraw() external {
        uint256 amount = address(this).balance;
        if (amount > 0) {
            Address.sendValue(payable(owner()), amount);
        }
    }

    function withdraw(IERC20 token) external {
        uint256 amount = token.balanceOf(address(this));
        require(amount > 0, "No tokens to withdraw");
        SafeERC20.safeTransfer(token, payable(owner()), amount);
    }

    function setBaseURI(
        string calldata uri
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = uri;
    }

    function grantAdminRole(address account) external onlyOwner {
        _grantRole(DEFAULT_ADMIN_ROLE, account);
    }

    function revokeAdminRole(address account) external onlyOwner {
        _revokeRole(DEFAULT_ADMIN_ROLE, account);
    }

    function refundIfOver(uint256 price) private {
        if (msg.value > price) {
            Address.sendValue(payable(msg.sender), msg.value - price);
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function _batchMint(address _account, uint256 _quantity) internal {
        if (_quantity <= MAX_BATCH_SIZE) {
            _safeMint(_account, _quantity);
        } else {
            uint256 batchNumber = _quantity / MAX_BATCH_SIZE;
            uint256 remainder = _quantity % MAX_BATCH_SIZE;
            uint256 i = 0;
            while (i < batchNumber) {
                _safeMint(_account, MAX_BATCH_SIZE);
                i++;
            }
            if (remainder > 0) {
                _safeMint(_account, remainder);
            }
        }
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(AccessControl, ERC721A) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
