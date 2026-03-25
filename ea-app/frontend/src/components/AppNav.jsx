import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { api, clearAuth, imageUrl } from "../api";

export default function AppNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    api("/api/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, []);

  const logout = () => {
    clearAuth();
    navigate("/");
  };

  const navItems = [
    { to: "/feed", icon: "home", label: "Feed" },
    { to: "/explore", icon: "search", label: "Explore" },
    { to: "/upload", icon: "add_box", label: "Upload" },
    { to: "/bookmarks", icon: "palette", label: "Vault" },
    ...(user ? [{ to: "/profile/" + user.id, icon: "person", label: "Profile" }] : []),
  ];

  const desktopLinks = [
    { to: "/feed", label: "FEED" },
    { to: "/explore", label: "VAULT" },
    { to: "/upload", label: "DROPS" },
    { to: "/about", label: "ABOUT" },
  ];

  return (
    <>
      <header className="flex justify-between items-center px-6 py-4 w-full sticky top-0 z-50 bg-[#0e0e0e] shadow-[0_20px_50px_rgba(255,77,0,0.15)]">
        <div className="flex items-center gap-4">
          <span
            className="material-symbols-outlined text-[#FF4D00] text-2xl cursor-pointer hover:bg-[#FF4D00] hover:text-black transition-colors duration-100 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >menu</span>
          <h1
            className="font-['Space_Grotesk'] font-black uppercase tracking-tighter text-3xl text-[#FF4D00] italic hover:skew-x-[-12deg] transition-transform cursor-pointer"
            onClick={() => navigate("/feed")}
          >EMPTY ART</h1>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-8">
            {desktopLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive: active }) =>
                  "font-['Space_Grotesk'] font-black uppercase text-sm tracking-widest transition-colors duration-100 " +
                  (active ? "text-[#00e3fd]" : "text-white hover:bg-[#FF4D00] hover:text-black px-2")
                }
              >{link.label}</NavLink>
            ))}
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive: active }) =>
                  "font-['Space_Grotesk'] font-black uppercase text-sm tracking-widest transition-colors duration-100 " +
                  (active ? "text-[#00e3fd]" : "text-white hover:bg-[#FF4D00] hover:text-black px-2")
                }
              >ADMIN</NavLink>
            )}
          </nav>
          <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center border-2 border-[#FF4D00]/30 hover:border-[#FF4D00] hover:bg-[#FF4D00] hover:text-black transition-colors" title={dark ? "Light mode" : "Dark mode"}>
            <span className="material-symbols-outlined text-xl">{dark ? "light_mode" : "dark_mode"}</span>
          </button>
          <span className="material-symbols-outlined text-[#FF4D00] text-2xl cursor-pointer">notifications</span>
          {user && (
            <div
              className="w-10 h-10 border-2 border-[#FF4D00] overflow-hidden rotate-3 hover:rotate-0 transition-transform cursor-pointer"
              onClick={() => navigate("/profile/" + user.id)}
            >
              {user.avatar_url ? (
                <img src={imageUrl(user.avatar_url)} alt="" className="w-full h-full object-cover saturate-150 contrast-125" />
              ) : (
                <div className="w-full h-full bg-[#FF4D00] flex items-center justify-center text-black font-['Space_Grotesk'] font-black text-lg">
                  {user.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      <div className="bg-[#1a1a1a] h-[4px] w-full block sticky top-[68px] z-50" />

      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col p-10 bg-black/95 md:hidden">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-['Space_Grotesk'] font-black uppercase text-5xl italic text-[#FF4D00] underline decoration-4">THE ARCHIVE</h2>
            <span className="material-symbols-outlined text-white text-3xl cursor-pointer" onClick={() => setMenuOpen(false)}>close</span>
          </div>
          <nav className="flex flex-col gap-8">
            {[
              { to: "/feed", label: "Street Feed" },
              { to: "/explore", label: "Gallery" },
              { to: "/upload", label: "Drop" },
              { to: "/bookmarks", label: "Vault" },
              { to: "/about", label: "About" },
              ...(user ? [{ to: "/profile/" + user.id, label: "Profile" }] : []),
              ...(user?.role === "admin" ? [{ to: "/admin", label: "Admin" }] : []),
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive: active }) =>
                  "font-['Space_Grotesk'] font-black uppercase text-5xl italic transition-all " +
                  (active ? "text-[#FF4D00] bg-white/5 line-through decoration-[#FF4D00]" : "text-white hover:text-[#FF4D00] hover:tracking-widest")
                }
              >{item.label}</NavLink>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-4 items-start">
            <button onClick={() => { toggleTheme(); setMenuOpen(false); }} className="font-['Space_Grotesk'] font-black uppercase text-2xl text-[#00e3fd] hover:text-[#FF4D00] transition-colors flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl">{dark ? "light_mode" : "dark_mode"}</span>
              {dark ? "LIGHT MODE" : "DARK MODE"}
            </button>
            <button onClick={() => { logout(); setMenuOpen(false); }} className="font-['Space_Grotesk'] font-black uppercase text-2xl text-white/40 hover:text-[#FF4D00] transition-colors">DISCONNECT</button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center h-20 bg-black/90 backdrop-blur-xl px-4 border-t-4 border-[#00e3fd] md:hidden">
        {navItems.map((item) => {
          const active = item.to === "/feed" ? location.pathname === "/feed" : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={"flex flex-col items-center justify-center p-2 transition-all duration-75 cursor-pointer active:scale-90 " +
                (active ? "text-black bg-[#FF4D00] scale-110 rotate-[-2deg]" : "text-white opacity-70 hover:opacity-100 hover:text-[#00e3fd]")
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
