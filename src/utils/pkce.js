import crypto from "crypto";

export const verifyPKCE = (codeVerifier, codeChallenge) => {
  const hash = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  return hash === codeChallenge;
};
