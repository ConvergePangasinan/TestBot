import fs from "fs";

console.log("🔍 Checking version...");
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));
console.log(`🚀 Converge Autopost Bot v${pkg.version}`);