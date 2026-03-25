import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api, clearAuth, imageUrl } from "../api";

function homeSvg(active) {
  return active ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 9v11a2 2 0 002 2h4v-7h6v7h4a2 2 0 002-2V9l-9-7z"/></svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  );
}

function exploreSvg(active) {
  return active ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2"/></svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  );
}

function uploadSvg() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
  );
}

function bookmarkSvg(active) {
  return active ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
  );
}

function profileSvg(active) {
  return active ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  );
}

function adminSvg() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
  );
}

export default function AppNav() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api("/api/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, []);

  const logout = () => {
    clearAuth();
    navigate("/");
  };

  const items = [
    { to: "/feed", label: "Home", render: (a) => homeSvg(a) },
    { to: "/explore", label: "Explore", render: (a) => exploreSvg(a) },
    { to: "/upload", label: "Upload", render: () => uploadSvg() },
    { to: "/bookmarks", label: "Saved", render: (a) => bookmarkSvg(a) },
    ...(user ? [{ to: `/profile/${user.id}`, label: "Profile", render: (a) => profileSvg(a) }] : []),
    ...(user?.role === "admin" ? [{ to: "/admin", label: "Admin", render: () => adminSvg() }] : []),
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-[220px] bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-[#1e1e1e] flex-col z-50">
        <div className="px-6 py-7">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            EmptyArt
          </span>
        </div>

        <div className="flex-1 px-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl mb-0.5 transition text-sm font-medium ${
                  isActive
                    ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-[#1a1a1a]"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#111]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.render(isActive)}
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="px-3 pb-6">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              {user.avatar_url ? (
                <img src={imageUrl(user.avatar_url)} className="w-8 h-8 rounded-full object-cover" alt="" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.username[0]?.toUpperCase()}
                </div>
              )}
              <span className="text-sm font-semibold truncate">{user.username}</span>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#111] transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-[#1e1e1e] z-50 safe-area-pb">
        <div className="flex justify-around items-center h-14">
          {items.slice(0, 5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-1 transition ${
                  isActive ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.render(isActive)}
                  <span className="text-[10px] mt-0.5">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
