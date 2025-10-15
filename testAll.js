// ===============================================
// 🧪 TestAll Route Handler (AI-Free)
// Version: v3.3.9
// ===============================================

import fetch from "node-fetch";

export function registerTestRoutes(app, doc, serviceAccountAuth) {
  // 🔹 Route: /test-all
  app.get("/test-all", async (req, res) => {
    const logs = [];
    const timestamp = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });

    logs.push("🚀 Full System Diagnostic Report");
    logs.push(`🕒 PH Local Time: ${timestamp}`);
    logs.push("----------------------------------------");

    // --- Google Sheets Test ---
    try {
      await doc.loadInfo();
      logs.push(`✅ Google Sheets Connected: ${doc.title}`);
    } catch (err) {
      logs.push(`⚠️ Google Sheets Error: ${err.message}`);
    }

    // --- Facebook Test ---
    try {
      const pageId = process.env.FB_PAGE_ID || process.env.PAGE_ID;
      const token = process.env.FB_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_ACCESS_TOKEN;

      if (!pageId || !token) {
        logs.push("⚠️ Facebook credentials missing in .env");
      } else {
        const response = await fetch(`https://graph.facebook.com/${pageId}?access_token=${token}`);
        const data = await response.json();

        if (data.name) {
          logs.push(`✅ Facebook Connected: ${data.name}`);
        } else {
          logs.push(`⚠️ Facebook API Error: ${JSON.stringify(data)}`);
        }
      }
    } catch (err) {
      logs.push(`⚠️ Facebook Error: ${err.message}`);
    }

    // --- Server Health ---
    logs.push("----------------------------------------");
    logs.push("✅ Server Status: Running fine");
    logs.push("✅ AI Services: Disabled (Manual Mode)");

    // --- Response ---
    res.setHeader("Content-Type", "text/html");
    res.send(`
      <h2>✅ Converge AutoPost Bot - TestAll v3.3.9</h2>
      <p>Environment: ${process.env.NODE_ENV || "production"}</p>
      <p>Server Time: ${timestamp}</p>
      <pre>${logs.join("\n")}</pre>
    `);
  });

  // 🔹 Route: /health (for keep-alive ping)
  app.get("/health", (req, res) => {
    res.json({
      status: "healthy",
      version: "v3.3.9",
      environment: process.env.NODE_ENV || "production",
      timestamp: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }),
    });
  });
}