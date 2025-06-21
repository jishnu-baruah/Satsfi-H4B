// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Satsfi USD (SUSD)
 * @dev An ERC20 stablecoin pegged to the US Dollar, used for borrowing.
 * Only the owner (the LendingPool contract) can mint or burn tokens.
 */
contract SatsfiUSD is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("Satsfi USD", "SUSD") Ownable(msg.sender) {}

    /**
     * @dev Creates `amount` tokens and assigns them to `account`.
     * Can only be called by the owner.
     */
    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`.
     * Can only be called by the owner.
     */
    function burn(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }
} 