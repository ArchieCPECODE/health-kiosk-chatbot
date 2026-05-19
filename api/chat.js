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

      if (cleaned.includes(" ")) {
        return text.includes(cleaned);
      }

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
        return `I can show your health summary once you log in and complete a scan.\n\nSteps:\n1. Log in to your account\n2. Open the Dashboard\n3. Check your latest health results`;
      }

      return `Here is your latest health summary, ${userName}:\n\n• Blood Pressure: ${vitals.bp ?? "N/A"}\n• Heart Rate: ${vitals.hr ?? "N/A"} bpm\n• BMI: ${vitals.bmi ?? "N/A"}\n• Oxygen Level: ${vitals.spo2 ?? "N/A"}%\n• Sugar Level: ${vitals.sugar ?? "N/A"} mg/dL\n\nIf any value looks unusual, please consult a healthcare professional.`;
    };

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
        `Hello! I am Chatbot Eugene, your Health Monitoring System assistant.\n\nI can help you understand the project. If you register or log in, I can also analyze your personal vitals and health history.\n\nHow can I assist you today?`
      );
    }

    if (
      matchesAny([
        "alert",
      ])
    ) {
      return reply(
        `Health Alert:\n\nThis may indicate a serious condition that requires medical attention.\n\nPlease take the following steps immediately:\n1. Stop any physical activity and rest\n2. Inform a healthcare professional or clinic staff\n3. Seek medical evaluation as soon as possible\n4. If symptoms are severe or worsening, contact emergency services\n\nThis chatbot can provide guidance, but it cannot replace a licensed medical professional.`
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
        `The kiosk is located at **St. John Paul II College of Davao**.\n\nAddress:\nEcoland Dr, Matina, Davao City, 8000 Davao del Sur\n\nPhone:\n(082) 297 8755`
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
        "team",
        "group members",
        "capstone",
        "project members",
      ])
    ) {
      return reply(
        `The creators of this project are **Archie Abona**, **Jarold Camino**, and **Kiervy Lawas**.\n\nThis is a Health Monitoring System capstone project designed to help users check and track vital health information.`
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
        `To register:\n\n1. Open the registration page\n2. Enter your personal details\n3. Create your account\n4. Log in using your new credentials\n5. Start using the health monitoring features`
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
        `To log in:\n\n1. Open the login page\n2. Enter your username or registered email\n3. Enter your password\n4. Click the login button\n5. You will then be taken to the dashboard`
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
        `Your Medical History section stores your previous health information and scan results.\n\nTo access it:\n1. Log in to your account\n2. Open the Dashboard\n3. Go to Medical History\n4. Select a record to view details\n\nIt may include:\n• Blood Pressure\n• Heart Rate\n• BMI\n• Oxygen Level\n• Sugar Level\n• Height and Weight\n\nIf no records appear, perform a new scan using the kiosk.`
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
        `How to use the Health Monitoring Kiosk:\n\n1. Register or log in to your account\n2. Press the Start Scan button\n3. Follow the on-screen instructions\n4. Place your finger or body part on the required sensor\n5. Wait while the system processes your readings\n6. View your results on the dashboard\n7. Print or save the results if needed\n8. Ask the chatbot for help if you need guidance`
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
        `Website Navigation Guide:\n\n• Dashboard — shows your latest health results\n• Medical History — shows previous records\n• Profile — shows your personal information\n• Settings — lets you adjust preferences\n• Chatbot — lets you ask for help\n\nSteps:\n1. Log in to your account\n2. Use the sidebar or menu buttons\n3. Select the page you need\n4. Return to the Dashboard anytime through the home button`
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
        `To print or save your results:\n\n1. Open your latest health results\n2. Click the Print or Download button\n3. Choose your printer or save option\n4. Confirm the action\n5. Keep a copy for your records`
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
          `Your Blood Pressure reading is **${vitals.bp}**.\n\nBlood pressure measures the force of blood against your artery walls.\nIf your reading seems unusually high or low, please consult a healthcare professional.`
        );
      }

      return reply(
        `Blood Pressure measures the force of blood against your artery walls.\n\nA normal reading is around **120/80 mmHg**.\nPlease log in and complete a scan to view your personal result.`
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
          `Your Heart Rate is **${vitals.hr} bpm**.\n\nHeart rate shows how many times your heart beats per minute.\nIf you feel unwell or your reading is unusual, seek medical advice.`
        );
      }

      return reply(
        `Heart Rate measures how many times your heart beats per minute.\n\nA normal resting range is usually **60 to 100 bpm**.\nPlease log in and complete a scan to view your personal result.`
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
          `Your Oxygen Level (SpO2) is **${vitals.spo2}%**.\n\nSpO2 measures how much oxygen is carried in your blood.\nA healthy level is usually **95% or higher**.`
        );
      }

      return reply(
        `SpO2 measures the oxygen saturation in your blood.\n\nA normal reading is usually **95% or higher**.\nPlease log in and complete a scan to view your personal result.`
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
          `Your Blood Sugar level is **${vitals.sugar} mg/dL**.\n\nBlood sugar shows the amount of glucose in your blood.\nIf this reading is unusual, please consult a healthcare professional.`
        );
      }

      return reply(
        `Blood Sugar levels indicate the amount of glucose in your blood.\n\nPlease log in and complete a scan to view your personal result.`
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
          `Your BMI is **${vitals.bmi}**.\n\nBMI is based on height and weight and helps estimate body fat.\nIf you want, I can also explain how BMI is interpreted.`
        );
      }

      return reply(
        `BMI means Body Mass Index and is based on your height and weight.\n\nPlease log in and complete a scan to view your personal result.`
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
          `Here are some general health tips, ${userName}:\n\n1. Stay hydrated throughout the day\n2. Eat balanced meals with fruits and vegetables\n3. Get enough sleep each night\n4. Exercise regularly\n5. Avoid too much salt and sugary food\n6. Follow your doctor's advice for any abnormal readings\n\nPlease remember that this chatbot provides general guidance only.`
        );
      }

      return reply(
        `Here are some general health tips:\n\n1. Stay hydrated throughout the day\n2. Eat balanced meals with fruits and vegetables\n3. Get enough sleep each night\n4. Exercise regularly\n5. Avoid too much salt and sugary food\n\nPlease log in to receive personalized guidance based on your scan results.`
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
        `I can help you with:\n\n• Logging in and registering\n• Medical history\n• Kiosk usage\n• Dashboard navigation\n• Viewing blood pressure, heart rate, BMI, oxygen level, and sugar level\n• Printing results\n• Understanding your health summary\n\nPlease ask a project-related question.`
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
        `If something is not working:\n\n1. Refresh the page\n2. Check your internet connection\n3. Log in again\n4. Try sending the message again\n5. Contact the project team if the issue continues`
      );
    }

    return reply(
      `This query is not related to the project.\n\nPlease ask about:\n• Health Monitoring System features\n• Medical history\n• Kiosk usage\n• Website navigation\n• Login and registration\n• Blood pressure, heart rate, BMI, oxygen level, or sugar level`
    );
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      error: "System offline.",
    });
  }
}
