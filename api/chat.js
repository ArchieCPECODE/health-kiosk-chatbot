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
    
    // Normalize the message to make interception easy
    const lowerMsg = message.toLowerCase().trim();

    // ==========================================
    // 🚀 CAPSTONE PRESENTATION BYPASS (INSTANT RESPONSES)
    // This intercepts presentation questions so they NEVER fail.
    // ==========================================
    if (lowerMsg === "location" || lowerMsg.includes("where are you") || lowerMsg.includes("where is")) {
      return res.status(200).json({ reply: "The kiosk is located at **St. John Paul II College of Davao**.\n\nAddress: Ecoland Dr, Matina, Davao City, 8000 Davao del Sur.\nPhone: (082) 297 8755." });
    }
    
    if (lowerMsg.includes("engineers") || lowerMsg.includes("creator") || lowerMsg.includes("who built")) {
      return res.status(200).json({ reply: "The system engineers and creators of this project are **Archie Abona**, **Jarold Camino**, and **Kiervy Lawas**." });
    }
    
    if (lowerMsg.includes("register") || lowerMsg === "how to register?") {
      return res.status(200).json({ reply: "You can securely create a patient account and scan your vitals by clicking here: [Register]" });
    }

    // ==========================================
    // 🧠 DYNAMIC AI FOR HEALTH ANALYSIS
    // ==========================================
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
      
      Analyze this data if they ask about their vitals.`;
    }

    const systemInstruction = `You are HealthBot, an AI assistant for a Health Monitoring Kiosk.
${patientChart}
Instructions: 
- Use professional, medical-grade yet accessible language. Keep responses short.
- STRICT RULE: If the user asks a question NOT related to health, medical metrics, or this kiosk system, reply EXACTLY with: "I am specifically designed to answer health-related questions. I cannot assist with that topic."
- MAGIC ROUTING RULE: To create a clickable link to the user's dashboard, wrap the metric name in brackets (e.g., [Blood Pressure], [Heart Rate]). 
- HEALTH ALERT RULE: If the provided patient data has abnormal metrics, proactively include [Health Alert] in your response to create a warning link, tell them their specific condition, and provide actionable health advice.`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: `${systemInstruction}\n\nUser query: ${message}` }] }]
    };

    // FIXED: Reverted to the stable, official production model endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    );

    const data = await response.json();

    // Log actual errors to Vercel console for backend debugging
    if (data.error) {
      console.error("Google API Error Details:", data.error);
      return res.status(200).json({ reply: "⚠️ The AI network is currently experiencing high traffic. Please wait a few seconds and try sending your message again." });
    }
    
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I cannot assist with that topic at this time.";

    return res.status(200).json({ reply: replyText });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "System offline." });
  }
}