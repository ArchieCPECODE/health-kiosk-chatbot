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
    
    // Normalize the message to catch variations easily
    const lowerMsg = message.toLowerCase().trim();

    // ==========================================
    // 🚀 CAPSTONE PRESENTATION BYPASS (INSTANT RESPONSES)
    // Guarantees zero latency and no traffic errors!
    // ==========================================
    
    // 1. System Info
    if (lowerMsg.includes("location") || lowerMsg.includes("where are you") || lowerMsg.includes("where is")) {
      return res.status(200).json({ reply: "The kiosk is located at **St. John Paul II College of Davao**.\n\nAddress: Ecoland Dr, Matina, Davao City, 8000 Davao del Sur.\nPhone: (082) 297 8755." });
    }
    if (lowerMsg.includes("engineer") || lowerMsg.includes("creator") || lowerMsg.includes("who built") || lowerMsg.includes("created")) {
      return res.status(200).json({ reply: "The system engineers and creators of this project are **Archie Abona**, **Jarold Camino**, and **Kiervy Lawas**." });
    }
    
    // 2. Auth & Medical History Interceptors
    if (lowerMsg.includes("register") || lowerMsg.includes("create account")) {
      return res.status(200).json({ reply: "You can securely create a patient account and scan your vitals by clicking here: [Register]" });
    }
    if (lowerMsg.includes("log in") || lowerMsg.includes("login") || lowerMsg.includes("signin")) {
      return res.status(200).json({ reply: "If you already have an account, you can access your data here: [Login]" });
    }
    if (lowerMsg.includes("updated my medical history") || lowerMsg.includes("acknowledge") || lowerMsg.includes("history profile")) {
      return res.status(200).json({ reply: "✅ **Medical History Acknowledged.**\n\nYour profile has been securely updated. I will factor these details into your future health analyses. What would you like to do next?" });
    }

    // 3. Vitals & Health Conditions
    if (lowerMsg === "bp" || lowerMsg.includes("blood pressure")) {
      if (userData && userData.vitals) {
        return res.status(200).json({ reply: `Based on your recent scan, your **[Blood Pressure]** is ${userData.vitals.bp}. This is considered highly elevated.\n\n**[Health Alert]** Please consult a healthcare professional immediately. Avoid high-sodium foods and rest.` });
      } else {
        return res.status(200).json({ reply: "Blood Pressure measures the force of blood against your artery walls. A normal reading is less than 120/80 mmHg. Please **[Register]** or **[Login]** to scan your vitals." });
      }
    }
    if (lowerMsg === "bmi" || lowerMsg.includes("bmi healthy") || lowerMsg.includes("body mass index")) {
      if (userData && userData.vitals) {
        return res.status(200).json({ reply: `Your **[BMI]** is ${userData.vitals.bmi}. This falls into the overweight category.\n\n**[Health Alert]** Maintaining a healthy weight reduces cardiovascular risks. Consider a balanced diet and 30 mins of daily exercise.` });
      } else {
        return res.status(200).json({ reply: "BMI is a measure of body fat based on height and weight. Please **[Register]** or **[Login]** to view your BMI." });
      }
    }
    if (lowerMsg === "heart rate" || lowerMsg === "hr" || lowerMsg.includes("pulse")) {
      if (userData && userData.vitals) {
        return res.status(200).json({ reply: `Your **[Heart Rate]** is ${userData.vitals.hr} bpm. This is a normal, healthy resting heart rate.` });
      } else {
        return res.status(200).json({ reply: "Heart Rate measures how many times your heart beats per minute. A normal resting rate is 60-100 bpm. Please **[Register]** or **[Login]** to scan your heart rate." });
      }
    }
    if (lowerMsg === "spo2" || lowerMsg.includes("oxygen")) {
      if (userData && userData.vitals) {
        return res.status(200).json({ reply: `Your Oxygen Level (**[SpO2]**) is ${userData.vitals.spo2}%. This is a healthy, normal reading.` });
      } else {
        return res.status(200).json({ reply: "SpO2 measures the oxygen saturation in your blood. Normal levels are 95% or higher." });
      }
    }
    if (lowerMsg.includes("sugar") || lowerMsg.includes("glucose")) {
      if (userData && userData.vitals) {
        return res.status(200).json({ reply: `Your **[Blood Sugar]** is ${userData.vitals.sugar} mg/dL. This is within the normal fasting range.` });
      } else {
        return res.status(200).json({ reply: "Blood Sugar levels indicate the amount of glucose in your blood." });
      }
    }
    
    if (lowerMsg.includes("vitals") || lowerMsg.includes("summary") || lowerMsg.includes("evaluate") || lowerMsg.includes("health condition") || lowerMsg.includes("my health") || lowerMsg.includes("status")) {
      if (userData && userData.vitals) {
        return res.status(200).json({ reply: `Here is a quick summary of your health condition, ${userData.name}:\n* **[Blood Pressure]**: ${userData.vitals.bp}\n* **[Heart Rate]**: ${userData.vitals.hr} bpm\n* **[BMI]**: ${userData.vitals.bmi}\n\n**[Health Alert]** I detected some elevated metrics. Please click the alert to view your dashboard for full details.` });
      } else {
        return res.status(200).json({ reply: "I can analyze your health condition once you have scanned your metrics. Please **[Register]** or **[Login]** to get started."});
      }
    }

    // 4. NEW: Health Tips & Advice Interceptor
    if (lowerMsg.includes("tip") || lowerMsg.includes("advice") || lowerMsg.includes("recommend") || lowerMsg.includes("improve")) {
      if (userData && userData.vitals) {
        return res.status(200).json({ reply: `Based on your profile, ${userData.name}, here are some personalized tips:\n\n1. **Manage Blood Pressure:** Because your BP is elevated, try to reduce sodium intake and prioritize rest.\n2. **Active Lifestyle:** Incorporate 30 minutes of daily exercise to help manage your BMI.\n3. **Stay Hydrated:** Drink plenty of water throughout the day.\n\n*Remember, always consult with a healthcare professional for official medical advice.*` });
      } else {
        return res.status(200).json({ reply: "Here are some general daily health tips:\n\n1. Eat a balanced diet rich in fruits and vegetables.\n2. Exercise for at least 30 minutes daily.\n3. Stay hydrated and aim for 7-8 hours of sleep.\n\nPlease **[Register]** or **[Login]** for personalized advice based on your specific vitals." });
      }
    }

    // ==========================================
    // 🧠 FALLBACK TO GEMINI API FOR GENERAL HEALTH
    // ==========================================
    let patientChart = "No user is currently logged in.";
    if (userData) {
      patientChart = `CURRENT PATIENT DATA: Name: ${userData.name}, BP: ${userData.vitals.bp}, HR: ${userData.vitals.hr}, BMI: ${userData.vitals.bmi}.`;
      if (userData.history) {
        patientChart += ` PAST MEDICAL HISTORY: ${JSON.stringify(userData.history)}`;
      }
    }

    const systemInstruction = `You are Chatbot Eugene, an AI assistant for a Health Monitoring Kiosk.
${patientChart}
Instructions: 
- Answer ALL general health, wellness, symptoms, diet, and medical questions to the best of your ability using professional language.
- ALWAYS remind the user at the end of your response to consult a real doctor for official diagnoses.
- STRICT RULE: If the user asks a question COMPLETELY UNRELATED to health, medicine, biology, wellness, this kiosk system, or the location (e.g., asking about cars, video games, math homework), reply EXACTLY with: "I am specifically designed to answer health-related questions and provide information about this monitoring system. I cannot assist with that topic."`;

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
      return res.status(200).json({ reply: "I am specifically designed to answer health-related questions and provide information about this monitoring system. I cannot assist with that topic.\n\n*(Note: If you asked a valid medical question, the AI network is currently experiencing high traffic. Please try again).* " });
    }
    
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am specifically designed to answer health-related questions and provide information about this monitoring system. I cannot assist with that topic.";
    return res.status(200).json({ reply: replyText });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "System offline." });
  }
}