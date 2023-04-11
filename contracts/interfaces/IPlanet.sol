// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPlanet {

    /* ================ ADMIN ACTIONS ================ */
    function setBaseURI(string memory newBaseURI) external;


    /* ================ OWNER ACTIONS ================ */
    function grantAdminRole(address account) external;

    function revokeAdminRole(address account) external;

    /**
     * @dev buy the amount of tokens to the _msgSender()
     * @notice the msg.values should be larger or equal than the tokens total price
     * @param quantity the amount of tokens to buy
     */
    function mint(uint256 quantity) external payable;

    function withdraw() external;

    function withdraw(IERC20 token) external;
}
