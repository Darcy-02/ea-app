import { useState,useEffect} from "react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const LIGHT = {
  bg:       "#f5f3ef",
  card:     "#ffffff",
  border:   "#e2ddd6",
  border2:  "#d4cfc7",
  text:     "#1a1714",
  text2:    "#6b6560",
  text3:    "#a09890",
  navHover: "#f0ece6",
  navActive:"#e8e3fa",
  input:    "#f0ece6",
  tag:      "#eeedf9",
  tagText:  "#5b21b6",
  sunMoon:  "var(--color-primary)",
  pill:     { bg:"#d1fae5", border:"#6ee7b7", text:"#065f46" },
};
const DARK = {
  bg:       "#0f0f0f",
  card:     "#141414",
  border:   "#1e1e1e",
  border2:  "#252525",
  text:     "#e0e0e0",
  text2:    "#666666",
  text3:    "#3a3a3a",
  navHover: "#1a1a1a",
  navActive:"#1e1e1e",
  input:    "#141414",
  tag:      "#191919",
  tagText:  "#888",
  sunMoon:  "#f0c040",
  pill:     { bg:"#1a3a2a", border:"#2d6b45", text:"#4ade80" },
};

// ─── DATA ─────────────────────────────────────────────────────────────────────

const PORTFOLIO = [
  { id:1, img:"https://images.unsplash.com/photo-1483431974879-e3a67f03fb8f?w=300&q=80", likes:234 },
  { id:2, img:"https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=300&q=80", likes:891 },
  { id:3, img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80", likes:445 },
  { id:4, img:"https://images.unsplash.com/photo-1549490349-8643362247b5?w=300&q=80", likes:1203 },
  { id:5, img:"https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=300&q=80", likes:667 },
  { id:6, img:"https://images.unsplash.com/photo-1610337673044-720471f83677?w=300&q=80", likes:389 },
];
const SUGGESTED = [
  { name:"Priya Nair",  handle:"@priyanair", avatar:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80", followers:"12.4k", specialty:"Concept Art" },
  { name:"Tom Wright",  handle:"@tomwright",  avatar:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80", followers:"8.9k",  specialty:"3D Modeling" },
  { name:"Mei Lin",     handle:"@meilinart",  avatar:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80", followers:"21.1k", specialty:"Illustration" },
];
const DISCUSSIONS = [
  { title:"What brush packs do you swear by?",       replies:43,  trending:true  },
  { title:"AI Detection false positives happening?", replies:127, trending:true  },
  { title:"Best practices for portfolio curation",   replies:29,  trending:false },
  { title:"Commission pricing guide 2025",           replies:88,  trending:false },
];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const IcHome     = ({s}) => <svg width="18" height="18" viewBox="0 0 24 24" fill={s?"currentColor":"none"} stroke="currentColor" strokeWidth="1.8"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>;
const IcSearch   = ({sz=15}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcBookmark = ({s}) => <svg width="18" height="18" viewBox="0 0 24 24" fill={s?"currentColor":"none"} stroke="currentColor" strokeWidth="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>;
const IcBriefcase= () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const IcMessage  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IcBell     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IcHeart    = ({s}) => <svg width="17" height="17" viewBox="0 0 24 24" fill={s?"#f87171":"none"} stroke={s?"#f87171":"currentColor"} strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcComment  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IcDots     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>;
const IcPlus     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcCheck    = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>;
const IcTrend    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const IcArrow    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IcLogout   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcSun      = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const IcMoon     = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IcMenu     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IcGear     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const IcProfile  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [dark, setDark]           = useState(true);
  const [tab, setTab]             = useState("home");
  const [profileTab, setProfileTab] = useState("portfolio");
  const [posts, setPosts]         = useState([]);
  const [loading, setLoading]       = useState(true);

  const [following, setFollowing] = useState({});
  const [feedRatio, setFeedRatio] = useState(60);
  const [showFeedCfg, setShowFeedCfg] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const t = dark ? DARK : LIGHT;

  const toggleLike = id => setPosts(p => p.map(x => x.id===id ? {...x, liked:!x.liked, likes:x.liked?x.likes-1:x.likes+1} : x));
  const toggleSave = id => setPosts(p => p.map(x => x.id===id ? {...x, saved:!x.saved} : x));
  const toggleFollow = h => setFollowing(p => ({...p, [h]:!p[h]}));

  useEffect(() => {
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/artworks"); // your admin GET endpoint
      const data = await res.json();
      console.log("Fetched posts:", data); // check what your backend sends
      if (data.success) {
        setPosts(data.artworks); // adjust key to match backend response
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchPosts();
}, []);

  const NAV = [
    { key:"home",      label:"Home",          icon: s => <IcHome s={s} /> },
    { key:"explore",   label:"Explore",       icon: () => <IcSearch /> },
    { key:"bookmarks", label:"Bookmarks",     icon: s => <IcBookmark s={s} /> },
    { key:"jobs",      label:"Jobs",          icon: () => <IcBriefcase /> },
    { key:"messages",  label:"Messages",      icon: () => <IcMessage /> },
    { key:"notifs",    label:"Notifications", icon: () => <IcBell />, badge:3 },
  ];

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", padding:"16px 10px" }}>

      <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
        {NAV.map(({ key, label, icon, badge }) => (
          <button key={key} onClick={() => { setTab(key); setSidebarOpen(false); }}
            style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:10, border:"none", cursor:"pointer", fontSize:14, fontFamily:"'DM Sans', sans-serif", textAlign:"left", width:"100%", transition:"background .15s, color .15s",
              background: tab===key ? t.navActive : "transparent",
              color: tab===key ? t.text : t.text2,
            }}
          >
            {icon(tab===key)}
            <span>{label}</span>
            {badge && <span style={{ marginLeft:"auto", fontSize:10, background:"var(--color-primary)", color:"#fff", width:18, height:18, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{badge}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding:"0 4px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <img src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=80&q=80" alt="me" style={{ width:36, height:36, borderRadius:"50%", objectFit:"cover" }} />
          <div>
            <p style={{ fontSize:13, fontWeight:600, color:t.text, margin:0 }}>Jamie Kim</p>
            <p style={{ fontSize:11, color:t.text2, margin:0 }}>@jamiekim</p>
          </div>
        </div>
        <button style={{ width:"100%", background:"var(--color-primary)", color:"#fff", border:"none", borderRadius:10, padding:"9px 0", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontFamily:"'DM Sans', sans-serif", marginBottom:6 }}>
          <IcPlus /> New Post
        </button>
        <button style={{ width:"100%", background:"none", border:`1px solid ${t.border}`, color:t.text2, borderRadius:10, padding:"8px 0", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontFamily:"'DM Sans', sans-serif" }}>
          <IcLogout /> Log out
        </button>
      </div>
    </div>
  );

  // ── Right Panel ────────────────────────────────────────────────────────────
  const RightPanel = () => (
    <div style={{ padding:"16px", display:"flex", flexDirection:"column", gap:14 }}>
      {/* Search */}
      <div style={{ position:"relative" }}>
        <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:t.text3 }}><IcSearch /></span>
        <input placeholder="Search artists, tags..." style={{ width:"100%", boxSizing:"border-box", background:t.input, border:`1px solid ${t.border}`, borderRadius:12, padding:"9px 12px 9px 32px", fontSize:13, color:t.text, outline:"none", fontFamily:"'DM Sans', sans-serif" }} />
      </div>

      {/* Mini Profile Card */}
      <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:16, overflow:"hidden" }}>
        <div style={{ height:50, overflow:"hidden" }}>
          <img src="https://images.unsplash.com/photo-1682687220499-d9c06b872f6b?w=400&q=80" alt="" style={{ width:"100%", height:"100%", objectFit:"cover", opacity:.45 }} />
        </div>
        <div style={{ padding:"0 14px 14px", marginTop:-20 }}>
          <img src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=80&q=80" alt="me" style={{ width:40, height:40, borderRadius:"50%", objectFit:"cover", border:`2px solid ${dark?"#0f0f0f":"#fff"}`, display:"block", marginBottom:8 }} />
          <p style={{ color:t.text, fontWeight:600, fontSize:14, margin:"0 0 2px" }}>Jamie Kim</p>
          <p style={{ color:t.text2, fontSize:12, margin:"0 0 10px" }}>Concept artist · Seoul</p>
          <div style={{ display:"flex", gap:14, marginBottom:10 }}>
            {[["1.2k","Following"],["8.4k","Followers"],["94","Posts"]].map(([n,l]) => (
              <div key={l}><p style={{ color:t.text, fontWeight:700, fontSize:13, margin:0 }}>{n}</p><p style={{ color:t.text2, fontSize:11, margin:0 }}>{l}</p></div>
            ))}
          </div>
          <div style={{ display:"flex", gap:4, marginBottom:10 }}>
            {["portfolio","feed"].map(pt => (
              <button key={pt} onClick={() => setProfileTab(pt)} style={{ flex:1, fontSize:12, padding:"6px 0", borderRadius:8, border:"none", cursor:"pointer", textTransform:"capitalize", fontFamily:"'DM Sans', sans-serif", fontWeight:500,
                background: profileTab===pt ? "var(--color-primary)" : "transparent",
                color: profileTab===pt ? "#fff" : t.text2,
              }}>{pt}</button>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:3 }}>
            {PORTFOLIO.map(p => (
              <div key={p.id} style={{ borderRadius:5, overflow:"hidden", aspectRatio:"1", cursor:"pointer" }}>
                <img src={p.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Artists */}
      <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:16, padding:"14px" }}>
        <p style={{ fontSize:10, fontWeight:700, color:t.text3, textTransform:"uppercase", letterSpacing:".08em", margin:"0 0 12px" }}>Suggested Artists</p>
        <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
          {SUGGESTED.map(a => (
            <div key={a.handle} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <img src={a.avatar} alt={a.name} style={{ width:32, height:32, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ color:t.text, fontSize:13, fontWeight:500, margin:0, lineHeight:1.2 }}>{a.name}</p>
                <p style={{ color:t.text2, fontSize:11, margin:0 }}>{a.specialty} · {a.followers}</p>
              </div>
              <button onClick={() => toggleFollow(a.handle)} style={{ fontSize:11, padding:"4px 10px", borderRadius:99, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", flexShrink:0, whiteSpace:"nowrap",
                border: following[a.handle] ? "1px solid var(--color-primary)" : `1px solid ${t.border2}`,
                background: following[a.handle] ? (dark?"rgba(124,58,237,.15)":"#eeedf9") : "transparent",
                color: following[a.handle] ? "var(--color-primary)" : t.text2,
              }}>
                {following[a.handle] ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Discussions */}
      <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:16, padding:"14px" }}>
        <p style={{ fontSize:10, fontWeight:700, color:t.text3, textTransform:"uppercase", letterSpacing:".08em", margin:"0 0 12px" }}>Latest Discussions</p>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {DISCUSSIONS.map((d,i) => (
            <div key={i} style={{ cursor:"pointer" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:6 }}>
                {d.trending && <span style={{ color:"#f97316", marginTop:2, flexShrink:0 }}><IcTrend /></span>}
                <p style={{ fontSize:13, color:t.text2, margin:0, marginLeft:d.trending?0:18, lineHeight:1.4 }}>{d.title}</p>
              </div>
              <p style={{ fontSize:11, color:t.text3, margin:"2px 0 0 18px" }}>{d.replies} replies</p>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs */}
      <div style={{ borderRadius:16, padding:"14px", border:`1px solid ${dark?"#252560":"#c4b5fd"}`, background:dark?"linear-gradient(135deg,#111030,#0c0c28)":"linear-gradient(135deg,#eeedf9,#ddd6fe)" }}>
        <p style={{ fontSize:10, fontWeight:700, color:"#818cf8", textTransform:"uppercase", letterSpacing:".08em", margin:"0 0 6px" }}>Jobs Board</p>
        <p style={{ fontSize:14, fontWeight:600, color:t.text, margin:"0 0 4px" }}>3 new listings from AAA studios</p>
        <p style={{ fontSize:12, color:t.text2, margin:"0 0 12px" }}>FromSoftware · Kojima Productions · WildBrain</p>
        <button style={{ width:"100%", background:"none", border:`1px solid ${dark?"#2a2a70":"#a78bfa"}`, color:"#818cf8", borderRadius:10, padding:"8px 0", fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontFamily:"'DM Sans', sans-serif" }}>
          View Openings <IcArrow />
        </button>
      </div>

      <div style={{ display:"flex", flexWrap:"wrap", gap:"6px 10px", paddingBottom:8 }}>
        {["Privacy","Terms","About","Blog","Support"].map(l => (
          <span key={l} style={{ fontSize:11, color:t.text3, cursor:"pointer" }}>{l}</span>
        ))}
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:t.bg, fontFamily:"'DM Sans', sans-serif", color:t.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@1,500;1,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes riseIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: ${dark?"#222":"#ddd"}; border-radius: 4px; }
        @media (max-width: 768px) {
          .db-left  { display: none !important; }
          .db-right { display: none !important; }
          .db-mob   { display: flex !important; }
        }
        @media (min-width: 769px) {
          .db-mob { display: none !important; }
        }
      `}</style>

      {/* ── TOP NAVBAR ──────────────────────────────────────────────────────── */}
      <header style={{ position:"sticky", top:0, zIndex:100, background:t.card, borderBottom:`1px solid ${t.border}`, height:56, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px" }}>
        {/* Mobile: hamburger */}
        <button className="db-mob" onClick={() => setSidebarOpen(v=>!v)}
          style={{ display:"none", background:"none", border:`1px solid ${t.border}`, borderRadius:8, padding:6, cursor:"pointer", color:t.text }}>
          <IcMenu />
        </button>

        {/* Logo — desktop shows in sidebar, mobile shows in header */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:"var(--color-primary)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:14, fontStyle:"italic" }}>E</div>
          <span style={{ fontWeight:700, fontSize:15, color:t.text, fontFamily:"'Playfair Display', serif", fontStyle:"italic" }}>EmptyArt</span>
        </div>

        {/* Right controls */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {/* Theme toggle */}
          <button onClick={() => setDark(v=>!v)}
            style={{ background:"none", border:`1px solid ${t.border}`, borderRadius:"50%", width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:t.sunMoon }}>
            {dark ? <IcSun /> : <IcMoon />}
          </button>

          {/* Mobile right panel toggle */}
          <button className="db-mob" onClick={() => setRightOpen(v=>!v)}
            style={{ display:"none", background:"none", border:`1px solid ${t.border}`, borderRadius:8, padding:6, cursor:"pointer", color:t.text }}>
            <IcProfile />
          </button>
        </div>
      </header>

      {/* ── MOBILE SIDEBAR OVERLAY ──────────────────────────────────────────── */}
      {sidebarOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:300 }}>
          <div onClick={() => setSidebarOpen(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.55)" }} />
          <div style={{ position:"absolute", top:0, left:0, width:240, height:"100%", background:t.card, borderRight:`1px solid ${t.border}`, overflowY:"auto", zIndex:301 }}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* ── MOBILE RIGHT PANEL OVERLAY ──────────────────────────────────────── */}
      {rightOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:300 }}>
          <div onClick={() => setRightOpen(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.55)" }} />
          <div style={{ position:"absolute", top:0, right:0, width:290, height:"100%", background:t.card, borderLeft:`1px solid ${t.border}`, overflowY:"auto", zIndex:301 }}>
            <RightPanel />
          </div>
        </div>
      )}

      {/* ── BODY ────────────────────────────────────────────────────────────── */}
      <div style={{ display:"flex", height:"calc(100vh - 56px)" }}>

        {/* Left Sidebar — desktop only */}
        <aside className="db-left" style={{ width:220, flexShrink:0, borderRight:`1px solid ${t.border}`, background:t.card, overflowY:"auto" }}>
          <Sidebar />
        </aside>

        {/* Main Feed */}
        <main style={{ flex:1, overflowY:"auto" }}>
          {/* Feed Tab Bar */}
          <div style={{ position:"sticky", top:0, zIndex:10, background:t.card, borderBottom:`1px solid ${t.border}`, padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, flexWrap:"wrap" }}>
            <div style={{ display:"flex", gap:4 }}>
              {["Home","Blog","Following","Explore"].map(tl => (
                <button key={tl} onClick={() => setTab(tl.toLowerCase())}
                  style={{ padding:"6px 13px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontFamily:"'DM Sans', sans-serif", fontWeight:tab===tl.toLowerCase()?600:400, transition:"all .15s",
                    background: tab===tl.toLowerCase() ? t.navActive : "transparent",
                    color: tab===tl.toLowerCase() ? t.text : t.text2,
                  }}>{tl}</button>
              ))}
            </div>
            <button onClick={() => setShowFeedCfg(v=>!v)}
              style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:t.text2, background:"none", border:`1px solid ${t.border}`, borderRadius:8, padding:"6px 10px", cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>
              <IcGear /> Customize Feed
            </button>
          </div>

          {/* Feed Config Panel */}
          {showFeedCfg && (
            <div style={{ margin:"14px 20px", padding:"16px", background:t.card, border:`1px solid ${t.border}`, borderRadius:16 }}>
              <p style={{ fontSize:13, fontWeight:600, color:t.text, margin:"0 0 12px" }}>Feed Ratio</p>
              <div style={{ marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:t.text2, marginBottom:6 }}>
                  <span>People You Follow</span><span style={{ color:"var(--color-primary)" }}>{feedRatio}%</span>
                </div>
                <input type="range" min={0} max={100} value={feedRatio} onChange={e=>setFeedRatio(+e.target.value)} style={{ width:"100%", accentColor:"var(--color-primary)" }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:t.text2, marginBottom:4 }}>
                <span>Your Follow's Network</span><span style={{ color:"var(--color-primary)" }}>{Math.round((100-feedRatio)*.6)}%</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:t.text2 }}>
                <span>Cara Site-Wide</span><span style={{ color:"var(--color-primary)" }}>{Math.round((100-feedRatio)*.4)}%</span>
              </div>
            </div>
          )}

          {/* Posts */}
          <div style={{ maxWidth:580, margin:"0 auto", padding:"16px 20px 40px", display:"flex", flexDirection:"column", gap:20 }}>
            {posts.map((p, i) => (
              <div key={p.id} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:18, overflow:"hidden", animation:`riseIn .4s ease ${i*.07}s both` }}>
                {/* Header */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px 8px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <img src={p.avatar} alt={p.user} style={{ width:38, height:38, borderRadius:"50%", objectFit:"cover", border:`1px solid ${t.border2}` }} />
                    <div>
                      <p style={{ fontSize:14, fontWeight:600, color:t.text, margin:0, lineHeight:1.2 }}>{p.user}</p>
                      <p style={{ fontSize:11, color:t.text2, margin:0 }}>{p.handle} · {p.time}</p>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:3, padding:"3px 9px", borderRadius:99, fontSize:10, fontWeight:700, letterSpacing:".04em",
                      background:t.pill.bg, border:`1px solid ${t.pill.border}`, color:t.pill.text
                    }}><IcCheck /> Human</span>
                    <button style={{ background:"none", border:"none", cursor:"pointer", color:t.text2, padding:4 }}><IcDots /></button>
                  </div>
                </div>

                {/* Image */}
                <img src={p.img} alt={p.title} style={{ width:"100%", display:"block", maxHeight:420, objectFit:"cover" }} />

                {/* Actions */}
                <div style={{ display:"flex", alignItems:"center", gap:16, padding:"12px 14px 6px" }}>
                  <button onClick={() => toggleLike(p.id)} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, background:"none", border:"none", cursor:"pointer", color:p.liked?"#f87171":t.text2, fontFamily:"'DM Sans', sans-serif", padding:0 }}>
                    <IcHeart s={p.liked} />{p.likes.toLocaleString()}
                  </button>
                  <button style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, background:"none", border:"none", cursor:"pointer", color:t.text2, fontFamily:"'DM Sans', sans-serif", padding:0 }}>
                    <IcComment />{p.comments}
                  </button>
                  <button onClick={() => toggleSave(p.id)} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:p.saved?"var(--color-primary)":t.text2, padding:0 }}>
                    <IcBookmark s={p.saved} />
                  </button>
                </div>

                {/* Caption */}
                <div style={{ padding:"4px 14px 14px" }}>
                  <p style={{ fontSize:13, color:t.text2, margin:"0 0 8px", lineHeight:1.5 }}>
                    <strong style={{ color:t.text }}>{p.user} </strong>{p.content}
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {p.tags.map(tag => (
                      <span key={tag} style={{ fontSize:12, padding:"3px 10px", borderRadius:99, cursor:"pointer", background:t.tag, color:t.tagText, border:`1px solid ${t.border}` }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Panel — desktop only */}
        <aside className="db-right" style={{ width:268, flexShrink:0, borderLeft:`1px solid ${t.border}`, background:t.card, overflowY:"auto" }}>
          <RightPanel />
        </aside>
      </div>
    </div>
  );
}