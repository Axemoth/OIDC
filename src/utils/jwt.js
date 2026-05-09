import jsonwebtoken from "jsonwebtoken";
import { privateKey, publicKey } from "../config/keys.js";

export const signToken = (payload) => {
  return jsonwebtoken.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "15m",
  });
};

export const verifyToken = (token) => {
  return jsonwebtoken.verify(token, publicKey, {
    algorithms: ["RS256"],
  });
};
