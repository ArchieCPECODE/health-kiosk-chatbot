export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const { message } = req.body;

    const systemInstruction = `You are HealthBot, an AI assistant for a Health Monitoring Kiosk.
The kiosk measures: Blood Pressure (BP), Heart Rate, BMI, Height, Weight, Oxygen Level (SpO2), and Sugar Levels.
Instructions: 
- Use professional, medical-grade yet accessible language.
- Keep responses relatively short and easy to read on a screen.
- Use **bold** for emphasis.
- Use bullet points for lists.
- Never diagnose a user, always advise them to consult a doctor for serious concerns.`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\nUser query: ${message}` }]
        }
      ]
    };

    // FIXED: Switched version to v1 and model to gemini-1.5-flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Google Gemini API Error:", data.error);
      return res.status(400).json({ reply: `⚠️ API Error: ${data.error.message}` });
    }
    
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am having trouble formatting the response. Please try again.";

    return res.status(200).json({ reply: replyText });
  } catch (error) {
    console.error("Server Crash Error:", error);
    return res.status(500).json({ error: "Internal server error occurred." });
  }
}