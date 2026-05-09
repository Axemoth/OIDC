import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardLayout from "./pages/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import AuthorizePage from "./pages/AuthorizePage";

function Navigation() {
  const location = useLocation();
  const page = location.pathname;

  return (
    <nav className="relative z-20 flex items-center justify-between px-6 py-4 max-w-[1100px] mx-auto">
      <Link to="/" className="flex items-center gap-3 no-underline">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
          <span className="text-white text-[12px] font-black tracking-[-1px]">AX</span>
        </div>
        <span className="text-white text-[15px] font-bold tracking-tight">Axemoth</span>
      </Link>
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors no-underline ${
            page === "/" ? "text-white bg-white/[0.08]" : "text-[#737373] hover:text-white"
          }`}
        >
          Docs
        </Link>
        <Link
          to="/login"
          className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors no-underline ${
            page === "/login" ? "text-white bg-white/[0.08]" : "text-[#737373] hover:text-white"
          }`}
        >
          Sign in
        </Link>
        <Link
          to="/signup"
          className="px-4 py-1.5 text-[13px] font-semibold rounded-md bg-cyan-500 hover:bg-cyan-600 text-white no-underline transition-colors"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

function PublicLayout({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,#0ea5e9,transparent_70%)] blur-[120px] opacity-30 animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,#10b981,transparent_70%)] blur-[120px] opacity-30 animate-[float_8s_ease-in-out_infinite_reverse]" />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <Navigation />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access_token"));

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : (
              <PublicLayout>
                <LandingPage />
              </PublicLayout>
            )
          } 
        />
        <Route path="/authorize" element={<AuthorizePage />} />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : (
              <PublicLayout>
                <div className="flex items-center justify-center min-h-[calc(100vh-72px)]">
                  <div className="w-full max-w-[420px] mx-4">
                    <LoginPage onLoginSuccess={handleLoginSuccess} />
                  </div>
                </div>
              </PublicLayout>
            )
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : (
              <PublicLayout>
                <div className="flex items-center justify-center min-h-[calc(100vh-72px)]">
                  <div className="w-full max-w-[420px] mx-4">
                    <SignupPage />
                  </div>
                </div>
              </PublicLayout>
            )
          } 
        />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard/*" 
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
