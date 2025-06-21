const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateResponse = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Error generating response from Gemini:", error);
        throw new Error("Failed to generate AI response.");
    }
};

const generateIntentExplanation = async (intent) => {
    const prompt = `
You are a helpful DeFi assistant. A user has provided an intent, and your goal is to explain it to them in a simple, easy-to-understand way. The user is likely a beginner.

Keep the explanation concise (2-3 sentences) and focus on the core action and its outcome. Avoid overly technical jargon.

User Intent: "${intent}"

Explanation:
    `;
    return generateResponse(prompt);
};

const generateDetailedIntentExplanation = async (intent) => {
    const prompt = `
You are a helpful DeFi assistant. A user has asked for a more detailed explanation of their intent. Your goal is to provide a comprehensive but still easy-to-understand explanation. The user is likely a beginner but is curious to learn more.

Explain the following user intent in 3-4 sentences. Cover what the action is, what happens to their assets, what the potential risks are (if any), and what the expected outcome is. Use analogies if helpful.

User Intent: "${intent}"

Detailed Explanation:
    `;
    return generateResponse(prompt);
};

module.exports = {
    generateResponse,
    generateIntentExplanation,
    generateDetailedIntentExplanation,
}; 