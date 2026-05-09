# Axemoth OIDC Identity Provider

![Axemoth](https://img.shields.io/badge/Axemoth-Identity_Provider-0ea5e9?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-22_LTS-339933?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql)

**Axemoth** is a self-hosted **OpenID Connect (OIDC)** Identity Provider and **Single Sign-On (SSO)** platform. It lets you add "Login with Axemoth" to any of your apps — just like how you log in with Google or GitHub across hundreds of websites using a single account.

---

## 🤔 What Problem Does This Solve?

Imagine you're building 3 different apps. Without Axemoth, you would need to build separate login systems in all 3 of them.

With Axemoth, you:
1. Build and host **one** central login system (Axemoth).
2. Register each of your apps as a "client" in the Axemoth dashboard.
3. All 3 of your apps now redirect users to Axemoth to log in — and Axemoth securely sends the user's identity back to your app.

This is exactly how **Sign in with Google** works. Axemoth is your own private version of that.

---

## 🔑 Key Concepts Explained

### What is a `client_id`?
When you register a new application in the Axemoth developer dashboard, Axemoth generates a unique **Client ID** for it. Think of it like a **username for your app** — it tells Axemoth *which application* is requesting to log someone in.

Your app sends its `client_id` to Axemoth when the user clicks "Login", so Axemoth knows which app to trust and which permissions to grant.

**Example:** `client_id = "6f4a1b2c-9d3e-..."`

### What is a `client_secret`?
The `client_secret` is the **password for your app**. It is a long random string that only your application's backend server and Axemoth know. It is never exposed to the user's browser.

Your server sends this secret privately to Axemoth during the **Token Exchange** step (see the flow below) to prove the request is coming from your legitimate server and not an attacker.

> ⚠️ **Never expose this in your frontend code or commit it to GitHub!**

### What is a `redirect_uri`?
The Redirect URI is the **exact URL in your app** where Axemoth sends the user back after they successfully log in.

**Example:** `https://myapp.com/auth/callback`

After the user logs into Axemoth, Axemoth redirects them to this URL and includes a temporary **authorization code** in the URL. Your server then exchanges that code for tokens.

Axemoth only accepts redirect URIs that you pre-register in the dashboard — this prevents attackers from hijacking login flows by using a different URL.

---

## 🔄 How the Login Flow Works (Step by Step)

Here is exactly what happens when a user clicks "Login with Axemoth" on one of your apps:

```
Your App           User's Browser          Axemoth Backend
   |                     |                       |
   |-- (1) Redirect ---->|-- GET /authorize ----->|
   |     with client_id  |   + code_challenge     |
   |     & redirect_uri  |                        |
   |                     |<-- Show Login Page ----|
   |                     |                        |
   |                     |-- User logs in ------->|
   |                     |                        |
   |                     |<-- Redirect to --------|
   |                     |   redirect_uri?code=XYZ|
   |                     |                        |
   |<-- (2) code=XYZ ----|                        |
   |                     |                        |
   |--- (3) POST /token (server-to-server) ------->|
   |      client_id + client_secret + code        |
   |                                              |
   |<-------- (4) access_token + id_token --------|
   |                                              |
   |--- (5) GET /userinfo (using access_token) --->|
   |<-------- (6) { email, name, sub } ------------|
```

1. **Your app redirects the user** to Axemoth's `/authorize` endpoint with its `client_id` and `redirect_uri`.
2. **The user logs in** on Axemoth. Axemoth sends an authorization **code** back to your `redirect_uri`.
3. **Your server** privately sends the code + `client_secret` to Axemoth's `/token` endpoint.
4. **Axemoth verifies everything** and responds with an `access_token` and `id_token`.
5. **Your server calls** `/userinfo` with the access token to get the user's profile.
6. **User is now logged in** to your app!

---

## 🎟️ Token Management

Axemoth issues two types of tokens, both cryptographically signed using **RS256** (asymmetric keys):

### Access Token
- A **short-lived JWT** that proves the user is authenticated.
- Your app includes this in API request headers: `Authorization: Bearer <token>`
- Used to call `/userinfo` to fetch the user's profile.
- Signed with a **private key** that only Axemoth holds.

### ID Token
- Also a JWT, but it directly **contains the user's identity information** (name, email, user ID) inside the token payload itself.
- Your app can decode it without making any extra API calls.
- Third-party apps verify its authenticity using Axemoth's **public key** published at `/.well-known/jwks.json`.

### Why RS256 (Asymmetric Keys)?
- Axemoth **signs** tokens with a private key (kept secret on the server).
- Any third-party app can **verify** the token using Axemoth's public key (published openly).
- This means your apps can verify tokens are genuine **without ever sharing a password with Axemoth**.

---

## 🔒 PKCE — Extra Security for Modern Apps

Axemoth enforces **PKCE** (Proof Key for Code Exchange) — a security mechanism that prevents attackers from stealing the authorization code mid-flight.

Here is how it works:
1. Before redirecting, your app generates a random secret called the `code_verifier`.
2. It hashes it (SHA-256) to produce a `code_challenge` and sends that hash to Axemoth upfront.
3. When exchanging the code for tokens, your app sends the original `code_verifier`.
4. Axemoth hashes it again and checks it matches what was sent in step 2 — **proving you are the same app that started the flow**.

An attacker who intercepts the `code` mid-flight cannot use it because they don't have the `code_verifier`.

---

## 🌐 OIDC Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/.well-known/openid-configuration` | GET | Discovery document — OIDC clients auto-configure from this |
| `/.well-known/jwks.json` | GET | Public keys for verifying token signatures |
| `/authorize` | GET | Start the login flow — redirect users here |
| `/token` | POST | Exchange authorization code for `access_token` + `id_token` |
| `/userinfo` | GET | Fetch the logged-in user's profile using their access token |
| `/auth/signup` | POST | Register a new Axemoth user account |
| `/auth/login` | POST | Log in to the Axemoth dashboard |
| `/clients` | GET/POST | List or register new OAuth client applications |
| `/clients/:id/secret` | PUT | Regenerate a client secret |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v22+
- PostgreSQL database

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/Axemoth/OIDC.git
cd OIDC

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, PRIVATE_KEY, PUBLIC_KEY

# Push database schema
npx drizzle-kit push

# Start the backend
npm run dev
# Runs at http://localhost:5000
```

### 2. Frontend Setup
```bash
cd axemoth-frontend
npm install
cp .env.example .env
# Ensure VITE_API_BASE=http://localhost:5000

npm run dev
# Runs at http://localhost:5173
```

---

## ☁️ Production Deployment

| Component | Platform | Domain |
|---|---|---|
| Backend API | Azure App Service | `api.axemoth.com` |
| Frontend UI | Vercel | `auth.axemoth.com` |

### Required Azure Environment Variables
| Variable | Value |
|---|---|
| `PORT` | `8080` |
| `BASE_URL` | `https://api.axemoth.com` |
| `FRONTEND_URL` | `https://auth.axemoth.com` |
| `DATABASE_URL` | Your PostgreSQL connection string |
| `JWT_SECRET` | A strong random secret |
| `PRIVATE_KEY` | Your RS256 private key |
| `PUBLIC_KEY` | Your RS256 public key |

---

## 🛡️ Security Features

- ✅ **PKCE enforced** on all authorization flows
- ✅ **RS256 asymmetric token signing** — tokens are verifiable without shared secrets
- ✅ **bcrypt password hashing** — passwords are never stored in plain text
- ✅ **CORS protection** — only your configured frontend domain can call the API
- ✅ **Single-use authorization codes** — codes expire and are deleted after use
- ✅ **Secret rotation** — regenerate client secrets instantly from the dashboard

---

*Built with Node.js, Express, React, Drizzle ORM, and PostgreSQL.*
