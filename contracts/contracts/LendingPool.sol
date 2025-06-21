// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IChainlinkAggregator.sol";
import "./interfaces/ICivicVerifier.sol";
import "./SUSD.sol";
import "./stCORE.sol";

/**
 * @title LendingPool
 * @dev Manages borrowing SUSD against stCORE collateral.
 */
contract LendingPool is Ownable {
    using SafeERC20 for IERC20;

    // --- State Variables ---

    // Our own contracts
    SatsfiUSD public susdToken;
    IERC20 public stCoreToken;

    // External integrations
    IChainlinkAggregator public priceFeed;
    ICivicVerifier public civicVerifier;

    // System parameters
    uint256 public constant COLLATERAL_RATIO_PRECISION = 100;
    uint256 public minCollateralizationRatio = 150; // In percentage (e.g., 150%)
    uint256 public liquidationThreshold = 125;      // In percentage (e.g., 125%)
    bytes32 public civicGatekeeperNetwork;

    // User data
    mapping(address => uint256) public collateral; // user => amount of stCORE
    mapping(address => uint256) public debt;       // user => amount of SUSD borrowed

    // --- Events ---

    event CollateralDeposited(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);
    event LoanTaken(address indexed user, uint256 amount);
    event LoanRepaid(address indexed user, uint256 amount);
    event LoanLiquidated(address indexed liquidator, address indexed user, uint256 debtPaid, uint256 collateralSeized);

    // --- Constructor ---

    constructor(
        address _susdTokenAddress,
        address _stCoreTokenAddress,
        address _priceFeedAddress,
        address _civicVerifierAddress,
        bytes32 _civicGatekeeperNetwork
    ) Ownable(msg.sender) {
        susdToken = SatsfiUSD(_susdTokenAddress);
        stCoreToken = IERC20(_stCoreTokenAddress);
        priceFeed = IChainlinkAggregator(_priceFeedAddress);
        civicVerifier = ICivicVerifier(_civicVerifierAddress);
        civicGatekeeperNetwork = _civicGatekeeperNetwork;
    }

    // --- Internal Helper Functions ---

    /**
     * @dev Gets the latest price from the Chainlink price feed.
     * The price is returned with 8 decimals of precision.
     */
    function getAssetPrice() internal view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        // Price feed has 8 decimals, so we return it as a uint
        return uint256(price);
    }

    /**
     * @dev Calculates the USD value of a user's stCORE collateral.
     */
    function getCollateralValueInUSD(address _user) public view returns (uint256) {
        uint256 stCoreAmount = collateral[_user];
        if (stCoreAmount == 0) return 0;

        uint256 price = getAssetPrice();
        // stCORE has 18 decimals, price feed has 8.
        // (stCoreAmount * price) / 10**18 (for stCore decimals) / 10**8 (for price decimals)
        // To avoid floating point, we multiply first, then divide.
        // (stCoreAmount * price) / 10**(18 + 8) -> (stCoreAmount * price) / 1e26
        // Let's simplify and assume stCORE price is 1:1 with CORE price from feed
        return (stCoreAmount * price) / 1e8; // stCORE has 18 decimals, but we need USD value
    }

    /**
     * @dev Calculates the health factor of a user's loan.
     * A health factor below 100 means the position is undercollateralized.
     */
    function getHealthFactor(address _user) public view returns (uint256) {
        uint256 collateralValue = getCollateralValueInUSD(_user);
        uint256 userDebt = debt[_user];

        if (userDebt == 0) return type(uint256).max;

        // Health Factor = (Collateral Value * 100) / Debt Value
        return (collateralValue * COLLATERAL_RATIO_PRECISION) / userDebt;
    }

    // --- Core Logic Functions ---

    /**
     * @dev Deposits stCORE as collateral.
     */
    function depositCollateral(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than zero");
        collateral[msg.sender] += _amount;
        stCoreToken.safeTransferFrom(msg.sender, address(this), _amount);
        emit CollateralDeposited(msg.sender, _amount);
    }

    /**
     * @dev Withdraws stCORE collateral.
     */
    function withdrawCollateral(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than zero");
        require(collateral[msg.sender] >= _amount, "Insufficient collateral");
        
        collateral[msg.sender] -= _amount;
        
        // Check if the user's position is still healthy after withdrawal
        require(getHealthFactor(msg.sender) >= minCollateralizationRatio, "Position would be undercollateralized");

        stCoreToken.safeTransfer(msg.sender, _amount);
        emit CollateralWithdrawn(msg.sender, _amount);
    }

    // --- Borrowing and Repayment ---

    /**
     * @dev Borrows SUSD against the user's collateral.
     */
    function borrow(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than zero");

        // On-chain check for Civic Pass
        require(civicVerifier.verifyToken(msg.sender, civicGatekeeperNetwork), "Civic Pass not found");

        uint256 maxBorrowable = getCollateralValueInUSD(msg.sender) * COLLATERAL_RATIO_PRECISION / minCollateralizationRatio;
        uint256 totalDebtAfter = debt[msg.sender] + _amount;
        
        require(totalDebtAfter <= maxBorrowable, "Borrow amount exceeds maximum allowed");

        debt[msg.sender] = totalDebtAfter;
        susdToken.mint(msg.sender, _amount);
        emit LoanTaken(msg.sender, _amount);
    }

    /**
     * @dev Repays a SUSD loan.
     */
    function repay(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than zero");
        require(debt[msg.sender] >= _amount, "Amount exceeds debt");

        debt[msg.sender] -= _amount;
        // SUSD contract is our own, but for consistency we should use the burnable extension
        // I will add that to SUSD.sol next
        susdToken.burnFrom(msg.sender, _amount);
        emit LoanRepaid(msg.sender, _amount);
    }

    // --- Liquidation ---

    /**
     * @dev Allows third parties to liquidate undercollateralized positions.
     */
    function liquidate(address _user) external {
        require(getHealthFactor(_user) < liquidationThreshold, "Position is not eligible for liquidation");
        
        uint256 userDebt = debt[_user];
        uint256 collateralValue = getCollateralValueInUSD(_user);
        
        // Liquidator repays the full debt
        // User must approve this contract to spend their SUSD
        susdToken.burnFrom(msg.sender, userDebt);

        // Calculate collateral to be seized (with a discount, implied by the health factor)
        uint256 collateralToSeize = userDebt * 1e18 / getAssetPrice(); // Simplified calculation

        collateral[_user] -= collateralToSeize;
        debt[_user] = 0;

        stCoreToken.safeTransfer(msg.sender, collateralToSeize);
        emit LoanLiquidated(msg.sender, _user, userDebt, collateralToSeize);
    }
} 