export default async function handler(req, res) {
  // Handle CORS preflight requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const { message } = req.body;

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

    // Direct REST API call to Gemini 1.5 Flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    // Safely extract the text response text
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble processing that request right now. Please try again.";

    return res.status(200).json({ reply: replyText });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch response from AI" });
  }
}