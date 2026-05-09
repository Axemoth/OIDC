import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { API_BASE } from "../config";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative w-full bg-[#0f0f0f]/80 backdrop-blur-[40px] border border-white/10 rounded-[20px] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_50px_-12px_rgba(0,0,0,0.6),0_0_80px_-20px_rgba(16,185,129,0.15)] overflow-hidden">
        <div className="pt-10 px-9 pb-4 text-center">
          <div className="mx-auto w-16 h-16 mb-5 bg-emerald-500/15 border border-emerald-500/20 rounded-full flex items-center justify-center animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)]">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-[#f5f5f5] text-[28px] font-bold tracking-[-0.5px] mb-1.5">All set!</h1>
          <p className="text-[#737373] text-[14px] leading-relaxed mb-0">
            Your account has been created successfully.<br />You can now access the portal.
          </p>
        </div>
        <div className="py-5 px-9 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center h-[42px] px-7 bg-white text-[#0a0a0a] border-none rounded-xl text-sm font-semibold no-underline transition-all duration-200 hover:bg-[#e5e5e5] hover:-translate-y-[1px] cursor-pointer"
          >
            Continue to Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-[#0f0f0f]/80 backdrop-blur-[40px] border border-white/10 rounded-[20px] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_50px_-12px_rgba(0,0,0,0.6),0_0_80px_-20px_rgba(16,185,129,0.15)] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />
      
      <div className="pt-10 px-9 pb-2 text-center">
        <div className="mx-auto w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-[0_8px_24px_-4px_rgba(16,185,129,0.4)] transition-transform duration-300 hover:rotate-6 hover:scale-105">
          <span className="text-white text-[22px] font-black tracking-[-1px]">AX</span>
        </div>
        <h1 className="text-[#f5f5f5] text-[28px] font-bold tracking-[-0.5px] mb-1.5">Create account</h1>
        <p className="text-[#737373] text-[14px] leading-relaxed mb-6">Get started with your developer identity</p>
      </div>

      <div className="px-9 pb-6">
        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="signup-email" className="block text-[#a3a3a3] text-[11px] font-semibold tracking-[0.8px] uppercase">EMAIL</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252] transition-colors group-focus-within:text-emerald-400 pointer-events-none" />
              <input id="signup-email" type="email" className="w-full h-[46px] pl-[44px] pr-4 bg-white/5 border border-white/10 rounded-xl text-[#f5f5f5] text-sm outline-none transition-all duration-200 placeholder:text-[#404040] focus:border-emerald-500/50 focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] box-border" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-password" className="block text-[#a3a3a3] text-[11px] font-semibold tracking-[0.8px] uppercase">PASSWORD</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252] transition-colors group-focus-within:text-emerald-400 pointer-events-none" />
              <input id="signup-password" type="password" className="w-full h-[46px] pl-[44px] pr-4 bg-white/5 border border-white/10 rounded-xl text-[#f5f5f5] text-sm outline-none transition-all duration-200 placeholder:text-[#404040] focus:border-emerald-500/50 focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] box-border" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-confirm" className="block text-[#a3a3a3] text-[11px] font-semibold tracking-[0.8px] uppercase">CONFIRM PASSWORD</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252] transition-colors group-focus-within:text-emerald-400 pointer-events-none" />
              <input id="signup-confirm" type="password" className="w-full h-[46px] pl-[44px] pr-4 bg-white/5 border border-white/10 rounded-xl text-[#f5f5f5] text-sm outline-none transition-all duration-200 placeholder:text-[#404040] focus:border-emerald-500/50 focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] box-border" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3.5 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[13px] animate-[slideDown_0.3s_ease]">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" className="w-full h-[46px] mt-1 flex items-center justify-center gap-2 bg-white text-[#0a0a0a] border-none rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-[#e5e5e5] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(255,255,255,0.1)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none group" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Create account</span><ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-[3px]" /></>}
          </button>
        </form>
      </div>

      <div className="py-5 px-9 text-center border-t border-white/5">
        <p className="text-[#737373] text-[13px] m-0">
          Already have an account?{" "}
          <Link to="/login" className="bg-transparent border-none text-[#f5f5f5] font-medium p-0 cursor-pointer no-underline transition-colors hover:text-emerald-400">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
