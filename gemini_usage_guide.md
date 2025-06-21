# Gemini API Usage Guide for Satsfi

## 1. Introduction

This document provides a guide for integrating and using the Google Gemini API within the Satsfi backend. Gemini's primary role is to power the "intent-centric" nature of the application by parsing natural language user input into structured, actionable commands that the system can execute.

**Goal:** Allow users to type commands like *"Maximize yield on 0.5 BTC"* or *"Borrow 2000 USDC without selling BTC"*, and have the backend understand and act on these instructions.

We will use the `@google/genai` SDK with a free API key for this functionality.

---

## 2. Backend Setup & Installation

The entire Gemini integration will live within the Express.js backend.

### 2.1. Install the SDK

Navigate to the `backend` directory and install the Google Gen AI SDK.

```bash
cd backend
npm install @google/genai
```
*Source: [Install Google Gen AI SDK via npm](https://github.com/googleapis/js-genai/blob/main/README.md#_snippet_1)*

### 2.2. Get Your API Key

1.  Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to generate a free API key.
2.  Add this key to your `backend/.env` file. This key must be kept secret and should never be exposed on the frontend.

```
# backend/.env
# ... other keys
GEMINI_API_KEY=your-gemini-api-key
```
*As seen in `instructions.md`.*

---

## 3. Backend Integration

We will create a dedicated service to handle all interactions with the Gemini API.

### 3.1. Gemini Service (`services/geminiService.ts`)

This service will initialize the Gemini client and contain the core logic for parsing user intents.

```typescript
// backend/services/geminiService.ts
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY!);

// We use a "flash" model for speed and cost-effectiveness, ideal for this use case.
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Define the structure we want Gemini to return
interface ParsedIntent {
  intent: 'STAKE_YIELD' | 'BORROW_STABLE' | 'UNKNOWN';
  amount: number | null;
  asset: string | null;
  collateral?: string | null;
}

/**
 * Parses a user's natural language input into a structured intent object.
 * @param userInput The raw text from the user (e.g., "Maximize yield on 0.5 BTC").
 * @returns A structured intent object or null if parsing fails.
 */
export const parseIntent = async (userInput: string): Promise<ParsedIntent | null> => {
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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the text to ensure it's valid JSON before parsing
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const parsedJson = JSON.parse(cleanedText);

    // Basic validation to ensure the parsed object has the expected shape
    if (parsedJson.intent && typeof parsedJson.amount !== 'undefined' && parsedJson.asset) {
      return parsedJson as ParsedIntent;
    }

    return null;
  } catch (error) {
    console.error('Error parsing intent with Gemini:', error);
    return null;
  }
};
```
*Source: Adapted from [Quickstart: Generate Content with Google Gen AI SDK](https://github.com/googleapis/js-genai/blob/main/README.md#_snippet_2).*

### 3.2. Intent Controller (`controllers/intentController.ts`)

Create a new controller to handle incoming requests from the frontend, orchestrate the parsing, and then delegate to the appropriate service.

```typescript
// backend/controllers/intentController.ts
import { Request, Response } from 'express';
import { parseIntent } from '../services/geminiService';
// You would import your actual staking and borrowing controllers here
// import { handleStakeRequest } from './stakingController'; 
// import { handleBorrowRequest } from './lendingController';

export const processUserIntent = async (req: Request, res: Response) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: 'User input is required.' });
  }

  const parsedIntent = await parseIntent(userInput);

  if (!parsedIntent || parsedIntent.intent === 'UNKNOWN') {
    return res.status(400).json({ error: 'Could not understand the request. Please try rephrasing.' });
  }

  switch (parsedIntent.intent) {
    case 'STAKE_YIELD':
      // Delegate to the staking controller/service
      // await handleStakeRequest(parsedIntent);
      console.log('Delegating to staking service with:', parsedIntent);
      return res.status(200).json({
        message: `Your ${parsedIntent.amount} ${parsedIntent.asset} is now earning yield.`,
        data: parsedIntent,
      });

    case 'BORROW_STABLE':
      // Delegate to the borrowing controller/service
      // await handleBorrowRequest(parsedIntent);
      console.log('Delegating to borrowing service with:', parsedIntent);
      return res.status(200).json({
        message: `Your loan of ${parsedIntent.amount} ${parsedIntent.asset} has been initiated.`,
        data: parsedIntent,
      });

    default:
      return res.status(400).json({ error: 'Intent not recognized.' });
  }
};
```

### 3.3. Update Routes (`routes/index.ts`)

Finally, add a new route to your main router to handle the intent processing.

```typescript
// backend/routes/index.ts or a new intentRoutes.ts
import { Router } from 'express';
import { processUserIntent } from '../controllers/intentController';

const router = Router();

// ... other routes

router.post('/process-intent', processUserIntent);

export default router;
```

---

## 4. End-to-End Flow

1.  **Frontend**: A user types "Borrow 2000 USDC against my BTC" into the dashboard.
2.  **Frontend**: The app sends a `POST` request to the backend's `/api/process-intent` endpoint with `{ "userInput": "Borrow 2000 USDC against my BTC" }`.
3.  **Backend**: The `intentController` receives the request.
4.  **Backend**: It calls `geminiService.parseIntent()` with the user's text.
5.  **Gemini API**: Processes the prompt and returns a structured JSON string.
6.  **Backend**: The `geminiService` parses the string into a `ParsedIntent` object:
    ```json
    {
      "intent": "BORROW_STABLE",
      "amount": 2000,
      "asset": "USDC",
      "collateral": "BTC"
    }
    ```
7.  **Backend**: The `intentController`'s switch statement directs this structured data to the `handleBorrowRequest` logic, successfully bridging the gap from natural language to a machine-executable action. 