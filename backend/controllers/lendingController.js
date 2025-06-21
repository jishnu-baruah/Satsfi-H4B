const Transaction = require('../models/Transaction');
const { ethers } = require('ethers');

const LENDING_POOL_ADDRESS = "0xFcE44C16e18F98d58dDC85b8c803B9CaBFeBf542";

const borrow = async (transaction) => {
    try {
        const amount = transaction.parsed_intent.amount;
        const asset = transaction.parsed_intent.asset?.toUpperCase();

        // --- Input Validation ---
        if (
            !amount ||
            typeof amount !== "number" ||
            !asset
        ) {
            throw new Error(
                "Could not parse the amount or asset from your intent. Please be more specific (e.g., 'borrow 0.1 CORE')."
            );
        }
        // --- End Validation ---

        console.log("Preparing borrow transaction:", transaction);

        const amountInWei = ethers.parseEther(amount.toString());

        const txData = {
            to: LENDING_POOL_ADDRESS,
            functionName: "borrow",
            args: [amountInWei.toString()],
        };

        const responseMessage = `Ready to borrow ${amount} ${asset}. Please confirm the transaction in your wallet.`;

        transaction.status = 'pending';
        transaction.response_message = responseMessage;
        await transaction.save();

        return {
            success: true,
            message: responseMessage,
            transaction: txData,
            transactionId: transaction._id,
        };
    } catch (error) {
        console.error("Failed to prepare borrow transaction:", error);
        const errorMessage = `Failed to prepare borrow transaction: ${error.message}`;

        transaction.status = 'failed';
        transaction.response_message = errorMessage;
        await transaction.save();

        return { success: false, message: errorMessage };
    }
};

const repay = async (transaction) => {
    try {
        const amount = transaction.parsed_intent.amount;
        const asset = transaction.parsed_intent.asset?.toUpperCase();

        // --- Input Validation ---
        if (
            !amount ||
            typeof amount !== "number" ||
            !asset
        ) {
            throw new Error(
                "Could not parse the amount or asset from your intent. Please be more specific (e.g., 'repay 0.1 CORE')."
            );
        }
        // --- End Validation ---

        console.log("Preparing repay transaction:", transaction);

        const amountInWei = ethers.parseEther(amount.toString());

        const txData = {
            to: LENDING_POOL_ADDRESS,
            functionName: "repay",
            args: [],
            value: amountInWei.toString(),
        };

        const responseMessage = `Ready to repay ${amount} ${asset}. Please confirm the transaction in your wallet.`;

        transaction.status = 'pending';
        transaction.response_message = responseMessage;
        await transaction.save();

        return {
            success: true,
            message: responseMessage,
            transaction: txData,
            transactionId: transaction._id,
        };
    } catch (error) {
        console.error("Failed to prepare repay transaction:", error);
        const errorMessage = `Failed to prepare repay transaction: ${error.message}`;

        transaction.status = 'failed';
        transaction.response_message = errorMessage;
        await transaction.save();

        return { success: false, message: errorMessage };
    }
};

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: transactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch transactions.', error: error.message });
    }
};

const getUserTransactions = async (req, res) => {
    try {
        const { address } = req.params;
        if (!address) {
            return res.status(400).json({ success: false, message: 'User address is required.' });
        }
        const transactions = await Transaction.find({ userAddress: address }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: transactions });
    } catch (error) {
        console.error("Error fetching user transactions:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch user transactions.', error: error.message });
    }
};

module.exports = {
    borrow,
    repay,
    getTransactions,
    getUserTransactions,
}; 