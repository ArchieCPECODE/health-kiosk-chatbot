import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Allow the frontend to talk to this backend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get the API key from Vercel's secret environment variables
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const { message } = req.body;
    
    // We use gemini-1.5-flash as it is the fastest model for chatbots
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // This is the prompt that tells the AI how to act for your Capstone
    const prompt = `
      You are HealthBot, an AI assistant for a Health Monitoring Kiosk.
      The kiosk measures: Blood Pressure (BP), Heart Rate, BMI, Height, Weight, Oxygen Level (SpO2), and Sugar Levels.
      Instructions: 
      - Use professional, medical-grade yet accessible language.
      - Keep responses relatively short and easy to read on a screen.
      - Use **bold** for emphasis.
      - Use bullet points for lists.
      - Never diagnose a user, always advise them to consult a doctor for serious concerns.
      
      The user says: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return res.status(200).json({ reply: response.text() });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch response from AI" });
  }
}