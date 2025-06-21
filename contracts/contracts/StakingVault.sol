// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./stCORE.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StakingVault
 * @dev Manages staking of native CORE to mint stCORE.
 */
contract StakingVault is Ownable {
    StakedCore public immutable stCore;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _stCoreTokenAddress) Ownable(msg.sender) {
        stCore = StakedCore(_stCoreTokenAddress);
    }

    /**
     * @dev Deposits native CORE to receive stCORE tokens 1:1.
     */
    function deposit() external payable {
        require(msg.value > 0, "Cannot deposit zero");
        stCore.mint(msg.sender, msg.value);
        emit Deposited(msg.sender, msg.value);
    }

    /**
     * @dev Withdraws CORE by burning stCORE tokens 1:1.
     * @param amount The amount of stCORE to burn.
     */
    function withdraw(uint256 amount) external {
        require(amount > 0, "Cannot withdraw zero");

        // User must have approved the vault to spend their stCORE
        stCore.burnFrom(msg.sender, amount);

        // Transfer native CORE back to the user
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, amount);
    }
}