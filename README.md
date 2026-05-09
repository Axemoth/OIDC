# Axemoth OIDC Identity Provider

![Axemoth](https://img.shields.io/badge/Axemoth-OIDC_Provider-0ea5e9?style=for-the-badge)

Axemoth is a lightweight, high-performance OpenID Connect (OIDC) compliant Identity Provider and Single Sign-On (SSO) solution. It allows developers to seamlessly integrate secure authentication into any modern web, mobile, or desktop application.

## 🌟 Key Features

- **Full OIDC Compliance**: Implements the standard OIDC flows, providing a `/.well-known/openid-configuration` discovery endpoint.
- **PKCE Support**: Built-in support for Proof Key for Code Exchange (PKCE) to protect against authorization code interception attacks, making it secure for single-page and mobile apps.
- **Asymmetric JWT Signing (RS256)**: Secure token generation using RS256 public/private key pairs with a published JSON Web Key Set (JWKS).
- **Developer Console**: A sleek, dark-themed developer dashboard for registering OAuth applications, generating `client_id` and `client_secret` credentials, and managing redirect URIs.
- **Split Architecture**: Designed for modern cloud deployments:
  - **Backend**: Node.js + Express, utilizing Drizzle ORM and PostgreSQL.
  - **Frontend**: React + Vite, styled beautifully with Tailwind CSS v3 and Geist typography.

## 🏗️ Architecture

The project is split into two main directories:

1. **Backend (`/`)**: 
   The core OAuth 2.0 / OIDC engine. Handles authorization grants, token generation, user authentication, and serves the developer API. 
2. **Frontend (`/axemoth-frontend`)**: 
   The user-facing Identity Provider UI. Contains the login/signup screens, the authorization consent screen, and the developer dashboard.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### 1. Setup the Backend
1. Clone the repository and navigate to the root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in the required variables (including your `DATABASE_URL` and RS256 Key Pair).
4. Push the database schema:
   ```bash
   npx drizzle-kit push
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Setup the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd axemoth-frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` (it should contain `VITE_API_BASE="http://localhost:5000"`).
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🌐 Endpoints

| Endpoint | Description |
|---|---|
| `/.well-known/openid-configuration` | OIDC Discovery Endpoint |
| `/.well-known/jwks.json` | Public JWKS keys for token verification |
| `/authorize` | Authorization endpoint (where users are redirected to login) |
| `/token` | Token endpoint (exchanges auth code for access/id tokens) |
| `/userinfo` | Returns user claims based on the access token |

## 📦 Deployment

The codebase is structured to be deployed efficiently on modern PaaS providers:
- **Backend**: Highly compatible with **Azure App Service**, Heroku, or Render.
- **Frontend**: Pre-configured with a `vercel.json` file for immediate deployment on **Vercel** or Azure Static Web Apps.

## 🛡️ Security

- Never expose your `PRIVATE_KEY` or `JWT_SECRET`.
- Production environments must strictly enforce `HTTPS`.
- Ensure CORS configurations properly lock down access between your frontend and backend domains.

---
*Powered by Node.js, React, and Drizzle ORM.*
