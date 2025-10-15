// ===============================================
// 📄 Google Sheets Connection
// Version: v3.4.1
// ===============================================
import dotenv from "dotenv";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

dotenv.config();

export async function connectToSheet() {
  try {
    if (!process.env.GOOGLE_CREDENTIALS)
      throw new Error("Missing GOOGLE_CREDENTIALS in environment");

    const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);

    const serviceAccountAuth = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(process.env.SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    console.log("✅ Connected to Google Sheet:", doc.title);
    return doc;
  } catch (err) {
    console.error("❌ Google Sheets connection error:", err.message);
    throw err;
  }
}