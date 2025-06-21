// To bypass persistent environment variable loading issues in the Next.js dev server,
// we are temporarily hardcoding the API URL. This ensures all components
// receive the exact same, correct value.
export const API_URL = "http://localhost:5000/api"; 