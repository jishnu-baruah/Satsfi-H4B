const { ethers } = require("ethers");
const User = require('../models/User');

// --- Hardcoded Addresses & RPC URL ---
// This is the correct way to get the staked balance, as the StakingVault
// mints stCORE tokens directly to the user.
const CORE_TESTNET_RPC_URL = "https://rpc.test2.btcs.network";
const STCORE_ADDRESS = "0x5bDf8f6F713eb68E8740B6c764C389EE5a277990";
const LENDING_POOL_ADDRESS = "0xFcE44C16e18F98d58dDC85b8c803B9CaBFeBf542";

// This function is now self-contained and can be used by other controllers.
const getPortfolioData = async (address) => {
    try {
        if (!CORE_TESTNET_RPC_URL) {
            throw new Error("Server configuration error: RPC URL is missing.");
        }
        
        const provider = new ethers.JsonRpcProvider(CORE_TESTNET_RPC_URL);

        const stCoreContract = new ethers.Contract(
            STCORE_ADDRESS,
            ['function balanceOf(address) view returns (uint256)'],
            provider
        );

        const lendingPoolContract = new ethers.Contract(
            LENDING_POOL_ADDRESS,
            ['function borrowedCORE(address) view returns (uint256)'],
            provider
        );

        const [stakedBalanceWei, borrowedBalanceWei] = await Promise.all([
            stCoreContract.balanceOf(address),
            lendingPoolContract.borrowedCORE(address)
        ]);
        
        const stakedBalance = ethers.formatEther(stakedBalanceWei);
        const borrowedBalance = ethers.formatEther(borrowedBalanceWei);
        
        const healthFactor = "1.0"; // Placeholder

        return {
            stakedBalance,
            borrowedBalance,
            healthFactor,
        };
    } catch (error) {
        console.error(`Error fetching portfolio data for ${address}:`, error);
        // Return null or throw a more specific error to be handled by the caller
        return null;
    }
};


const getPortfolio = async (req, res) => {
    try {
        const { address } = req.params;
        const portfolioData = await getPortfolioData(address);

        if (portfolioData) {
            res.status(200).json({
                success: true,
                data: portfolioData,
            });
        } else {
            res.status(500).json({ success: false, message: 'Failed to fetch on-chain portfolio data.' });
        }

    } catch (error) {
        console.error("Error in getPortfolio handler:", error);
        res.status(500).json({ success: false, message: 'An internal error occurred.' });
    }
};

const linkUser = async (req, res) => {
    const { email, address } = req.body;
  
    if (!email || !address) {
      return res.status(400).json({ message: 'Email and address are required.' });
    }
  
    try {
      let user = await User.findOne({ email });
  
      if (user) {
        if (!user.walletAddresses.includes(address)) {
          user.walletAddresses.push(address);
          await user.save();
          res.status(200).json({ message: 'Address linked to existing user.', user });
        } else {
          res.status(200).json({ message: 'Address already linked.', user });
        }
      } else {
        user = new User({ email, walletAddresses: [address] });
        await user.save();
        res.status(201).json({ message: 'User created and address linked.', user });
      }
    } catch (error) {
      console.error('Error in linkUser:', error);
      res.status(500).json({ message: 'Server error linking user.' });
    }
};


module.exports = { getPortfolio, linkUser, getPortfolioData };