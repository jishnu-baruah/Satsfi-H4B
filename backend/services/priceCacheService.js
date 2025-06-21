const axios = require('axios');

const COIN_GECKO_IDS = ["bitcoin", "ethereum", "usd-coin", "tether", "coredaoorg"].join(',');
const COIN_GECKO_URL = `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_GECKO_IDS}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`;

class PriceCacheService {
    constructor() {
        this.priceCache = {};
        this.fetchInterval = 60000; // Fetch every 60 seconds
    }

    async fetchAndCachePrices() {
        try {
            const config = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            };
            const response = await axios.get(COIN_GECKO_URL, config);
            this.priceCache = response.data;
            console.log('Successfully fetched and cached prices from CoinGecko.');
        } catch (error) {
            if (error.response) {
                console.error(`Error fetching prices from CoinGecko: Status ${error.response.status} - ${error.response.statusText}`);
            } else {
                console.error('Error fetching prices from CoinGecko:', error.message);
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