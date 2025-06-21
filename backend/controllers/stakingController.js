const Transaction = require('../models/Transaction');

const stake = async (intent, raw_intent) => {
    console.log("Staking controller called with intent:", intent);
    
    // 1. Create a mock success message
    const amount = intent.amount;
    const asset = intent.asset.toUpperCase();
    const responseMessage = `Successfully staked ${amount} ${asset}. You are now earning 6.2% APY in the Pell Vault.`;

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

module.exports = {
    stake,
}; 