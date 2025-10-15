// ===============================================
// 🕓 Scheduler - Converge AutoPost Bot
// Version: v3.5.0 (Stable + Safe JSON Parsing)
// Author: Edward John Paulo
// ===============================================

import cron from "node-cron";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { appendLog, logMessage } from "./logs.js";

const SHEET_ID = process.env.SHEET_ID;

// ===============================================
// 🔐 Load & Parse Google Service Credentials
// ===============================================
let serviceAccount;

try {
  const credsRaw = process.env.GOOGLE_CREDENTIALS?.trim();
  if (!credsRaw) throw new Error("Missing GOOGLE_CREDENTIALS in .env");

  // 🧠 Clean and safely parse Render-style JSON
  const cleanCreds = credsRaw
    .replace(/\\n/g, "\\n")   // keep escaped newlines
    .replace(/\r/g, "")       // remove carriage returns
    .replace(/^\uFEFF/, "");  // remove invisible BOM if exists

  serviceAccount = JSON.parse(cleanCreds);
  logMessage("✅ Scheduler loaded GOOGLE_CREDENTIALS successfully");
} catch (err) {
  logMessage("❌ Failed to parse GOOGLE_CREDENTIALS: " + err.message);
  console.error(err);
  process.exit(1);
}

// ===============================================
// 🔑 Google Auth Setup
// ===============================================
const serviceAuth = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// ===============================================
// 📄 Connect to Google Sheet
// ===============================================
let doc;
async function initSheet() {
  try {
    doc = new GoogleSpreadsheet(SHEET_ID, serviceAuth);
    await doc.loadInfo();
    logMessage(`📄 Scheduler connected to Google Sheet: ${doc.title}`);
  } catch (err) {
    logMessage("⚠️ Scheduler failed to connect to Google Sheet");
    console.error(err);
  }
}

// ===============================================
// 🧠 Scheduled Task Function
// ===============================================
async function postScheduledTasks() {
  try {
    if (!doc) await initSheet();

    const sheet = doc.sheetsByTitle["Posts"];
    if (!sheet) {
      logMessage("⚠️ 'Posts' sheet not found in Google Sheets");
      return;
    }

    const rows = await sheet.getRows();
    const pendingRows = rows.filter(
      (r) => (r.Status || "").toString().trim().toLowerCase() === "pending"
    );

    logMessage(`📊 Scheduler found ${pendingRows.length} pending posts`);

    // 📝 Example log entry
    await appendLog(doc, {
      timestamp: new Date().toISOString(),
      status: "Running",
      message: `Scheduler executed — ${pendingRows.length} pending posts checked.`,
    });
  } catch (err) {
    logMessage(`❌ Error running scheduled task: ${err.message}`);
  }
}

// ===============================================
// 🕓 Schedule All Tasks
// ===============================================
export function scheduleAllTasks() {
  initSheet();

  // Runs every 15 minutes
  cron.schedule("*/15 * * * *", async () => {
    logMessage("🕓 Running scheduled post task...");
    await postScheduledTasks();
  });

  logMessage("✅ Scheduler initialized (every 15 minutes)");
}