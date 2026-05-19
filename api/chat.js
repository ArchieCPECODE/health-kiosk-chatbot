export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    let body = req.body || {};

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const message = typeof body.message === "string" ? body.message : "";
    const userData = body.userData || null;

    const normalizeMessage = (text) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ");

    const normalized = normalizeMessage(message);

    const escapeRegExp = (value) =>
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const keywordMatches = (text, keyword) => {
      const cleaned = normalizeMessage(keyword);

      if (!cleaned) return false;

      // Multi-word phrases: exact phrase match after normalization
      if (cleaned.includes(" ")) {
        return text.includes(cleaned);
      }

      // Single words / short acronyms: whole-word match only
      const pattern = new RegExp(`\\b${escapeRegExp(cleaned)}\\b`, "i");
      return pattern.test(text);
    };

    const matchesAny = (keywords) =>
      keywords.some((keyword) => keywordMatches(normalized, keyword));

    const userName = userData?.name || "Patient";
    const vitals = userData?.vitals || null;

    const reply = (text) => res.status(200).json({ reply: text });

    const getVitalsSummary = () => {
      if (!vitals) {
        return `I can show your health summary once you log in and complete a scan.

Steps:
1. Log in to your account
2. Open the Dashboard
3. Check your latest health results`;
      }

      return `Here is your latest health summary, ${userName}:

• Blood Pressure: ${vitals.bp ?? "N/A"}
• Heart Rate: ${vitals.hr ?? "N/A"} bpm
• BMI: ${vitals.bmi ?? "N/A"}
• Oxygen Level: ${vitals.spo2 ?? "N/A"}%
• Sugar Level: ${vitals.sugar ?? "N/A"} mg/dL

If any value looks unusual, please consult a healthcare professional.`;
    };

    // -----------------------------
    // PROJECT / SYSTEM INTENTS
    // -----------------------------

    if (
      matchesAny([
        "hello",
        "hi",
        "hey",
        "good morning",
        "good afternoon",
        "good evening",
        "who are you",
        "what are you",
        "chatbot",
        "assistant",
        "ai assistant",
      ])
    ) {
      return reply(
        `Hello! I am Chatbot Eugene, your Health Monitoring System assistant.

I can help you with:
• Login and registration
• Medical history
• Dashboard navigation
• Kiosk usage
• Blood pressure, heart rate, BMI, oxygen level, and sugar level
• Printing and viewing results`
      );
    }

    if (
      matchesAny([
        "location",
        "where are you",
        "where is the kiosk",
        "where is this system",
        "project location",
        "address",
        "school location",
      ])
    ) {
      return reply(
        `The kiosk is located at **St. John Paul II College of Davao**.

Address:
Ecoland Dr, Matina, Davao City, 8000 Davao del Sur

Phone:
(082) 297 8755`
      );
    }

    if (
      matchesAny([
        "creator",
        "creators",
        "developer",
        "developers",
        "who made this",
        "who built this",
        "engineer",
        "system engineer",
        "team",
        "group members",
        "capstone",
        "project members",
      ])
    ) {
      return reply(
        `The creators of this project are **Archie Abona**, **Jarold Camino**, and **Kiervy Lawas**.

This is a Health Monitoring System capstone project designed to help users check and track vital health information.`
      );
    }

    if (
      matchesAny([
        "register",
        "registration",
        "create account",
        "sign up",
        "signup",
        "new account",
        "account creation",
      ])
    ) {
      return reply(
        `To register:

1. Open the registration page
2. Enter your personal details
3. Create your account
4. Log in using your new credentials
5. Start using the health monitoring features`
      );
    }

    if (
      matchesAny([
        "login",
        "log in",
        "signin",
        "sign in",
        "access account",
        "authenticate",
        "authentication",
        "password",
        "otp",
      ])
    ) {
      return reply(
        `To log in:

1. Open the login page
2. Enter your username or registered email
3. Enter your password
4. Click the login button
5. You will then be taken to the dashboard`
      );
    }

    if (
      matchesAny([
        "medical history",
        "health history",
        "patient history",
        "medical records",
        "health records",
        "patient records",
        "records",
        "previous scans",
        "past results",
        "saved results",
        "history profile",
        "history",
      ])
    ) {
      return reply(
        `Your Medical History section stores your previous health information and scan results.

To access it:
1. Log in to your account
2. Open the Dashboard
3. Go to Medical History
4. Select a record to view details

It may include:
• Blood Pressure
• Heart Rate
• BMI
• Oxygen Level
• Sugar Level
• Height and Weight

If no records appear, perform a new scan using the kiosk.`
      );
    }

    if (
      matchesAny([
        "how to use kiosk",
        "use the kiosk",
        "kiosk guide",
        "how does the kiosk work",
        "how do i use the kiosk",
        "kiosk usage",
        "health kiosk",
        "use kiosk",
        "scan health",
        "health monitoring",
        "measurement",
        "measurements",
        "scan",
        "start scan",
      ])
    ) {
      return reply(
        `How to use the Health Monitoring Kiosk:

1. Register or log in to your account
2. Press the Start Scan button
3. Follow the on-screen instructions
4. Place your finger or body part on the required sensor
5. Wait while the system processes your readings
6. View your results on the dashboard
7. Print or save the results if needed
8. Ask the chatbot for help if you need guidance`
      );
    }

    if (
      matchesAny([
        "dashboard",
        "home",
        "homepage",
        "main page",
        "navigation",
        "navigate",
        "menu",
        "sidebar",
        "profile",
        "settings",
        "where is",
        "website navigation",
        "how to navigate",
        "how to use website",
      ])
    ) {
      return reply(
        `Website Navigation Guide:

• Dashboard — shows your latest health results
• Medical History — shows previous records
• Profile — shows your personal information
• Settings — lets you adjust preferences
• Chatbot — lets you ask for help

Steps:
1. Log in to your account
2. Use the sidebar or menu buttons
3. Select the page you need
4. Return to the Dashboard anytime through the home button`
      );
    }

    if (
      matchesAny([
        "print",
        "printing",
        "print results",
        "print report",
        "medical report",
        "health report",
        "generate report",
        "save report",
        "download",
      ])
    ) {
      return reply(
        `To print or save your results:

1. Open your latest health results
2. Click the Print or Download button
3. Choose your printer or save option
4. Confirm the action
5. Keep a copy for your records`
      );
    }

    if (
      matchesAny([
        "blood pressure",
        "bp",
        "hypertension",
        "pressure",
        "systolic",
        "diastolic",
        "high blood",
        "low blood",
      ])
    ) {
      if (vitals?.bp) {
        return reply(
          `Your Blood Pressure reading is **${vitals.bp}**.

Blood pressure measures the force of blood against your artery walls.
If your reading seems unusually high or low, please consult a healthcare professional.`
        );
      }

      return reply(
        `Blood Pressure measures the force of blood against your artery walls.

A normal reading is around **120/80 mmHg**.
Please log in and complete a scan to view your personal result.`
      );
    }

    if (
      matchesAny([
        "heart rate",
        "pulse",
        "heartbeat",
        "bpm",
        "hr",
        "pulse rate",
      ])
    ) {
      if (vitals?.hr) {
        return reply(
          `Your Heart Rate is **${vitals.hr} bpm**.

Heart rate shows how many times your heart beats per minute.
If you feel unwell or your reading is unusual, seek medical advice.`
        );
      }

      return reply(
        `Heart Rate measures how many times your heart beats per minute.

A normal resting range is usually **60 to 100 bpm**.
Please log in and complete a scan to view your personal result.`
      );
    }

    if (
      matchesAny([
        "oxygen",
        "oxygen level",
        "spo2",
        "oxygen saturation",
        "pulse oximeter",
      ])
    ) {
      if (vitals?.spo2) {
        return reply(
          `Your Oxygen Level (SpO2) is **${vitals.spo2}%**.

SpO2 measures how much oxygen is carried in your blood.
A healthy level is usually **95% or higher**.`
        );
      }

      return reply(
        `SpO2 measures the oxygen saturation in your blood.

A normal reading is usually **95% or higher**.
Please log in and complete a scan to view your personal result.`
      );
    }

    if (
      matchesAny([
        "sugar",
        "blood sugar",
        "glucose",
        "sugar level",
        "glucose level",
        "diabetes",
      ])
    ) {
      if (vitals?.sugar) {
        return reply(
          `Your Blood Sugar level is **${vitals.sugar} mg/dL**.

Blood sugar shows the amount of glucose in your blood.
If this reading is unusual, please consult a healthcare professional.`
        );
      }

      return reply(
        `Blood Sugar levels indicate the amount of glucose in your blood.

Please log in and complete a scan to view your personal result.`
      );
    }

    if (
      matchesAny([
        "bmi",
        "body mass index",
        "weight",
        "height",
        "body weight",
        "body measurement",
      ])
    ) {
      if (vitals?.bmi) {
        return reply(
          `Your BMI is **${vitals.bmi}**.

BMI is based on height and weight and helps estimate body fat.
If you want, I can also explain how BMI is interpreted.`
        );
      }

      return reply(
        `BMI means Body Mass Index and is based on your height and weight.

Please log in and complete a scan to view your personal result.`
      );
    }

    if (
      matchesAny([
        "vitals",
        "summary",
        "evaluate",
        "health condition",
        "my health",
        "status",
        "check my health",
        "health summary",
      ])
    ) {
      return reply(getVitalsSummary());
    }

    if (
      matchesAny([
        "tip",
        "advice",
        "recommend",
        "recommendation",
        "improve",
        "health tips",
        "wellness tips",
        "daily tips",
      ])
    ) {
      if (vitals) {
        return reply(
          `Here are some general health tips, ${userName}:

1. Stay hydrated throughout the day
2. Eat balanced meals with fruits and vegetables
3. Get enough sleep each night
4. Exercise regularly
5. Avoid too much salt and sugary food
6. Follow your doctor's advice for any abnormal readings

Please remember that this chatbot provides general guidance only.`
        );
      }

      return reply(
        `Here are some general health tips:

1. Stay hydrated throughout the day
2. Eat balanced meals with fruits and vegetables
3. Get enough sleep each night
4. Exercise regularly
5. Avoid too much salt and sugary food

Please log in to receive personalized guidance based on your scan results.`
      );
    }

    if (
      matchesAny([
        "help",
        "guide",
        "assist",
        "assistance",
        "instructions",
        "what can you do",
        "how can you help",
      ])
    ) {
      return reply(
        `I can help you with:

• Logging in and registering
• Medical history
• Kiosk usage
• Dashboard navigation
• Viewing blood pressure, heart rate, BMI, oxygen level, and sugar level
• Printing results
• Understanding your health summary

Please ask a project-related question.`
      );
    }

    if (
      matchesAny([
        "error",
        "problem",
        "bug",
        "issue",
        "not working",
        "failed",
        "connection",
        "server error",
      ])
    ) {
      return reply(
        `If something is not working:

1. Refresh the page
2. Check your internet connection
3. Log in again
4. Try sending the message again
5. Contact the project team if the issue continues`
      );
    }

    // -----------------------------
    // STRICT PROJECT FALLBACK
    // -----------------------------
    return reply(
      `This query is not related to the project.

Please ask about:
• Health Monitoring System features
• Medical history
• Kiosk usage
• Website navigation
• Login and registration
• Blood pressure, heart rate, BMI, oxygen level, or sugar level`
    );
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      error: "System offline.",
    });
  }
}