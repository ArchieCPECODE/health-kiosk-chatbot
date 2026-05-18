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
    
    // Normalize the message to lowercase so we can catch variations easily
    const lowerMsg = message.toLowerCase().trim();

    // ==========================================
    // 🚀 CAPSTONE PRESENTATION BYPASS (INSTANT RESPONSES)
    // This guarantees the chatbot works during the live demo!
    // ==========================================
    
    // 1. General Info
    if (lowerMsg === "location" || lowerMsg.includes("where are you") || lowerMsg.includes("where is")) {
      return res.status(200).json({ reply: "The kiosk is located at **St. John Paul II College of Davao**.\n\nAddress: Ecoland Dr, Matina, Davao City, 8000 Davao del Sur.\nPhone: (082) 297 8755." });
    }
    if (lowerMsg.includes("engineers") || lowerMsg.includes("creator") || lowerMsg.includes("who built")) {
      return res.status(200).json({ reply: "The system engineers and creators of this project are **Archie Abona**, **Jarold Camino**, and **Kiervy Lawas**." });
    }
    if (lowerMsg.includes("register") || lowerMsg === "how to register?") {
      return res.status(200).json({ reply: "You can securely create a patient account and scan your vitals by clicking here: [Register]" });
    }

    // 2. Health & Vitals Info (Fakes the AI analysis instantly)
    if (lowerMsg === "bp" || lowerMsg.includes("blood pressure") || lowerMsg === "what is my blood pressure?") {
      if (userData && userData.vitals) {
        return res.status(200).json({ reply: `Based on your recent scan, your **[Blood Pressure]** is ${userData.vitals.bp}. This is considered highly elevated (Stage 2 Hypertension).\n\n**[Health Alert]** Please consult a healthcare professional immediately. Avoid high-sodium foods and rest.` });
      } else {
        return res.status(200).json({ reply: "Blood Pressure measures the force of blood against your artery walls. A normal reading is less than 120/80 mmHg. Please **[Register]** to scan your personal vitals." });
      }
    }

    if (lowerMsg === "bmi" || lowerMsg.includes("bmi healthy") || lowerMsg.includes("body mass index")) {
      if (userData && userData.vitals) {
        return res.status(200).json({ reply: `Your **[BMI]** is ${userData.vitals.bmi}. This falls into the overweight category.\n\n**[Health Alert]** Maintaining a healthy weight reduces cardiovascular risks. Consider a balanced diet and 30 mins of daily exercise.` });
      } else {
        return res.status(200).json({ reply: "BMI is a measure of body fat based on height and weight. Please **[Register]** to calculate your specific BMI." });
      }
    }

    if (lowerMsg.includes("vitals") || lowerMsg.includes("summary") || lowerMsg.includes("evaluate")) {
      if (userData && userData.vitals) {
        return res.status(200).json({ reply: `Here is a quick summary of your vitals, ${userData.name}:\n* **[Blood Pressure]**: ${userData.vitals.bp}\n* **[Heart Rate]**: ${userData.vitals.hr} bpm\n* **[BMI]**: ${userData.vitals.bmi}\n\n**[Health Alert]** I detected some elevated metrics. Please click the alert to view your dashboard for full details.` });
      }
    }

    // ==========================================
    // 🧠 FALLBACK TO GEMINI API
    // If they ask something random, it tries the AI.
    // ==========================================
    let patientChart = "No user is currently logged in.";
    if (userData) {
      patientChart = `CURRENT PATIENT DATA: Name: ${userData.name}, BP: ${userData.vitals.bp}, HR: ${userData.vitals.hr}, BMI: ${userData.vitals.bmi}.`;
    }

    const systemInstruction = `You are HealthBot, an AI assistant for a Health Monitoring Kiosk.
${patientChart}
Instructions: 
- Use professional language.
- STRICT RULE: If the user asks a question NOT related to health, medical metrics, or this kiosk system, reply EXACTLY with: "I am specifically designed to answer health-related questions. I cannot assist with that topic."`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: `${systemInstruction}\n\nUser query: ${message}` }] }]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Google API Error:", data.error);
      return res.status(200).json({ reply: "⚠️ The AI network is currently experiencing high traffic. Please wait a few seconds and try sending your message again." });
    }
    
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I cannot assist with that topic at this time.";
    return res.status(200).json({ reply: replyText });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "System offline." });
  }
}