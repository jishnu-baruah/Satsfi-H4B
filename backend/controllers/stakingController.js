const Transaction = require('../models/Transaction');

const stake = async (transaction) => {
    // This is a placeholder for real staking logic.
    // For now, we'll just mark the transaction as successful.
    console.log("Staking controller called with transaction:", transaction);

    const amount = transaction.parsed_intent.amount;
    const asset = transaction.parsed_intent.asset.toUpperCase();

    const responseMessage = `Successfully staked ${amount} ${asset} in the ${transaction.parsed_intent.vault || 'default'} vault. You are now earning a promotional APY of 7.2%.`;
    
    transaction.status = 'success';
    transaction.response_message = responseMessage;
    
    await transaction.save();

    return { success: true, message: responseMessage };
};

module.exports = {
    stake,
}; 