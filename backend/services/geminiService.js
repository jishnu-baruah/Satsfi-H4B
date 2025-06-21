const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set. Please add it to your .env file in the backend directory.');
}

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Parses a user's natural language input into a structured intent object.
 * @param {string} userInput The raw text from the user (e.g., "Maximize yield on 0.5 BTC").
 * @returns {Promise<object|null>} A structured intent object or null if parsing fails.
 */
async function parseIntent(userInput) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const prompt = `
    You are an intent parser for a DeFi neobank called Satsfi. Your task is to analyze the user's request and convert it into a structured JSON object.

    The user can perform two main actions:
    1.  **stake**: Staking an asset to earn yield. Keywords: "stake", "earn", "yield", "maximize".
    2.  **borrow**: Borrowing a stablecoin against collateral. Keywords: "borrow", "loan", "against", "collateral".

    Based on the following user input, create a JSON object with the keys: "action", "amount", "asset", and optionally "collateral".
    - "action" must be one of: "stake", "borrow", "unknown".
    - "amount" should be a number.
    - "asset" should be the ticker symbol (e.g., "BTC", "USDC").
    - "collateral" is the asset being used for the loan (e.g., "BTC").

    User Input: "${userInput}"

    JSON Output:
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the text to ensure it's valid JSON before parsing
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const parsedJson = JSON.parse(cleanedText);

    // Basic validation to ensure the parsed object has the expected shape
    if (parsedJson.action && typeof parsedJson.amount !== 'undefined' && parsedJson.asset) {
      return parsedJson;
    }

    return null;
  } catch (error) {
    console.error('Error parsing intent with Gemini:', error);
    return null;
  }
}

module.exports = { parseIntent }; 