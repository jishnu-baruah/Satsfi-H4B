const Transaction = require('../models/Transaction');
const { ethers } = require("ethers");

const STAKING_VAULT_ADDRESS = "0xE3451D1081232BE36b257F712120B8d78f07e5F6";

const stake = async (transaction) => {
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
                "Could not parse the amount or asset from your intent. Please be more specific (e.g., 'stake 0.1 CORE')."
            );
        }
        // --- End Validation ---

        if(!STAKING_VAULT_ADDRESS) {
            throw new Error("Staking vault address is not configured.");
        }

        console.log("Preparing stake transaction:", transaction);

        const amountInWei = ethers.parseEther(amount.toString());

        // Prepare the transaction data for the frontend (without the ABI)
        const txData = {
            to: STAKING_VAULT_ADDRESS,
            functionName: "deposit",
            args: [],
            value: amountInWei.toString(),
        };

        const responseMessage = `Ready to stake ${amount} ${asset}. Please confirm the transaction in your wallet.`;

        // Mark transaction as pending
        transaction.status = "pending";
        transaction.response_message = responseMessage;
        await transaction.save();

        return {
            success: true,
            message: responseMessage,
            transaction: txData,
            transactionId: transaction._id,
        };
    } catch (error) {
        console.error("Failed to prepare stake transaction:", error);
        const errorMessage = `Failed to prepare stake transaction: ${error.message}`;

        transaction.status = "failed";
        transaction.response_message = errorMessage;
        await transaction.save();

        return { success: false, message: errorMessage };
    }
};

const withdraw = async (transaction) => {
    try {
        const amount = transaction.parsed_intent.amount;
        const asset = transaction.parsed_intent.asset?.toUpperCase();

        if (
            !amount ||
            typeof amount !== "number" ||
            !asset
        ) {
            throw new Error(
                "Could not parse the amount or asset from your intent. Please be more specific (e.g., 'withdraw 0.1 stCORE')."
            );
        }

        if(!STAKING_VAULT_ADDRESS) {
            throw new Error("Staking vault address is not configured.");
        }

        const amountInWei = ethers.parseEther(amount.toString());

        const txData = {
            to: STAKING_VAULT_ADDRESS,
            functionName: "withdraw",
            args: [amountInWei.toString()],
            value: "0", // No value sent when withdrawing
        };

        const responseMessage = `Ready to withdraw ${amount} ${asset}. Please confirm the transaction in your wallet.`;

        transaction.status = "pending";
        transaction.response_message = responseMessage;
        await transaction.save();

        return {
            success: true,
            message: responseMessage,
            transaction: txData,
        };
    } catch (error) {
        console.error("Failed to prepare withdraw transaction:", error);
        const errorMessage = `Failed to prepare withdraw transaction: ${error.message}`;

        transaction.status = "failed";
        transaction.response_message = errorMessage;
        await transaction.save();

        return { success: false, message: errorMessage };
    }
};

module.exports = {
    stake,
    withdraw,
}; 