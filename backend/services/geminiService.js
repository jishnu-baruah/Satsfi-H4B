const { GoogleGenAI } = require('@google/genai');

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

/**
 * Parses a user's natural language input into a structured intent object.
 * @param {string} userInput The raw text from the user (e.g., "Maximize yield on 0.5 BTC").
 * @returns {Promise<object|null>} A structured intent object or null if parsing fails.
 */
async function parseIntent(userInput) {
  const prompt = `
    You are an intent parser for a DeFi neobank called Satsfi. Your task is to analyze the user's request and convert it into a structured JSON object.

    The user can perform two main actions:
    1.  **STAKE_YIELD**: Staking an asset to earn yield. Keywords: "stake", "earn", "yield", "maximize".
    2.  **BORROW_STABLE**: Borrowing a stablecoin against collateral. Keywords: "borrow", "loan", "against", "collateral".

    Based on the following user input, create a JSON object with the keys: "intent", "amount", "asset", and optionally "collateral".
    - "intent" must be one of: "STAKE_YIELD", "BORROW_STABLE", "UNKNOWN".
    - "amount" should be a number.
    - "asset" should be the ticker symbol (e.g., "BTC", "USDC").
    - "collateral" is the asset being used for the loan (e.g., "BTC").

    User Input: "${userInput}"

    JSON Output:
  `;

  try {
    const result = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
    });

    // Extract the text from the correct location in the response object
    const text = result.candidates[0].content.parts[0].text;

    // Clean up the text to ensure it's valid JSON before parsing
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const parsedJson = JSON.parse(cleanedText);

    // Basic validation to ensure the parsed object has the expected shape
    if (parsedJson.intent && typeof parsedJson.amount !== 'undefined' && parsedJson.asset) {
      return parsedJson;
    }

    return null;
  } catch (error) {
    console.error('Error parsing intent with Gemini:', error);
    return null;
  }
}

module.exports = { parseIntent }; 