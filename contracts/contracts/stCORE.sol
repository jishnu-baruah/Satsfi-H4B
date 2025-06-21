// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Staked Core Token (stCORE)
 * @dev An ERC20 token representing a user's share in the CORE staking pool.
 * Only the owner (the StakingVault contract) can mint new tokens.
 */
contract StakedCore is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("Staked Core", "stCORE") Ownable(msg.sender) {}

    /**
     * @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - The caller must be the owner of the contract.
     */
    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    // The ERC20Burnable extension provides the `burnFrom` function, which respects allowances.
    // This allows the StakingVault to burn tokens on behalf of a user who has approved it.
} 