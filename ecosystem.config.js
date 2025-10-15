// ===============================================
// 🌐 PM2 / Render Ecosystem Configuration
// ===============================================
export default {
  apps: [
    {
      name: "converge-autopost-server",
      script: "server.js",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    },
    {
      name: "converge-autopost-tester",
      script: "testAll.js",
      watch: false
    }
  ]
};