const fs = require("fs");
const path = require("path");

const root = process.cwd();
const dist = path.join(root, "dist");

const entriesToCopy = [
  "index.html",
  "case-study-cf.html",
  "case-study-regal.html",
  "case-study-websites.html",
  "case-study-dashboard.html",
  "portfolio-details.html",
  "service-details.html",
  "starter-page.html",
  "resume.txt",
  "assets"
];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const entry of entriesToCopy) {
  const source = path.join(root, entry);
  const target = path.join(dist, entry);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing required file or folder: ${entry}`);
  }

  fs.cpSync(source, target, { recursive: true });
}

fs.accessSync(path.join(root, "api", "contact.js"));

console.log("Static Vercel build ready: dist");
