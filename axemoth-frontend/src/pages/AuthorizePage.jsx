import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Shield, ArrowRight, ShieldCheck, XCircle, Loader2 } from "lucide-react";
import { API_BASE } from "../config";

export default function AuthorizePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");
  const clientId = query.get("client_id");
  const redirectUri = query.get("redirect_uri");
  const scope = query.get("scope") || "openid";
  const codeChallenge = query.get("code_challenge");

  if (!token) return <Navigate to={`/login?return_to=${encodeURIComponent(location.pathname + location.search)}`} />;

  const handleAllow = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/consent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ client_id: clientId, redirect_uri: redirectUri, scope, code_challenge: codeChallenge }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Consent failed");
      window.location.href = data.redirect_uri;
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleDeny = () => { window.location.href = `${redirectUri}?error=access_denied`; };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,#0ea5e9,transparent_70%)] blur-[120px] opacity-20" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,#10b981,transparent_70%)] blur-[120px] opacity-20" />
      </div>
      <div className="relative z-10 w-full max-w-[440px] mx-4 bg-[#0f0f0f]/80 backdrop-blur-[40px] border border-white/10 rounded-[24px] shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center shadow-lg"><ShieldCheck className="w-8 h-8 text-white" /></div>
          <h1 className="text-white text-[24px] font-bold mb-2">Authorize Access</h1>
          <p className="text-[#737373] text-[14px]"><span className="text-cyan-400 font-semibold">{clientId}</span> wants to access your Axemoth account.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
          <p className="text-[#a3a3a3] text-[11px] font-semibold tracking-wider uppercase mb-3">Permissions Requested</p>
          <div className="space-y-3">
            <Perm label="Verify your identity (OpenID)" />
            {scope.includes("email") && <Perm label="Access your email address" />}
            {scope.includes("profile") && <Perm label="Access your profile information" />}
          </div>
        </div>
        {error && <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[13px] mb-6"><XCircle className="w-4 h-4 shrink-0" />{error}</div>}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleDeny} disabled={loading} className="h-[48px] bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-semibold border border-white/10 cursor-pointer disabled:opacity-50">Cancel</button>
          <button onClick={handleAllow} disabled={loading} className="h-[48px] bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-semibold border-none cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Allow <ArrowRight className="w-4 h-4" /></>}</button>
        </div>
        <p className="text-[#525252] text-[12px] text-center mt-8">By allowing, you authorize this application to use your information.</p>
      </div>
    </div>
  );
}

function Perm({ label }) { return (<div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><span className="text-[#e5e5e5] text-[13px] font-medium">{label}</span></div>); }
