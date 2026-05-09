import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, BookOpen, LogOut } from "lucide-react";
import AppsPage from "./AppsPage";
import DocsPage from "./DocsPage";

const NAV_ITEMS = [
  { id: "apps", label: "Applications", icon: LayoutGrid, path: "/dashboard" },
  { id: "docs", label: "Integration", icon: BookOpen, path: "/dashboard/docs" },
];

export default function DashboardLayout({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-[#050505] font-sans flex">
      <aside className="w-[240px] min-h-screen bg-[#0a0a0a] border-r border-white/5 flex flex-col justify-between fixed left-0 top-0 bottom-0 z-20">
        <div>
          <div className="px-5 py-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-[14px] font-black tracking-[-1px]">AX</span>
            </div>
            <div>
              <p className="text-white text-[14px] font-bold tracking-tight">Axemoth</p>
              <p className="text-[#525252] text-[11px]">Identity Provider</p>
            </div>
          </div>
          <nav className="px-3 mt-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.id === 'apps' && location.pathname === '/dashboard');
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 mb-1 border-none cursor-pointer ${
                    isActive
                      ? "bg-white/[0.08] text-white"
                      : "bg-transparent text-[#737373] hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="px-5 pb-6">
          <button
            onClick={() => { onLogout(); navigate("/login"); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200 cursor-pointer shadow-[0_4px_12px_rgba(239,68,68,0.05)] hover:-translate-y-0.5"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-[240px] min-h-screen">
        <div className="fixed inset-0 pointer-events-none ml-[240px]">
          <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,#0ea5e9,transparent_70%)] blur-[150px] opacity-[0.07]" />
          <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,#10b981,transparent_70%)] blur-[150px] opacity-[0.07]" />
        </div>
        <div className="relative z-10 max-w-[900px] mx-auto px-8 py-8">
          <Routes>
            <Route index element={<AppsPage />} />
            <Route path="docs" element={<DocsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
