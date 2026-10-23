import fs from "node:fs";
import path from "node:path";

const dist = path.resolve(process.cwd(), "dist");
const index = path.join(dist, "index.html");
const notFound = path.join(dist, "404.html");

if (!fs.existsSync(index)) {
  throw new Error("dist/index.html not found. Run vite build first.");
}

fs.copyFileSync(index, notFound);
fs.writeFileSync(path.join(dist, ".nojekyll"), "");
console.log("Copied index.html → 404.html and wrote .nojekyll");
