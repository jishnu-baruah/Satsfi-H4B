const geminiService = require('../services/geminiService');
const { getPortfolioData } = require('./userController');
const priceCacheService = require('../services/priceCacheService');
const ChatMessage = require('../models/ChatMessage');
const KnowledgeArticle = require('../models/KnowledgeArticle');

const buildPrompt = (newMessage, history, portfolio, prices, knowledgeBase) => {
    const portfolioString = portfolio ? `
- Staked: ${parseFloat(portfolio.stakedBalance).toFixed(2)} stCORE
- Borrowed: ${parseFloat(portfolio.borrowedBalance).toFixed(2)} CORE
- Health Factor: ${parseFloat(portfolio.healthFactor).toFixed(2)}`
: "The user has no active portfolio.";

    const pricesString = prices ? `
- BTC: $${prices.bitcoin.usd.toFixed(2)}
- ETH: $${prices.ethereum.usd.toFixed(2)}
- CORE: $${prices['coredaoorg'].usd.toFixed(2)}`
: "Market prices are unavailable.";

    const historyString = history.map(msg => `${msg.role === 'user' ? 'User' : 'SatsFi'}: ${msg.content}`).join('\\n');
    
    const knowledgeString = knowledgeBase.map(article => `- ${article.topic}: ${article.content}`).join('\\n');

    return `You are SatsFi, a friendly and expert guide to the Core blockchain and the SatsFi DeFi application. Your primary role is to onboard new and existing web3 users by making complex topics simple. You are patient, educational, and encouraging. Your answers must be concise, conversational, and easy to understand.

**Dynamic Knowledge Base:**
${knowledgeString}

**Conversation History:**
${historyString}

**Live User Data:**
Portfolio:
${portfolioString}
Prices:
${pricesString}

**New Question:**
User: "${newMessage}"

**Your Concise & Helpful Response:**
SatsFi:`;
};

const handleChat = async (req, res) => {
    try {
        const { message, userAddress } = req.body;

        if (!message || !userAddress) {
            return res.status(400).json({ success: false, message: 'Message and userAddress are required.' });
        }

        // 1. Save user's message
        await ChatMessage.create({ userAddress, role: 'user', content: message });

        // 2. Fetch all contextual data
        const history = await ChatMessage.find({ userAddress }).sort({ createdAt: -1 }).limit(10).lean();
        history.reverse(); 

        const knowledgeBase = await KnowledgeArticle.find({}).lean();
        const portfolioData = await getPortfolioData(userAddress);
        const priceData = priceCacheService.getPrices();

        // 3. Build the prompt
        const prompt = buildPrompt(message, history, portfolioData, priceData, knowledgeBase);

        // 4. Get AI response
        const aiResponse = await geminiService.generateResponse(prompt);

        // 5. Save AI's response
        await ChatMessage.create({ userAddress, role: 'model', content: aiResponse });

        res.status(200).json({ success: true, reply: aiResponse });

    } catch (error) {
        console.error("Error in chatbot controller:", error);
        res.status(500).json({ success: false, message: 'An internal error occurred.' });
    }
};

const clearChatHistory = async (req, res) => {
    try {
        const { userAddress } = req.body;
        if (!userAddress) {
            return res.status(400).json({ success: false, message: 'userAddress is required.' });
        }

        await ChatMessage.deleteMany({ userAddress });

        res.status(200).json({ success: true, message: 'Chat history cleared successfully.' });
    } catch (error) {
        console.error("Error clearing chat history:", error);
        res.status(500).json({ success: false, message: 'Failed to clear chat history.' });
    }
};

module.exports = {
    handleChat,
    clearChatHistory,
};