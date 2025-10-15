// ===============================================
// 🔁 Keep-Alive Ping Script for Render
// Version: v3.3.9
// ===============================================

import fetch from "node-fetch";

const url = process.env.PING_URL || "https://your-app-name.onrender.com";
console.log(`🔁 Starting keep-alive ping to ${url}`);

setInterval(async () => {
  try {
    const res = await fetch(url + "/test-all");
    console.log("✅ Keep-alive ping successful:", await res.text());
  } catch (err) {
    console.error("⚠️ Ping failed:", err.message);
  }
}, 10 * 60 * 1000); // every 10 minutes