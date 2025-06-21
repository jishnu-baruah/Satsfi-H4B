const Transaction = require('../models/Transaction');

const borrow = async (intent, raw_intent) => {
    console.log("Lending controller called with intent:", intent);

    // Validate that collateral has been provided
    if (!intent.collateral) {
        const errorMessage = "Could not process borrow request. Please specify which asset to use as collateral (e.g., 'borrow 5000 USDC against my BTC').";
        const transaction = new Transaction({
            raw_intent: raw_intent,
            parsed_intent: intent,
            status: 'failed',
            response_message: errorMessage,
        });
        await transaction.save();
        return { success: false, message: errorMessage };
    }

    // 1. Create a mock success message
    const amount = intent.amount;
    const asset = intent.asset.toUpperCase();
    const collateral_asset = intent.collateral.toUpperCase();

    const responseMessage = `Successfully borrowed ${amount} ${asset} against your ${collateral_asset} collateral. Your loan is healthy with a collateralization ratio of 150%.`;

    // 2. Save the mock transaction to the database
    const transaction = new Transaction({
        raw_intent: raw_intent,
        parsed_intent: intent,
        status: 'success',
        response_message: responseMessage,
    });
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

module.exports = {
    borrow,
    getTransactions,
}; 