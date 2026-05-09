import crypto from "crypto";
import { saveCode } from "../models/code.model.js";

export const generateAuthCode = async (data) => {
  const code = crypto.randomBytes(32).toString("hex");

  await saveCode({
    code,
    ...data,
    expiresAt: Date.now() + 60000 * 3,
  });

  return code;
};
