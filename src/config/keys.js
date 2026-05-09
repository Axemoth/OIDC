import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const loadKey = (envVar, filename) => {
  // 1. Check for Environment Variable
  if (process.env[envVar]) {
    // Check if it's base64 encoded (common for Azure/Vercel keys)
    const key = process.env[envVar];
    if (key.includes("-----BEGIN")) {
      return key;
    }
    return Buffer.from(key, 'base64').toString('utf8');
  }

  // 2. Fallback to local file
  try {
    return fs.readFileSync(path.join(process.cwd(), filename), "utf8");
  } catch (err) {
    console.error(`Warning: Key file ${filename} not found and ${envVar} env var is missing.`);
    return null;
  }
};

const privateKey = loadKey("PRIVATE_KEY", "private.key");
const publicKey = loadKey("PUBLIC_KEY", "public.key");

export { privateKey, publicKey };
