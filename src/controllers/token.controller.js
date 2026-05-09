import { exchangeCodeForToken } from "../services/token.service.js";

export const tokenController = async (req, res) => {
  try {
    const { code, code_verifier, client_id, redirect_uri } = req.body;

    const tokens = await exchangeCodeForToken({
      code,
      code_verifier,
      client_id,
      redirect_uri,
    });

    res.json({
      access_token: tokens.accessToken,
      id_token: tokens.idToken,
      token_type: "Bearer",
      expires_in: 900,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
