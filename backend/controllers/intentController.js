const geminiService = require('../services/geminiService');
const stakingController = require('./stakingController');
const lendingController = require('./lendingController');
const Transaction = require('../models/Transaction');

// These would eventually be real controllers that interact with smart contracts
// const stakingController = require('./stakingController');
// const lendingController = require('./lendingController');

const processIntent = async (req, res) => {
    const { intent } = req.body;
    if (!intent) {
        return res.status(400).json({ success: false, message: 'Intent is required.' });
    }

    try {
        const parsedIntent = await geminiService.parseIntent(intent);

        // Handle cases where Gemini could not parse the intent
        if (!parsedIntent) {
            const transaction = new Transaction({
                raw_intent: intent,
                parsed_intent: { intent: 'UNKNOWN' },
                status: 'failed',
                response_message: 'Could not understand the request. Please try rephrasing.',
            });
            await transaction.save();
            return res.status(400).json({ success: false, message: "Sorry, I couldn't understand that. Please try rephrasing your request." });
        }
        
        let result;

        // Route to the appropriate controller based on the parsed action
        switch (parsedIntent.action) {
            case 'stake':
                result = await stakingController.stake(parsedIntent, intent);
                break;
            case 'borrow':
                result = await lendingController.borrow(parsedIntent, intent);
                break;
            default:
                // If the action is unknown, save it as a pending transaction for review
                const transaction = new Transaction({
                    raw_intent: intent,
                    parsed_intent: parsedIntent,
                    status: 'pending_review',
                    response_message: 'Action not recognized.',
                });
                await transaction.save();
                return res.status(400).json({ success: false, message: `Action '${parsedIntent.action}' is not supported.` });
        }

        res.status(200).json(result);

    } catch (error) {
        console.error("Error processing intent:", error);
        res.status(500).json({ success: false, message: 'Failed to process intent.', error: error.message });
    }
};

module.exports = {
    processIntent,
}; 