import { findCode, deleteCode } from "../models/code.model.js";
import { verifyPKCE } from "../utils/pkce.js";
import { signToken } from "../utils/jwt.js";

export const exchangeCodeForToken = async ({
  code,
  code_verifier,
  client_id,
  redirect_uri,
}) => {
  const stored = await findCode(code);

  if (!stored) throw new Error("Invalid code");
  if (stored.client_id !== client_id) throw new Error("Client mismatch");
  if (stored.redirect_uri !== redirect_uri) throw new Error("Redirect mismatch");
  if (Date.now() > stored.expiresAt) throw new Error("Code expired");

  const valid = verifyPKCE(code_verifier, stored.code_challenge);
  if (!valid) throw new Error("PKCE verification failed");

  await deleteCode(code);

  const accessToken = signToken({ sub: stored.user_id });
  const idToken = signToken({ sub: stored.user_id });

  return { accessToken, idToken };
};
