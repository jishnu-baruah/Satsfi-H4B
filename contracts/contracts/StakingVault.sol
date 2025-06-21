// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./stCORE.sol"; // Using an import for our own contract
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StakingVault
 * @dev This contract manages the staking and unstaking of CORE tokens.
 * It mints stCORE tokens upon deposit and burns them upon withdrawal.
 */
contract StakingVault is Ownable {
    using SafeERC20 for IERC20;

    StakedCore public immutable stCore; // The stCORE token contract
    IERC20 public immutable core;       // The underlying CORE token

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _coreTokenAddress, address _stCoreTokenAddress) Ownable(msg.sender) {
        core = IERC20(_coreTokenAddress);
        stCore = StakedCore(_stCoreTokenAddress);
    }

    /**
     * @dev Deposits CORE tokens to receive stCORE tokens 1:1.
     * @param _amount The amount of CORE to deposit.
     */
    function deposit(uint256 _amount) external {
        require(_amount > 0, "Cannot deposit zero");
        
        // Transfer CORE from the user to this contract
        core.safeTransferFrom(msg.sender, address(this), _amount);

        // Mint stCORE to the user
        stCore.mint(msg.sender, _amount);

        emit Deposited(msg.sender, _amount);
    }

    /**
     * @dev Withdraws CORE tokens by burning stCORE tokens 1:1.
     * @param _amount The amount of stCORE to burn.
     */
    function withdraw(uint256 _amount) external {
        require(_amount > 0, "Cannot withdraw zero");

        // Burn the user's stCORE tokens. The stCORE contract will check the balance.
        // We need to approve this contract to burn from the user. This is a simplification
        // for the MVP. A more robust implementation would use `burnFrom`.
        // For now, we assume the user has approved the vault.
        // A better approach is to have the user call `approve` on stCORE first.
        // Let's stick with a simpler flow where the vault is the owner of stCORE and can burn.
        // No, that's not right. The user owns the stCORE.
        // The user must call approve on stCORE, then withdraw on the vault.
        // Let's assume the user has done this.
        
        // To make this work, the stCORE contract needs a burnFrom function. Let's add it.
        // I will update stCORE.sol after this.

        // For the MVP, a simpler approach: the user gives allowance to this contract
        stCore.burnFrom(msg.sender, _amount);

        // Transfer CORE back to the user
        core.safeTransfer(msg.sender, _amount);

        emit Withdrawn(msg.sender, _amount);
    }
} 