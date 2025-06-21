# Gemini API Usage Guide for Satsfi

## 1. Introduction

This document provides a guide for using the Google Gemini API within the Satsfi backend. Gemini's primary role is to power the "intent-centric" nature of the application by parsing natural language user input into structured, actionable commands that the system can execute.

**Goal:** Allow users to type commands like *"Maximize yield on 0.5 BTC"* or *"Borrow 2000 USDC without selling BTC"*, and have the backend understand and act on these instructions.

---

## 2. Backend Setup & Installation

The entire Gemini integration lives within the Express.js backend.

### 2.1. Install the SDK

Navigate to the `backend` directory and install the Google Gen AI SDK.

```bash
cd backend
npm install @google/genai
```

### 2.2. Get Your API Key

1.  Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to generate a free API key.
2.  Add this key to your `backend/.env` file. This key must be kept secret.

```env
# backend/.env
GEMINI_API_KEY=your-gemini-api-key
```

---

## 3. Backend Implementation

We created a dedicated service to handle all interactions with the Gemini API.

### 3.1. Gemini Service (`services/geminiService.js`)

This service initializes the Gemini client and contains the core `parseIntent` function. This function takes raw user input and uses a detailed prompt to ask the Gemini model to return a structured JSON object.

```javascript
// backend/services/geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// This is the structure we expect Gemini to return.
// It is NOT a formal type definition in the code.
/*
interface ParsedIntent {
  action: "stake" | "borrow" | "unknown";
  amount: number;
  asset: string;
  collateral?: string;
  vault?: "Pell" | "B14G" | "stCORE" | "Babylon";
  apy?: number;
  ltv?: number;
}
*/

const parseIntent = async (userInput) => {
  const prompt = `
    You are an intent parser for a DeFi neobank called Satsfi. Your task is to analyze the user's request and convert it into a structured JSON object.

    The user can perform two main actions:
    1.  **stake**: Staking an asset to earn yield. Keywords: "stake", "earn", "yield", "maximize".
    2.  **borrow**: Borrowing a stablecoin against collateral. Keywords: "borrow", "loan", "against", "collateral".

    Based on the following user input, create a JSON object with the keys: "action", "amount", "asset", and optionally "collateral", "vault", "apy", "ltv".
    - "action" must be one of: "stake", "borrow", or "unknown".
    - "amount" should be a number.
    - "asset" should be the ticker symbol (e.g., "BTC", "USDC").
    - "collateral" is the asset being used for the loan (e.g., "BTC").
    - "vault" is the name of the staking vault, if mentioned. Can be one of: "Pell", "B14G", "stCORE", "Babylon".
    - For any value that is not present in the user input, do not include the key in the JSON output.

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

    // Basic validation
    if (parsedJson.action) {
      return parsedJson;
    }
    return null;
  } catch (error) {
    console.error('Error parsing intent with Gemini:', error);
    return null;
  }
};

module.exports = { parseIntent };
```

### 3.2. Intent Controller (`controllers/intentController.js`)

The controller receives requests from the frontend, calls the `geminiService`, and then routes the structured data to the appropriate controller (`stakingController` or `lendingController`).

```javascript
// backend/controllers/intentController.js
const geminiService = require('../services/geminiService');
const stakingController = require('./stakingController');
const lendingController = require('./lendingController');
const Transaction = require('../models/Transaction');

const processIntent = async (req, res) => {
    const { intent, userAddress } = req.body;

    // Create the initial transaction record
    const transaction = new Transaction({ raw_intent: intent, userAddress, parsed_intent: {} });

    try {
        const parsedIntent = await geminiService.parseIntent(intent);
        transaction.parsed_intent = parsedIntent;

        if (!parsedIntent || !parsedIntent.action) {
            // Handle cases where Gemini could not parse the intent
            // ... (save transaction as failed)
        }
        
        // Route to the appropriate controller
        switch (parsedIntent.action) {
            case 'stake':
                result = await stakingController.stake(transaction);
                break;
            case 'borrow':
                result = await lendingController.borrow(transaction);
                break;
            // ... (default case)
        }
        res.status(200).json(result);
    } catch (error) {
        // ... (error handling)
    }
};

module.exports = { processIntent };
```

---

## 4. End-to-End Flow

1.  **Frontend**: A user types "Borrow 2000 USDC against my BTC" into the `IntentInput` component.
2.  **Frontend**: The app sends a `POST` request to the backend's `/api/intent/process` endpoint.
3.  **Backend**: The `intentController` receives the request and creates a pending `Transaction` record.
4.  **Backend**: It calls `geminiService.parseIntent()` with the user's text.
5.  **Gemini API**: Processes the prompt and returns a structured JSON string.
6.  **Backend**: The `geminiService` parses the string into an object:
    ```json
    {
      "action": "borrow",
      "amount": 2000,
      "asset": "USDC",
      "collateral": "BTC"
    }
    ```
7.  **Backend**: The `intentController`'s switch statement directs the `transaction` object (now containing the `parsed_intent`) to the `lendingController`, which then executes its logic and updates the transaction's status. 