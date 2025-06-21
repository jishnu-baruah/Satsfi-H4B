const priceCacheService = require('../services/priceCacheService');

const getPrices = (req, res) => {
    try {
        const prices = priceCacheService.getPrices();
        if (Object.keys(prices).length === 0) {
            // This case might happen on the very first call if the initial fetch isn't complete.
            // Or if CoinGecko was down on startup.
            return res.status(503).json({ success: false, message: 'Price data is not available yet. Please try again shortly.' });
        }
        res.status(200).json(prices);
    } catch (error) {
        console.error("Error retrieving prices from cache:", error.message);
        res.status(500).json({ success: false, message: 'Failed to retrieve prices.' });
    }
};

module.exports = {
    getPrices,
}; 