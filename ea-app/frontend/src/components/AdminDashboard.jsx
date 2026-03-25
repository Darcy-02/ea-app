import { useState, useEffect } from "react";
import { api, imageUrl } from "../api";
import toast from "react-hot-toast";

const Ic = {
  Posts:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  Reactions: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Users: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
};

const TABS = [
  { key: "uploads", label: "Uploads", Icon: Ic.Posts },
  { key: "reactions", label: "Reactions", Icon: Ic.Reactions },
  { key: "users", label: "Users", Icon: Ic.Users },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("uploads");
  const [uploads, setUploads] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (activeTab === "uploads") {
          const d = await api("/api/admin/uploads");
          setUploads(d.uploads || []);
        } else if (activeTab === "reactions") {
          const d = await api("/api/admin/reactions");
          setReactions(d.reactions || []);
        } else if (activeTab === "users") {
          const d = await api("/api/admin/users");
          setUsers(d.users || []);
        }
      } catch { /* silent */ }
    };
    load();
  }, [activeTab]);

  const deleteUpload = async (id) => {
    try {
      await api(`/api/admin/uploads/${id}`, { method: "DELETE" });
      setUploads((u) => u.filter((x) => x.id !== id));
      toast.success("Upload deleted");
    } catch { toast.error("Failed to delete"); }
    setConfirmId(null);
  };

  const deleteReaction = async (id) => {
    try {
      await api(`/api/admin/reactions/${id}`, { method: "DELETE" });
      setReactions((r) => r.filter((x) => x.id !== id));
      toast.success("Reaction deleted");
    } catch { toast.error("Failed to delete"); }
    setConfirmId(null);
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await api(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((u) => u.map((x) => (x.id === userId ? { ...x, role: newRole } : x)));
      toast.success(`Role updated to ${newRole}`);
    } catch { toast.error("Failed to update role"); }
  };

  const ConfirmDelete = ({ onConfirm }) => (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Delete?</span>
      <button onClick={onConfirm} className="text-red-400 hover:text-red-300 p-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg></button>
      <button onClick={() => setConfirmId(null)} className="text-gray-500 hover:text-gray-300 p-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mb-8">Manage uploads, reactions, and users</p>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#111] rounded-xl p-1 mb-8 w-fit">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setConfirmId(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === key
                  ? "bg-[#1e1e1e] text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon /> {label}
            </button>
          ))}
        </div>

        {/* Uploads Tab */}
        {activeTab === "uploads" && (
          <div className="space-y-0 bg-[#111] rounded-xl border border-[#1e1e1e] overflow-hidden">
            {uploads.length === 0 ? (
              <div className="text-center py-16 text-gray-500 text-sm">No uploads</div>
            ) : uploads.map((u) => (
              <div key={u.id} className="flex items-center gap-4 px-4 py-3 border-b border-[#1a1a1a] last:border-0 hover:bg-[#161616] transition">
                {u.image_url && (
                  <img src={imageUrl(u.image_url)} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{u.title || "Untitled"}</p>
                  <p className="text-xs text-gray-500">by {u.author?.username || "Unknown"} · {new Date(u.created_at).toLocaleDateString()}</p>
                </div>
                {confirmId === `u-${u.id}` ? (
                  <ConfirmDelete onConfirm={() => deleteUpload(u.id)} />
                ) : (
                  <button onClick={() => setConfirmId(`u-${u.id}`)} className="text-gray-600 hover:text-red-400 p-1.5 transition"><Ic.Trash /></button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reactions Tab */}
        {activeTab === "reactions" && (
          <div className="space-y-0 bg-[#111] rounded-xl border border-[#1e1e1e] overflow-hidden">
            {reactions.length === 0 ? (
              <div className="text-center py-16 text-gray-500 text-sm">No reactions</div>
            ) : reactions.map((r) => (
              <div key={r.id} className="flex items-center gap-4 px-4 py-3 border-b border-[#1a1a1a] last:border-0 hover:bg-[#161616] transition">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  r.type === "like" ? "bg-red-500/10 text-red-400" :
                  r.type === "comment" ? "bg-blue-500/10 text-blue-400" :
                  "bg-yellow-500/10 text-yellow-400"
                }`}>{r.type}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{r.username || "User"}</span>
                    <span className="text-gray-500"> on upload #{r.upload_id}</span>
                  </p>
                  {r.reaction_details && <p className="text-xs text-gray-400 truncate mt-0.5">{r.reaction_details}</p>}
                </div>
                {confirmId === `r-${r.id}` ? (
                  <ConfirmDelete onConfirm={() => deleteReaction(r.id)} />
                ) : (
                  <button onClick={() => setConfirmId(`r-${r.id}`)} className="text-gray-600 hover:text-red-400 p-1.5 transition"><Ic.Trash /></button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-0 bg-[#111] rounded-xl border border-[#1e1e1e] overflow-hidden">
            {users.length === 0 ? (
              <div className="text-center py-16 text-gray-500 text-sm">No users</div>
            ) : users.map((u) => (
              <div key={u.id} className="flex items-center gap-4 px-4 py-3 border-b border-[#1a1a1a] last:border-0 hover:bg-[#161616] transition">
                {u.avatar_url ? (
                  <img src={imageUrl(u.avatar_url)} alt="" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {u.username?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{u.username}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  u.role === "admin" ? "bg-primary/10 text-primary" : "bg-gray-700/30 text-gray-400"
                }`}>{u.role}</span>
                <button
                  onClick={() => toggleRole(u.id, u.role)}
                  className="text-xs px-3 py-1.5 border border-[#282828] rounded-lg hover:bg-[#1a1a1a] transition"
                >
                  {u.role === "admin" ? "Demote" : "Promote"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
