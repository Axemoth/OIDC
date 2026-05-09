import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const loadKey = (envVar, filename) => {
  // 1. Check for Environment Variable
  if (process.env[envVar]) {
    let key = process.env[envVar];
    
    // Handle escaped newlines (Azure sometimes stores \n as literal \\n)
    key = key.replace(/\\n/g, '\n');
    
    // If it looks like a PEM key, normalize and return
    if (key.includes("-----BEGIN")) {
      return key.replace(/\r\n/g, '\n');
    }
    
    // Otherwise, decode from base64 and normalize line endings
    const decoded = Buffer.from(key, 'base64').toString('utf8');
    return decoded.replace(/\r\n/g, '\n');
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
