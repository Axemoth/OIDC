import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Code2, Copy, Check } from "lucide-react";
import { API_BASE } from "../config";

export default function LandingPage() {
  const [copiedBlock, setCopiedBlock] = useState(null);

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedBlock(id);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  return (
    <div className="max-w-[900px] mx-auto px-6 pb-20">
      {/* Hero */}
      <div className="text-center pt-16 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[12px] font-medium mb-6">
          <Shield className="w-3.5 h-3.5" />
          Open Source OIDC Provider
        </div>
        <h1 className="text-white text-[42px] font-bold tracking-[-1px] leading-[1.1] mb-4">
          Authentication for
          <br />
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">modern applications</span>
        </h1>
        <p className="text-[#737373] text-[16px] leading-relaxed max-w-[500px] mx-auto mb-8">
          Add secure Single Sign-On to your app in minutes. OIDC-compliant, PKCE-ready, and completely free.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/signup"
            className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-[14px] font-semibold transition-all duration-200 no-underline shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 px-6 py-3 bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-xl text-[14px] font-medium transition-all duration-200 no-underline border border-white/10"
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-3 gap-4 mb-16">
        <FeatureCard
          icon={<Shield className="w-5 h-5" />}
          title="PKCE by Default"
          desc="Every authorization flow uses Proof Key for Code Exchange to prevent interception attacks."
        />
        <FeatureCard
          icon={<Zap className="w-5 h-5" />}
          title="5-Minute Setup"
          desc="Register your app, copy the code snippet, and you're done. No complex configuration."
        />
        <FeatureCard
          icon={<Code2 className="w-5 h-5" />}
          title="Any Framework"
          desc="Works with React, Next.js, Express, Django, Rails — any app that speaks OAuth 2.0."
        />
      </div>

      {/* Integration Guide */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-white text-[28px] font-bold tracking-tight mb-2">Integrate in 4 steps</h2>
          <p className="text-[#737373] text-[14px]">Everything you need to add Axemoth SSO to your project.</p>
        </div>

        <Step number="1" title="Register Your Application">
          <p className="text-[#a3a3a3] text-[13px] leading-relaxed mb-4">
            Sign up, go to the <strong className="text-white">Developer Console</strong>, and click <strong className="text-white">Register App</strong>.
            You'll receive a <code className="text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded text-[12px]">client_id</code> and <code className="text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded text-[12px]">client_secret</code>.
          </p>
          <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
            <p className="text-amber-400 text-[12px] m-0">⚠️ Keep your <code className="text-amber-300">client_secret</code> safe. Never expose it in client-side code.</p>
          </div>
        </Step>

        <Step number="2" title="Redirect Users to Axemoth">
          <p className="text-[#a3a3a3] text-[13px] leading-relaxed mb-4">
            When a user clicks <strong className="text-white">"Sign in with Axemoth"</strong>, redirect them to the <code className="text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded text-[12px]">/authorize</code> endpoint with PKCE:
          </p>
          <CodeBlock
            id="s2"
            copied={copiedBlock === "s2"}
            onCopy={copyCode}
            code={`const params = new URLSearchParams({
  client_id: 'YOUR_CLIENT_ID',
  redirect_uri: 'https://yourapp.com/callback',
  scope: 'openid',
  response_type: 'code',
  code_challenge: codeChallenge,
  code_challenge_method: 'S256',
});

window.location.href = '${API_BASE}/authorize?' + params;`}
          />
        </Step>

        <Step number="3" title="Exchange the Code for Tokens">
          <p className="text-[#a3a3a3] text-[13px] leading-relaxed mb-4">
            After the user authenticates, Axemoth redirects back with a <code className="text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded text-[12px]">code</code>. Exchange it on your server:
          </p>
          <CodeBlock
            id="s3"
            copied={copiedBlock === "s3"}
            onCopy={copyCode}
            code={`const response = await fetch('${API_BASE}/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: req.query.code,
    code_verifier: storedVerifier,
    client_id: 'YOUR_CLIENT_ID',
    redirect_uri: 'https://yourapp.com/callback',
  }),
});

const { access_token, id_token } = await response.json();`}
          />
        </Step>

        <Step number="4" title="Fetch User Info">
          <p className="text-[#a3a3a3] text-[13px] leading-relaxed mb-4">
            Use the access token to get the authenticated user's profile:
          </p>
          <CodeBlock
            id="s4"
            copied={copiedBlock === "s4"}
            onCopy={copyCode}
            code={`const user = await fetch('${API_BASE}/userinfo', {
  headers: { 'Authorization': \`Bearer \${access_token}\` },
}).then(r => r.json());

// user = { sub: "user_id", email: "user@example.com" }`}
          />
        </Step>
      </div>

      {/* API Reference */}
      <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-xl mb-16">
        <h3 className="text-white text-[16px] font-semibold mb-5">API Reference</h3>
        <div className="space-y-2.5">
          <EndpointRow method="POST" path="/auth/signup" desc="Register a new user" />
          <EndpointRow method="POST" path="/auth/login" desc="Login and receive JWT" />
          <EndpointRow method="GET" path="/authorize" desc="Start OIDC Authorization Code flow" />
          <EndpointRow method="POST" path="/token" desc="Exchange code for tokens" />
          <EndpointRow method="GET" path="/userinfo" desc="Get authenticated user profile" />
          <EndpointRow method="GET" path="/clients" desc="List your registered apps" />
          <EndpointRow method="POST" path="/clients" desc="Register a new OAuth app" />
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-12 border-t border-white/5">
        <h3 className="text-white text-[22px] font-bold tracking-tight mb-3">Ready to get started?</h3>
        <p className="text-[#737373] text-[14px] mb-6">Create your free account and add SSO to your app in minutes.</p>
        <Link
          to="/signup"
          className="inline-block px-8 py-3 bg-white text-[#0a0a0a] rounded-xl text-[14px] font-semibold no-underline transition-all duration-200 hover:bg-[#e5e5e5] hover:-translate-y-0.5"
        >
          Create Free Account
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200">
      <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
        {icon}
      </div>
      <h3 className="text-white text-[14px] font-semibold mb-1.5">{title}</h3>
      <p className="text-[#737373] text-[12px] leading-relaxed m-0">{desc}</p>
    </div>
  );
}

function Step({ number, title, children }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <span className="text-cyan-400 text-[12px] font-bold">{number}</span>
        </div>
        <h3 className="text-white text-[17px] font-semibold m-0">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function CodeBlock({ id, code, copied, onCopy }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden relative group">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <span className="text-[11px] text-[#525252] font-mono">javascript</span>
        <button
          onClick={() => onCopy(code, id)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 hover:bg-white/10 text-[#737373] hover:text-white transition-colors border-none cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="px-5 py-4 text-[#e5e5e5] text-[13px] leading-[1.7] font-mono whitespace-pre-wrap m-0 overflow-x-auto">{code}</pre>
    </div>
  );
}

function EndpointRow({ method, path, desc }) {
  const colors = {
    GET: "text-emerald-400 bg-emerald-400/10",
    POST: "text-cyan-400 bg-cyan-400/10",
  };
  return (
    <div className="flex items-center gap-4 py-2">
      <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${colors[method]}`}>{method}</span>
      <code className="text-[#e5e5e5] text-[13px] font-mono flex-1">{path}</code>
      <span className="text-[#525252] text-[12px] hidden sm:inline">{desc}</span>
    </div>
  );
}
