import sharp from "sharp";
import toIco from "to-ico";
import { existsSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const logoPath = join(root, "public/images/logo.png");
const publicDir = join(root, "public");
if (!existsSync(logoPath)) {
  console.error("Logo not found:", logoPath);
  process.exit(1);
}
const sizes = [
  { name: "favicon-16.png", size: 16 },
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-48.png", size: 48 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-192.png", size: 192 },
  { name: "favicon-512.png", size: 512 },
];
const base = sharp(logoPath).ensureAlpha();
for (const { name, size } of sizes) {
  await base
    .clone()
    .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(join(publicDir, name));
  console.log("Wrote", name);
}
await base
  .clone()
  .resize(32, 32, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png()
  .toFile(join(publicDir, "favicon.png"));
console.log("Wrote favicon.png");
const icoBuffers = await Promise.all(
  [16, 32, 48].map((size) =>
    base
      .clone()
      .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toBuffer()
  )
);
writeFileSync(join(publicDir, "favicon.ico"), await toIco(icoBuffers));
console.log("Wrote favicon.ico");
