const geminiService = require('../services/geminiService');
const stakingController = require('./stakingController');
const lendingController = require('./lendingController');
const Transaction = require('../models/Transaction');

// These would eventually be real controllers that interact with smart contracts
// const stakingController = require('./stakingController');
// const lendingController = require('./lendingController');

const processIntent = async (req, res) => {
    const { intent, userAddress } = req.body;
    if (!intent) {
        return res.status(400).json({ success: false, message: 'Intent is required.' });
    }

    // Create the initial transaction record
    const transaction = new Transaction({
        raw_intent: intent,
        userAddress,
        parsed_intent: {}, // Start with an empty object
    });

    try {
        const parsedIntent = await geminiService.parseIntent(intent);
        transaction.parsed_intent = parsedIntent;

        // Handle cases where Gemini could not parse the intent
        if (!parsedIntent || !parsedIntent.action) {
            transaction.status = 'failed';
            transaction.response_message = 'Could not understand the request. Please try rephrasing.';
            await transaction.save();
            return res.status(400).json({ success: false, message: transaction.response_message });
        }
        
        let result;

        // Route to the appropriate controller based on the parsed action
        switch (parsedIntent.action) {
            case 'stake':
                result = await stakingController.stake(transaction);
                break;
            case 'borrow':
                result = await lendingController.borrow(transaction);
                break;
            case 'repay':
                result = await lendingController.repay(transaction);
                break;
            case 'withdraw':
                result = await stakingController.withdraw(transaction);
                break;
            default:
                transaction.status = 'failed';
                transaction.response_message = `Action '${parsedIntent.action}' is not supported yet.`;
                await transaction.save();
                result = { success: false, message: transaction.response_message };
        }

        // IMPORTANT: The result from controllers should contain { success, message, transaction (the unsigned tx object) }
        // We add the transaction ID here before sending to the frontend.
        if (result && result.success && result.transaction) {
             res.status(200).json({
                ...result,
                transactionId: transaction._id 
             });
        } else {
            res.status(result.success ? 200 : 400).json(result);
        }

    } catch (error) {
        console.error("Error processing intent:", error);
        transaction.status = 'failed';
        transaction.response_message = 'An internal error occurred while processing the intent.';
        // Don't re-throw, just save the transaction with an error state
        await transaction.save().catch(saveError => {
            console.error("Error saving transaction after an error:", saveError);
        });
        res.status(500).json({ success: false, message: transaction.response_message, error: error.message });
    }
};

module.exports = {
    processIntent,
}; 