import { useState, useEffect } from "react";
import { Plus, Key, Link as LinkIcon, Save, ArrowLeft, Terminal, Copy, Check, Eye, EyeOff, Trash2, RefreshCw } from "lucide-react";
import { API_BASE } from "../config";

export default function AppsPage() {
  const [apps, setApps] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newAppName, setNewAppName] = useState("");
  const [newAppRedirectUri, setNewAppRedirectUri] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [showSecret, setShowSecret] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/clients`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { setApps(await res.json()); }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const [toast, setToast] = useState(null);

  const showToastMessage = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateApp = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/clients`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newAppName, redirectUri: newAppRedirectUri }),
      });
      if (res.ok) { 
        const a = await res.json(); 
        setApps([...apps, a]); 
        setSelectedApp(a); 
        setIsCreating(false); 
        setNewAppName(""); 
        setNewAppRedirectUri(""); 
        showToastMessage("New application created successfully");
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteApp = async (cid) => {
    if (!confirm("Delete this application?")) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/clients/${cid}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { setApps(apps.filter(a => a.clientId !== cid)); setSelectedApp(null); }
    } catch (err) { console.error(err); } finally { setIsDeleting(false); }
  };

  const handleRegenerateSecret = async (cid) => {
    if (!confirm("Regenerate secret? Old one will stop working immediately.")) return;
    setIsRegenerating(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/clients/${cid}/secret`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const u = await res.json(); setApps(apps.map(a => a.clientId === cid ? u : a)); setSelectedApp(u); }
    } catch (err) { console.error(err); } finally { setIsRegenerating(false); }
  };

  const copy = (text, field) => { navigator.clipboard.writeText(text); setCopiedField(field); setTimeout(() => setCopiedField(null), 2000); };

  if (selectedApp) return (
    <div>
      <button onClick={() => { setSelectedApp(null); setShowSecret(false); }} className="flex items-center gap-2 text-[#737373] hover:text-white text-[13px] mb-6 transition-colors bg-transparent border-none cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back</button>
      <div className="flex items-center justify-between mb-8"><div><h1 className="text-white text-[26px] font-bold">{selectedApp.name}</h1><p className="text-[#737373] text-[13px] mt-1">Credentials and configuration</p></div><span className="text-[11px] text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 font-medium">Active</span></div>
      <div className="space-y-4">
        <Cred label="Client ID" value={selectedApp.clientId} icon={<Key className="w-4 h-4"/>} copied={copiedField==="cid"} onCopy={()=>copy(selectedApp.clientId,"cid")} />
        <Cred label="Client Secret" value={showSecret?selectedApp.clientSecret:"••••••••••••••••"} icon={<Key className="w-4 h-4"/>} copied={copiedField==="cs"} onCopy={()=>copy(selectedApp.clientSecret,"cs")} extra={<button onClick={()=>setShowSecret(!showSecret)} className="p-1.5 rounded-md hover:bg-white/10 text-[#737373] hover:text-white transition-colors bg-transparent border-none cursor-pointer">{showSecret?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>} />
        <Cred label="Redirect URI" value={selectedApp.redirectUri} icon={<LinkIcon className="w-4 h-4"/>} copied={copiedField==="ru"} onCopy={()=>copy(selectedApp.redirectUri,"ru")} />
      </div>
      <div className="mt-8"><h3 className="text-white text-[15px] font-semibold mb-4">Quick Start</h3>
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 relative group">
          <button onClick={()=>copy(`import { Issuer } from 'openid-client';\nconst issuer = await Issuer.discover('${API_BASE}');\nconst client = new issuer.Client({\n  client_id: '${selectedApp.clientId}',\n  client_secret: '${selectedApp.clientSecret}',\n  redirect_uris: ['${selectedApp.redirectUri}'],\n  response_types: ['code'],\n});`,"snip")} className="absolute top-4 right-4 p-2 rounded-md bg-white/5 hover:bg-white/10 text-[#737373] hover:text-white transition-colors border-none cursor-pointer opacity-0 group-hover:opacity-100">{copiedField==="snip"?<Check className="w-3.5 h-3.5 text-emerald-400"/>:<Copy className="w-3.5 h-3.5"/>}</button>
          <pre className="text-[#e5e5e5] text-[13px] leading-relaxed font-mono whitespace-pre-wrap m-0"><span className="text-cyan-400">import</span>{" { Issuer } "}<span className="text-cyan-400">from</span> <span className="text-emerald-400">'openid-client'</span>;{"\n\n"}<span className="text-cyan-400">const</span> issuer = <span className="text-cyan-400">await</span> Issuer.discover(<span className="text-emerald-400">'{API_BASE}'</span>);{"\n"}<span className="text-cyan-400">const</span> client = <span className="text-cyan-400">new</span> issuer.Client({"{\n"}{"  "}client_id: <span className="text-emerald-400">'{selectedApp.clientId}'</span>,{"\n"}{"  "}client_secret: <span className="text-emerald-400">'{selectedApp.clientSecret}'</span>,{"\n"}{"  "}redirect_uris: [<span className="text-emerald-400">'{selectedApp.redirectUri}'</span>],{"\n"}{"  "}response_types: [<span className="text-emerald-400">'code'</span>],{"\n"}{"}"});</pre>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-white/5"><h3 className="text-red-400 text-[15px] font-semibold mb-4">Danger Zone</h3><div className="flex gap-3">
        <button onClick={()=>handleRegenerateSecret(selectedApp.clientId)} disabled={isRegenerating} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[13px] font-medium border border-white/10 cursor-pointer disabled:opacity-50"><RefreshCw className={`w-4 h-4 ${isRegenerating?'animate-spin':''}`}/> Regenerate Secret</button>
        <button onClick={()=>handleDeleteApp(selectedApp.clientId)} disabled={isDeleting} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-[13px] font-medium border border-red-500/20 cursor-pointer disabled:opacity-50"><Trash2 className="w-4 h-4"/> Delete Application</button>
      </div></div>
      {toast && (
        <div className="fixed bottom-6 right-6 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[13px] font-medium rounded-xl shadow-[0_8px_32px_rgba(16,185,129,0.15)] flex items-center gap-2 animate-[popIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)] z-50 backdrop-blur-md">
          <Check className="w-4 h-4" />
          {toast}
        </div>
      )}
    </div>
  );

  if (isCreating) return (
    <div>
      <button onClick={()=>setIsCreating(false)} className="flex items-center gap-2 text-[#737373] hover:text-white text-[13px] mb-6 transition-colors bg-transparent border-none cursor-pointer"><ArrowLeft className="w-4 h-4"/> Back</button>
      <h1 className="text-white text-[26px] font-bold mb-2">Register New Application</h1>
      <p className="text-[#737373] text-[13px] mb-8">Create a new OAuth client to integrate Axemoth SSO.</p>
      <form onSubmit={handleCreateApp} className="max-w-[460px] space-y-5">
        <div className="space-y-2"><label className="block text-[#a3a3a3] text-[11px] font-semibold tracking-[0.8px] uppercase">Application Name</label><input type="text" className="w-full h-[46px] px-4 bg-white/5 border border-white/10 rounded-xl text-[#f5f5f5] text-sm outline-none placeholder:text-[#404040] focus:border-cyan-500/50 focus:bg-white/10 box-border" placeholder="e.g. My SaaS App" value={newAppName} onChange={e=>setNewAppName(e.target.value)} required/></div>
        <div className="space-y-2"><label className="block text-[#a3a3a3] text-[11px] font-semibold tracking-[0.8px] uppercase">Redirect URI</label><input type="url" className="w-full h-[46px] px-4 bg-white/5 border border-white/10 rounded-xl text-[#f5f5f5] text-sm outline-none placeholder:text-[#404040] focus:border-cyan-500/50 focus:bg-white/10 box-border" placeholder="https://yourapp.com/callback" value={newAppRedirectUri} onChange={e=>setNewAppRedirectUri(e.target.value)} required/></div>
        <button type="submit" className="w-full h-[46px] mt-4 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white border-none rounded-xl text-sm font-semibold shadow-lg shadow-cyan-500/20 cursor-pointer"><Save className="w-4 h-4"/> Register Application</button>
      </form>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8"><div><h1 className="text-white text-[26px] font-bold">Applications</h1><p className="text-[#737373] text-[13px] mt-1">Manage your registered OAuth applications</p></div>
        <button onClick={()=>setIsCreating(true)} className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-[13px] font-semibold shadow-lg shadow-cyan-500/20 border-none cursor-pointer"><Plus className="w-4 h-4"/> Register App</button>
      </div>
      {loading ? <div className="text-center py-16 text-[#525252]">Loading...</div>
      : apps.length===0 ? (
        <div className="text-center py-20 px-4 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
          <Terminal className="w-14 h-14 text-[#333] mx-auto mb-5"/>
          <h3 className="text-[#f5f5f5] text-[17px] font-semibold mb-2">No applications yet</h3>
          <p className="text-[#737373] text-[13px] max-w-[300px] mx-auto mb-6">Register your first application to get your Client ID.</p>
          <button onClick={()=>setIsCreating(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0a0a0a] rounded-lg text-[13px] font-semibold hover:bg-[#e5e5e5] border-none cursor-pointer"><Plus className="w-4 h-4"/> Create your first app</button>
        </div>
      ) : (
        <div className="grid gap-3">{apps.map(app=>(
          <button key={app.id||app.clientId} onClick={()=>setSelectedApp(app)} className="w-full text-left p-5 border border-white/[0.06] rounded-xl bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/10 flex items-center justify-center"><AW className="w-5 h-5 text-cyan-400"/></div><div><h3 className="text-white text-[15px] font-semibold">{app.name}</h3><p className="text-[#525252] text-[12px] font-mono mt-0.5">{app.clientId}</p></div></div>
              <span className="text-[11px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 font-medium">Active</span>
            </div>
          </button>
        ))}</div>
      )}
    </div>
  );
}

function Cred({label,value,icon,copied,onCopy,extra}){return(
  <div className="p-4 bg-[#0a0a0a] border border-white/5 rounded-xl"><div className="flex items-center gap-2 mb-2"><span className="text-[#525252]">{icon}</span><p className="text-[11px] text-[#a3a3a3] uppercase tracking-wider font-semibold m-0">{label}</p></div><div className="flex items-center gap-2"><code className="flex-1 text-[#e5e5e5] text-[13px] font-mono bg-black/40 px-3 py-2 rounded-lg border border-white/5 block truncate">{value}</code>{extra}<button onClick={onCopy} className="p-1.5 rounded-md hover:bg-white/10 text-[#737373] hover:text-white transition-colors bg-transparent border-none cursor-pointer">{copied?<Check className="w-4 h-4 text-emerald-400"/>:<Copy className="w-4 h-4"/>}</button></div></div>
)}

function AW(props){return(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 4v4"/><path d="M2 8h20"/><path d="M6 4v4"/></svg>)}
