// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IChainlinkAggregator.sol";

/**
 * @title LendingPool
 * @dev Manages stCORE collateral and allows borrowing of native CORE.
 */
contract LendingPool is Ownable {
    // --- State Variables ---

    IERC20 public immutable stCORE;
    IChainlinkAggregator public immutable priceFeed;

    mapping(address => uint256) public stCORECollateral;
    mapping(address => uint256) public borrowedCORE;

    uint256 public loanToValueRatio = 70; // 70% LTV

    // --- Events ---

    event CollateralDeposited(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);
    event CoreBorrowed(address indexed user, uint256 amount);
    event CoreRepaid(address indexed user, uint256 amount);

    // --- Errors ---

    error LendingPool__InsufficientCollateral();
    error LendingPool__MustBeGreaterThanZero();
    error LendingPool__TransferFailed();
    error LendingPool__RepaymentAmountExceedsDebt();

    // --- Constructor ---

    constructor(address _stCoreAddress, address _priceFeedAddress) Ownable(msg.sender) {
        stCORE = IERC20(_stCoreAddress);
        priceFeed = IChainlinkAggregator(_priceFeedAddress);
    }

    // --- External Functions ---

    /**
     * @dev Deposits stCORE as collateral.
     * @param amount The amount of stCORE to deposit.
     */
    function depositCollateral(uint256 amount) external {
        if (amount == 0) revert LendingPool__MustBeGreaterThanZero();
        stCORECollateral[msg.sender] += amount;
        bool success = stCORE.transferFrom(msg.sender, address(this), amount);
        if (!success) revert LendingPool__TransferFailed();
        emit CollateralDeposited(msg.sender, amount);
    }
    
    /**
     * @dev Allows users to borrow native CORE against their stCORE collateral.
     * @param amount The amount of CORE to borrow.
     */
    function borrowCORE(uint256 amount) external {
        if (amount == 0) revert LendingPool__MustBeGreaterThanZero();
        
        uint256 healthFactor = getHealthFactor(msg.sender);
        if(healthFactor < 1 ether) revert LendingPool__InsufficientCollateral();

        borrowedCORE[msg.sender] += amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        if (!success) revert LendingPool__TransferFailed();

        emit CoreBorrowed(msg.sender, amount);
    }

    /**
     * @dev Allows users to repay their borrowed CORE.
     */
    function repayCORE() external payable {
        if (msg.value == 0) revert LendingPool__MustBeGreaterThanZero();
        if (msg.value > borrowedCORE[msg.sender]) revert LendingPool__RepaymentAmountExceedsDebt();
        
        borrowedCORE[msg.sender] -= msg.value;
        emit CoreRepaid(msg.sender, msg.value);
    }

    // --- Public & View Functions ---

    /**
     * @dev Calculates the health factor of a user's loan.
     * @param user The address of the user.
     * @return The health factor, where 1e18 (or 1 ether) is the liquidation threshold.
     */
    function getHealthFactor(address user) public view returns (uint256) {
        (uint256 totalCollateralValueInUSD, uint256 totalDebtInUSD) = _getAccountInfo(user);
        if (totalDebtInUSD == 0) return type(uint256).max;
        
        uint256 healthFactor = (totalCollateralValueInUSD * 1 ether) / totalDebtInUSD;
        return healthFactor;
    }

    // --- Internal Functions ---

    function _getAccountInfo(address user) internal view returns (uint256 totalCollateralValueInUSD, uint256 totalDebtInUSD) {
        // 1. Get stCORE collateral and borrowed CORE amounts
        uint256 stCoreCollateralAmount = stCORECollateral[user];
        uint256 coreBorrowedAmount = borrowedCORE[user];

        // 2. Get the price of CORE from Chainlink
        (, int256 price, , , ) = priceFeed.latestRoundData();
        // Price comes with 8 decimals, so we adjust to 18
        uint256 corePriceInUSD = uint256(price) * 1e10; 

        // 3. Calculate total values in USD
        totalCollateralValueInUSD = (stCoreCollateralAmount * corePriceInUSD * loanToValueRatio) / 100 / 1e18;
        totalDebtInUSD = (coreBorrowedAmount * corePriceInUSD) / 1e18;

        return (totalCollateralValueInUSD, totalDebtInUSD);
    }
} 