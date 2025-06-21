const axios = require('axios');

const COIN_GECKO_IDS = ["bitcoin", "ethereum", "usd-coin", "tether", "coredaoorg"].join(',');
const API_KEY = process.env.COINGECKO_API_KEY;

// The base URL for the public/demo API.
const baseUrl = 'https://api.coingecko.com/api/v3';
let apiUrl = `${baseUrl}/simple/price?ids=${COIN_GECKO_IDS}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`;

// If a DEMO key is provided, append it to the URL.
if (API_KEY) {
    apiUrl += `&x_cg_demo_api_key=${API_KEY}`;
}

// Use a more robust proxy service. The target URL must be encoded.
const encodedApiUrl = encodeURIComponent(apiUrl);
const PROXY_URL = `https://api.allorigins.win/raw?url=${encodedApiUrl}`;

class PriceCacheService {
    constructor() {
        this.priceCache = {};
        this.fetchInterval = 300000; // Fetch every 5 minutes
    }

    async fetchAndCachePrices() {
        try {
             const config = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                }
            };
            
            const response = await axios.get(PROXY_URL, config);
            
            // The AllOrigins proxy returns the data directly as a JS object.
            if (response.data) {
                 this.priceCache = response.data;
                 console.log('Successfully fetched and cached prices from CoinGecko via proxy.');
            } else {
                throw new Error('Proxy response was empty or malformed.');
            }
        } catch (error) {
            if (error.response) {
                console.error(`Error fetching prices from proxy: Status ${error.response.status} - ${error.response.statusText}`);
            } else {
                console.error('Error fetching prices from proxy:', error.message);
            }
        }
    }

    start() {
        console.log('Price cache service started. Fetching initial prices...');
        this.fetchAndCachePrices(); // Fetch immediately on start
        setInterval(() => this.fetchAndCachePrices(), this.fetchInterval);
    }

    getPrices() {
        return this.priceCache;
    }
}

// Export a singleton instance
module.exports = new PriceCacheService(); 