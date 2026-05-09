import { generateAuthCode } from "../services/oauth.service.js";
import { verifyToken } from "../utils/jwt.js";

export const authorizeController = async (req, res) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const queryString = new URLSearchParams(req.query).toString();
    
    // Redirect the browser to the frontend's authorize page
    // The frontend will handle session check and consent
    return res.redirect(`${frontendUrl}/authorize?${queryString}`);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const consentController = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const userId = decoded.sub;

    const {
      client_id,
      redirect_uri,
      scope,
      code_challenge,
    } = req.body;

    // TODO: Validate client_id and redirect_uri against DB

    const code = await generateAuthCode({
      client_id,
      redirect_uri,
      user_id: userId,
      code_challenge,
      scope: scope || "openid",
    });

    res.json({ redirect_uri: `${redirect_uri}?code=${code}` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
