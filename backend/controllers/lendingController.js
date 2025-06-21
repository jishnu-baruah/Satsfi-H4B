const Transaction = require('../models/Transaction');

const borrow = async (transaction) => {
    console.log("Lending controller called with transaction:", transaction);

    // Validate that collateral has been provided
    if (!transaction.parsed_intent.collateral) {
        const errorMessage = "Could not process borrow request. Please specify which asset to use as collateral (e.g., 'borrow 5000 USDC against my BTC').";
        transaction.status = 'failed';
        transaction.response_message = errorMessage;
        await transaction.save();
        return { success: false, message: errorMessage };
    }

    // 1. Create a mock success message
    const amount = transaction.parsed_intent.amount;
    const asset = transaction.parsed_intent.asset.toUpperCase();
    const collateral_asset = transaction.parsed_intent.collateral.toUpperCase();

    const responseMessage = `Successfully borrowed ${amount} ${asset} against your ${collateral_asset} collateral. Your loan is healthy with a collateralization ratio of 150%.`;

    // 2. Update the transaction in the database
    transaction.status = 'success';
    transaction.response_message = responseMessage;
    await transaction.save();

    // 3. Return the success message
    return { success: true, message: responseMessage };
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
    getTransactions,
    getUserTransactions,
}; 