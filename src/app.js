import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { signToken, verifyToken } from "./utils/jwt.js";
import authRoutes from "./routes/auth.routes.js";
import oauthRoutes from "./routes/oauth.routes.js";
import tokenRoutes from "./routes/token.routes.js";
import userRoutes from "./routes/user.routes.js";
import clientRoutes from "./routes/client.routes.js";
import { getJwks } from "./utils/jwks.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // In production, use FRONTEND_URL env var
    const allowedOrigin = process.env.FRONTEND_URL;
    if (allowedOrigin && origin === allowedOrigin) return callback(null, true);
    // In development, allow any localhost port
    if (origin.match(/^http:\/\/localhost:\d+$/)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// Test route
app.get("/", (req, res) => {
  res.send("Axemoth Auth Server Running 🚀");
});

// OIDC Discovery
app.get("/.well-known/openid-configuration", (req, res) => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
  res.json({
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/authorize`,
    token_endpoint: `${baseUrl}/token`,
    userinfo_endpoint: `${baseUrl}/userinfo`,
    jwks_uri: `${baseUrl}/.well-known/jwks.json`,
    response_types_supported: ["code"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    scopes_supported: ["openid", "profile", "email"],
    token_endpoint_auth_methods_supported: ["client_secret_post", "client_secret_basic"],
    claims_supported: ["sub", "iss", "auth_time", "name", "email"],
    code_challenge_methods_supported: ["S256"]
  });
});

app.get("/.well-known/jwks.json", (req, res) => {
  res.json(getJwks());
});

app.get("/test-jwt", (req, res) => {
  const token = signToken({ sub: "123", email: "test@test.com" });
  const decoded = verifyToken(token);
  res.json({
    token,
    decoded,
  });
});

app.get("/test", (req, res) => {
  res.send(`Code received: ${req.query.code}`);
});

app.use("/auth", authRoutes);
app.use("/", oauthRoutes);
app.use("/", tokenRoutes);
app.use("/", userRoutes);
app.use("/", clientRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
