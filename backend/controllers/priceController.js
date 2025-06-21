const priceCacheService = require('../services/priceCacheService');
const axios = require('axios');

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

const getHistoricalData = async (req, res) => {
    const { id, days = 30 } = req.query;
    if (!id) {
        return res.status(400).json({ success: false, message: 'Coin ID is required.' });
    }

    const API_KEY = process.env.COINGECKO_API_KEY;
    const baseUrl = 'https://api.coingecko.com/api/v3';
    let apiUrl = `${baseUrl}/coins/${id}/market_chart?vs_currency=usd&days=${days}`;

    if (API_KEY) {
        apiUrl += `&x_cg_demo_api_key=${API_KEY}`;
    }
    
    // Use the same proxy as the price cache service
    const encodedApiUrl = encodeURIComponent(apiUrl);
    const PROXY_URL = `https://api.allorigins.win/raw?url=${encodedApiUrl}`;

    try {
        const response = await axios.get(PROXY_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });

        if (response.data) {
            res.status(200).json(response.data);
        } else {
            throw new Error('Proxy response was empty or malformed.');
        }
    } catch (error) {
        console.error(`Error fetching historical data for ${id}:`, error.message);
        res.status(500).json({ success: false, message: `Failed to fetch historical data for ${id}.` });
    }
};

module.exports = {
    getPrices,
    getHistoricalData,
};