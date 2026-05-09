import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { API_BASE } from "../config";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("access_token", data.token);
      
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("return_to");
      
      if (returnTo) {
        window.location.href = returnTo;
      } else {
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full bg-[#0f0f0f]/80 backdrop-blur-[40px] border border-white/10 rounded-[20px] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_50px_-12px_rgba(0,0,0,0.6),0_0_80px_-20px_rgba(14,165,233,0.15)] overflow-hidden">
      {/* Top Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600" />
      
      <div className="pt-10 px-9 pb-2 text-center">
        <div className="mx-auto w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_8px_24px_-4px_rgba(14,165,233,0.4)] transition-transform duration-300 hover:rotate-6 hover:scale-105">
          <span className="text-white text-[22px] font-black tracking-[-1px]">AX</span>
        </div>
        <h1 className="text-[#f5f5f5] text-[28px] font-bold tracking-[-0.5px] mb-1.5">Welcome back</h1>
        <p className="text-[#737373] text-[14px] leading-relaxed mb-6">Enter your credentials to access your portal</p>
      </div>

      <div className="px-9 pb-6">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="login-email" className="block text-[#a3a3a3] text-[11px] font-semibold tracking-[0.8px] uppercase">EMAIL</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252] transition-colors group-focus-within:text-cyan-400 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                className="w-full h-[46px] pl-[44px] pr-4 bg-white/5 border border-white/10 rounded-xl text-[#f5f5f5] text-sm outline-none transition-all duration-200 placeholder:text-[#404040] focus:border-cyan-500/50 focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.1)] box-border"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="login-password" className="block text-[#a3a3a3] text-[11px] font-semibold tracking-[0.8px] uppercase">PASSWORD</label>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252] transition-colors group-focus-within:text-cyan-400 pointer-events-none" />
              <input
                id="login-password"
                type="password"
                className="w-full h-[46px] pl-[44px] pr-4 bg-white/5 border border-white/10 rounded-xl text-[#f5f5f5] text-sm outline-none transition-all duration-200 placeholder:text-[#404040] focus:border-cyan-500/50 focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.1)] box-border"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3.5 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[13px] animate-[slideDown_0.3s_ease]">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full h-[46px] mt-1 flex items-center justify-center gap-2 bg-white text-[#0a0a0a] border-none rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-[#e5e5e5] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(255,255,255,0.1)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none group" 
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-[3px]" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="py-5 px-9 text-center border-t border-white/5">
        <p className="text-[#737373] text-[13px] m-0">
          New to Axemoth?{" "}
          <Link 
            to="/signup"
            className="bg-transparent border-none text-[#f5f5f5] font-medium p-0 cursor-pointer no-underline transition-colors hover:text-cyan-400"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
