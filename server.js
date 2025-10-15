// ===============================================
// 🚀 Converge AutoPost Bot Server
// Version: v3.5.0 (Render + OpenSSL 3 Compatible)
// Author: Edward John Paulo
// ===============================================

// 🧩 Render Fix: Apply OpenSSL legacy provider before imports
if (!process.env.NODE_OPTIONS?.includes('--openssl-legacy-provider')) {
  process.env.NODE_OPTIONS = '--openssl-legacy-provider';
  console.log("⚙️ Applied OpenSSL legacy provider fix for Render");
}

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { scheduleAllTasks } from "./scheduler.js";
import { logMessage } from "./logs.js";

// ===============================================
// ⚙️ Basic Setup
// ===============================================
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ===============================================
// 🔐 Load Google Service Credentials
// ===============================================
let serviceAccount;

try {
  const credsRaw = process.env.GOOGLE_CREDENTIALS?.trim();
  if (!credsRaw) throw new Error("Missing GOOGLE_CREDENTIALS in .env");

  // 🧠 Clean and safely parse JSON (Render safe)
  const cleanCreds = credsRaw
    .replace(/\\n/g, "\\n")
    .replace(/\r/g, "")
    .replace(/^\uFEFF/, "");

  serviceAccount = JSON.parse(cleanCreds);
  logMessage("✅ Loaded GOOGLE_CREDENTIALS from .env");
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
// 📊 Connect to Google Sheet
// ===============================================
async function connectSheet() {
  try {
    const doc = new GoogleSpreadsheet(process.env.SHEET_ID, serviceAuth);
    await doc.loadInfo();
    logMessage(`📄 Connected to Google Sheet: ${doc.title}`);
    return doc;
  } catch (err) {
    logMessage("⚠️ Failed to connect to Google Sheet: " + err.message);
    console.error(err);
  }
}

// Initialize connection and scheduled tasks
connectSheet();
scheduleAllTasks();

// ===============================================
// 🌐 Basic Routes
// ===============================================
app.get("/", (req, res) => {
  res.send("🚀 Converge AutoPost Bot Server running successfully...");
});

// ✅ Optional route to test Google Sheet connection
app.get("/test-credentials", async (req, res) => {
  try {
    const doc = await connectSheet();
    if (doc) {
      res.send(`
        <h3>✅ Google Sheets Connection Successful</h3>
        <p>Connected to: <strong>${doc.title}</strong></p>
      `);
    } else {
      res.status(500).send("<h3>❌ Failed to connect to Google Sheets</h3>");
    }
  } catch (err) {
    res.status(500).send(`<h3>❌ Error: ${err.message}</h3>`);
  }
});

// ===============================================
// 🚀 Start Server
// ===============================================
app.listen(PORT, () => {
  logMessage(`✅ Server running on port ${PORT}`);
});