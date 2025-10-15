// ===============================================
// 📘 Facebook AutoPost Utility
// Version: v3.4.1
// ===============================================
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * Auto-posts a message to Facebook using Graph API
 * @param {string} message - The post text
 * @returns {Object} { success: boolean, error?: string }
 */
export async function autoPostToFacebook(message) {
  try {
    if (!process.env.FB_PAGE_ID || !process.env.FB_ACCESS_TOKEN) {
      throw new Error("Missing Facebook credentials in environment (.env)");
    }

    const url = `https://graph.facebook.com/${process.env.FB_PAGE_ID}/feed`;
    const params = {
      message,
      access_token: process.env.FB_ACCESS_TOKEN,
    };

    const response = await axios.post(url, null, { params });

    if (response.data.id) {
      console.log(`✅ Posted to Facebook successfully: ${response.data.id}`);
      return { success: true };
    } else {
      throw new Error("Facebook API did not return a post ID.");
    }
  } catch (err) {
    console.error("❌ Facebook posting error:", err.response?.data || err.message);
    return {
      success: false,
      error: err.response?.data?.error?.message || err.message,
    };
  }
}