const geminiService = require('../services/geminiService');
const stakingController = require('./stakingController');
const lendingController = require('./lendingController');
const Transaction = require('../models/Transaction');

// These would eventually be real controllers that interact with smart contracts
// const stakingController = require('./stakingController');
// const lendingController = require('./lendingController');

const buildIntentPrompt = (intent) => {
    return `
You are an intent parser for a DeFi application. Your task is to analyze the user's request and convert it into a structured JSON object.

The user can perform actions like: 'stake', 'borrow', 'repay', 'withdraw'.

Based on the following user input, create a JSON object with the keys: "action", "amount", "asset".
- "action" must be one of: "stake", "borrow", "repay", "withdraw", "unknown".
- "amount" should be a number.
- "asset" should be the ticker symbol (e.g., "CORE", "stCORE").

User Input: "${intent}"

JSON Output (provide only the JSON object):
    `;
};

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
        const intentPrompt = buildIntentPrompt(intent);
        const rawResponse = await geminiService.generateResponse(intentPrompt);
        
        // Clean up the text to ensure it's valid JSON before parsing
        const cleanedResponse = rawResponse.replace(/```json|```/g, '').trim();
        const parsedIntent = JSON.parse(cleanedResponse);

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

const explainIntent = async (req, res) => {
    const { intent } = req.body;
    if (!intent) {
        return res.status(400).json({ success: false, message: 'Intent is required for explanation.' });
    }

    try {
        const explanation = await geminiService.generateIntentExplanation(intent);
        res.status(200).json({ success: true, explanation });
    } catch (error) {
        console.error("Error explaining intent:", error);
        res.status(500).json({ success: false, message: 'Failed to generate explanation.' });
    }
};

module.exports = {
    processIntent,
    explainIntent,
}; 