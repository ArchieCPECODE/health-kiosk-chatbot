export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const { message, userData } = req.body;

    let patientChart = "No user is currently logged in. Provide general information.";
    if (userData) {
      patientChart = `
      CURRENT PATIENT DATA:
      Name: ${userData.name}
      Blood Pressure: ${userData.vitals.bp}
      Heart Rate: ${userData.vitals.hr} bpm
      BMI: ${userData.vitals.bmi}
      SpO2: ${userData.vitals.spo2}%
      Blood Sugar: ${userData.vitals.sugar} mg/dL
      
      If the user asks about their specific metrics, analyze this data, tell them their condition, and offer professional recommendations.`;
    }

    const systemInstruction = `You are HealthBot, an AI assistant for a Health Monitoring Kiosk.
The system engineers and creators of this project are Archie Abona, Jarold Camino, and Kiervy Lawas.

${patientChart}

Instructions: 
- Use professional, medical-grade yet accessible language.
- Keep responses short. Use **bold** for emphasis.
- STRICT RULE: If the user asks a question NOT related to health, medical metrics, or this kiosk, reply EXACTLY with: "I am specifically designed to answer health-related questions and provide information about this monitoring system. I cannot assist with that topic."
- MAGIC ROUTING RULE: To create a clickable link to the user's dashboard, wrap the metric name in brackets (e.g., [Blood Pressure], [Heart Rate], [BMI]). 
- REGISTRATION RULE: If the user asks how to register or create an account, briefly explain that they can do so securely via the app and include the exact text [Register] to create a clickable link for them.
- HEALTH ALERT RULE: If the provided patient data has abnormal metrics (e.g., high BP, high BMI), proactively include the exact text [Health Alert] in your response to create a clickable warning link, tell them their specific condition, and provide actionable health advice.`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: `${systemInstruction}\n\nUser query: ${message}` }] }]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: "I am specifically designed to answer health-related questions. (Note: The network is currently busy, please try again in a moment)." });
    }
    
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I cannot assist with that topic at this time.";

    return res.status(200).json({ reply: replyText });
  } catch (error) {
    return res.status(500).json({ error: "System offline." });
  }
}