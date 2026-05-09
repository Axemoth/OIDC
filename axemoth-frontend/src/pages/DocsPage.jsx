import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { API_BASE } from "../config";

export default function DocsPage() {
  const [copiedBlock, setCopiedBlock] = useState(null);
  const copyCode = (code, id) => { navigator.clipboard.writeText(code); setCopiedBlock(id); setTimeout(() => setCopiedBlock(null), 2000); };

  return (
    <div>
      <h1 className="text-white text-[26px] font-bold tracking-tight mb-2">Integration Guide</h1>
      <p className="text-[#737373] text-[13px] mb-8">Follow these steps to add Axemoth SSO to your application.</p>

      <Step n="1" title="Install the OpenID Client">
        <CB id="d1" copied={copiedBlock==="d1"} onCopy={copyCode} code="npm install openid-client" />
      </Step>

      <Step n="2" title="Discover the Issuer">
        <CB id="d2" copied={copiedBlock==="d2"} onCopy={copyCode} code={`import { Issuer } from 'openid-client';\n\nconst axemoth = await Issuer.discover('${API_BASE}');\nconsole.log('Issuer:', axemoth.issuer);`} />
      </Step>

      <Step n="3" title="Create a Client Instance">
        <CB id="d3" copied={copiedBlock==="d3"} onCopy={copyCode} code={`const client = new axemoth.Client({\n  client_id: 'YOUR_CLIENT_ID',\n  client_secret: 'YOUR_CLIENT_SECRET',\n  redirect_uris: ['https://yourapp.com/callback'],\n  response_types: ['code'],\n});`} />
      </Step>

      <Step n="4" title="Generate the Authorization URL">
        <CB id="d4" copied={copiedBlock==="d4"} onCopy={copyCode} code={`import crypto from 'crypto';\n\nconst code_verifier = crypto.randomBytes(32).toString('base64url');\nconst code_challenge = crypto.createHash('sha256').update(code_verifier).digest('base64url');\n\nconst authUrl = client.authorizationUrl({\n  scope: 'openid email',\n  code_challenge,\n  code_challenge_method: 'S256',\n});\n\n// Redirect user to authUrl`} />
      </Step>

      <Step n="5" title="Handle the Callback">
        <CB id="d5" copied={copiedBlock==="d5"} onCopy={copyCode} code={`// In your callback route handler:\nconst params = client.callbackParams(req);\nconst tokenSet = await client.callback(\n  'https://yourapp.com/callback',\n  params,\n  { code_verifier }\n);\n\nconsole.log('Access Token:', tokenSet.access_token);\nconsole.log('ID Token:', tokenSet.id_token);`} />
      </Step>

      <Step n="6" title="Get User Info">
        <CB id="d6" copied={copiedBlock==="d6"} onCopy={copyCode} code={`const userinfo = await client.userinfo(tokenSet.access_token);\nconsole.log('User:', userinfo);\n// { sub: "user_id", email: "user@example.com" }`} />
      </Step>

      <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-xl mt-8">
        <h3 className="text-white text-[16px] font-semibold mb-5">API Endpoints</h3>
        <div className="space-y-2.5">
          <ER method="GET" path="/.well-known/openid-configuration" desc="OIDC Discovery" />
          <ER method="GET" path="/.well-known/jwks.json" desc="Public keys (JWKS)" />
          <ER method="POST" path="/auth/signup" desc="Register user" />
          <ER method="POST" path="/auth/login" desc="Login user" />
          <ER method="GET" path="/authorize" desc="Authorization endpoint" />
          <ER method="POST" path="/token" desc="Token exchange" />
          <ER method="GET" path="/userinfo" desc="User profile" />
          <ER method="GET" path="/clients" desc="List apps" />
          <ER method="POST" path="/clients" desc="Register app" />
        </div>
      </div>
    </div>
  );
}

function Step({ n, title, children }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"><span className="text-cyan-400 text-[12px] font-bold">{n}</span></div>
        <h3 className="text-white text-[17px] font-semibold m-0">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function CB({ id, code, copied, onCopy }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden relative group">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <span className="text-[11px] text-[#525252] font-mono">javascript</span>
        <button onClick={() => onCopy(code, id)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 hover:bg-white/10 text-[#737373] hover:text-white transition-colors border-none cursor-pointer">
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="px-5 py-4 text-[#e5e5e5] text-[13px] leading-[1.7] font-mono whitespace-pre-wrap m-0 overflow-x-auto">{code}</pre>
    </div>
  );
}

function ER({ method, path, desc }) {
  const c = { GET: "text-emerald-400 bg-emerald-400/10", POST: "text-cyan-400 bg-cyan-400/10" };
  return (
    <div className="flex items-center gap-4 py-2">
      <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${c[method]}`}>{method}</span>
      <code className="text-[#e5e5e5] text-[13px] font-mono flex-1">{path}</code>
      <span className="text-[#525252] text-[12px]">{desc}</span>
    </div>
  );
}
