const geminiService = require('../services/geminiService');

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

const explainMore = async (req, res) => {
    const { intent } = req.body;
    if (!intent) {
        return res.status(400).json({ success: false, message: 'Intent is required for a detailed explanation.' });
    }

    try {
        const explanation = await geminiService.generateDetailedIntentExplanation(intent);
        res.status(200).json({ success: true, explanation });
    } catch (error) {
        console.error("Error generating detailed explanation:", error);
        res.status(500).json({ success: false, message: 'Failed to generate detailed explanation.' });
    }
};

module.exports = { explainIntent, explainMore };