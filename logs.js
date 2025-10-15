// ===============================================
// 🧾 Logging Utility (Used by all modules)
// Version: v3.4.2
// ===============================================

export function logMessage(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Optional: appendLog support for Google Sheet logging
export async function appendLog(doc, entry) {
  try {
    const sheet = doc.sheetsByTitle["Logs"];
    if (!sheet) throw new Error("Logs sheet not found");

    await sheet.addRow(entry);
    console.log(`📝 Log added: ${entry.status} - ${entry.message}`);
  } catch (err) {
    console.error("❌ Error writing to Logs sheet:", err.message);
  }
}