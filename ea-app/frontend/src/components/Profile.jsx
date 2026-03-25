import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { api, imageUrl, clearAuth } from "../api";
import PostDetail from "./PostDetail";
import toast from "react-hot-toast";

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    api("/api/auth/me")
      .then((d) => setCurrentUser(d.user))
      .catch(() => { clearAuth(); navigate("/"); });
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        setLoading(true);
        const [profileData, postsData] = await Promise.all([
          api("/api/users/" + userId),
          api("/api/uploads/user/" + userId),
        ]);
        setProfile(profileData);
        setPosts(postsData.posts || postsData.uploads || []);
        setEditForm({ username: profileData.username || "", bio: profileData.bio || "" });
      } catch { toast.error("Failed to load profile"); }
      finally { setLoading(false); }
    })();
  }, [userId]);

  const isOwn = currentUser && profile && currentUser.id === profile.id;

  const handleFollow = async () => {
    try {
      await api("/api/users/" + userId + "/follow", { method: "POST" });
      setProfile((p) => ({
        ...p,
        is_following: !p.is_following,
        followers_count: p.is_following ? p.followers_count - 1 : p.followers_count + 1,
      }));
    } catch { toast.error("Failed"); }
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append("username", editForm.username);
      form.append("bio", editForm.bio);
      await api("/api/users/" + userId, {
        method: "PUT",
        body: form,
        isFormData: true,
      });
      setProfile((p) => ({ ...p, ...editForm }));
      setEditing(false);
      toast.success("Updated");
    } catch { toast.error("Failed to update"); }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("avatar", file);
    try {
      const data = await api("/api/users/" + userId, { method: "PUT", body: form, isFormData: true });
      setProfile((p) => ({ ...p, avatar_url: data.user?.avatar_url || data.avatar_url }));
      toast.success("Avatar updated");
    } catch { toast.error("Failed to upload avatar"); }
  };

  const toggleLike = async (id) => {
    setPosts((p) => p.map((x) => x.id === id ? { ...x, is_liked: !x.is_liked, like_count: x.is_liked ? x.like_count - 1 : x.like_count + 1 } : x));
    try { await api("/api/uploads/" + id + "/like", { method: "POST" }); } catch {
      setPosts((p) => p.map((x) => x.id === id ? { ...x, is_liked: !x.is_liked, like_count: x.is_liked ? x.like_count - 1 : x.like_count + 1 } : x));
    }
  };

  const toggleBookmark = async (id) => {
    setPosts((p) => p.map((x) => x.id === id ? { ...x, is_bookmarked: !x.is_bookmarked } : x));
    try { await api("/api/uploads/" + id + "/bookmark", { method: "POST" }); } catch {
      setPosts((p) => p.map((x) => x.id === id ? { ...x, is_bookmarked: !x.is_bookmarked } : x));
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <p className="font-['Space_Grotesk'] font-black text-3xl text-white/20 uppercase animate-pulse">LOADING_ARTIST...</p>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32">
      {selectedPost && (
        <PostDetail postId={selectedPost} onClose={() => setSelectedPost(null)} onLike={toggleLike} onBookmark={toggleBookmark} />
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-[#0a0a0a] border-b-4 border-[#FF4D00]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-12 pb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative group">
              <div className="w-28 h-28 md:w-36 md:h-36 bg-[#121212] border-4 border-[#FF4D00] shadow-[8px_8px_0px_0px_#00e3fd] overflow-hidden -rotate-3 group-hover:rotate-0 transition-transform">
                {profile.avatar_url
                  ? <img src={imageUrl(profile.avatar_url)} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center font-['Space_Grotesk'] font-black text-5xl text-[#FF4D00]">{profile.username[0].toUpperCase()}</div>}
              </div>
              {isOwn && (
                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#00e3fd] text-black flex items-center justify-center cursor-pointer rotate-6 hover:rotate-0 transition-transform">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
                </label>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-4">
                  <input value={editForm.username}
                    onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))}
                    className="w-full bg-[#1a1a1a] border-2 border-[#FF4D00] px-4 py-3 font-['Space_Grotesk'] font-black text-2xl uppercase text-white focus:outline-none" />
                  <textarea value={editForm.bio}
                    onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
                    rows={3}
                    className="w-full bg-[#1a1a1a] border-2 border-[#FF4D00]/30 px-4 py-3 text-sm text-white/70 focus:outline-none resize-none" />
                  <div className="flex gap-3">
                    <button onClick={handleSave} className="bg-[#FF4D00] text-black px-6 py-2 font-['Space_Grotesk'] font-black uppercase">SAVE</button>
                    <button onClick={() => setEditing(false)} className="border-2 border-white/20 px-6 py-2 font-['Space_Grotesk'] font-black uppercase text-white/50 hover:text-white">CANCEL</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 flex-wrap">
                    <h1 className="font-['Space_Grotesk'] font-black text-4xl md:text-5xl uppercase italic tracking-tighter">
                      {profile.username}
                    </h1>
                    {isOwn ? (
                      <button onClick={() => setEditing(true)}
                        className="border-2 border-[#FF4D00] text-[#FF4D00] px-4 py-1 font-['Space_Grotesk'] font-bold uppercase text-sm hover:bg-[#FF4D00] hover:text-black">
                        EDIT
                      </button>
                    ) : (
                      <button onClick={handleFollow}
                        className={"px-6 py-2 font-['Space_Grotesk'] font-black uppercase text-sm " +
                          (profile.is_following
                            ? "bg-[#00e3fd] text-black border-2 border-[#00e3fd]"
                            : "bg-[#FF4D00] text-black border-2 border-[#FF4D00] hover:bg-transparent hover:text-[#FF4D00]")}>
                        {profile.is_following ? "FOLLOWING" : "FOLLOW"}
                      </button>
                    )}
                  </div>
                  {profile.bio && <p className="text-white/50 mt-3 max-w-xl text-sm leading-relaxed">{profile.bio}</p>}
                </>
              )}

              <div className="flex gap-8 mt-6">
                <div className="text-center">
                  <p className="font-['Space_Grotesk'] font-black text-3xl text-[#FF4D00]">{posts.length}</p>
                  <p className="font-['Space_Grotesk'] font-bold uppercase text-[10px] tracking-[0.3em] text-white/30">WORKS</p>
                </div>
                <div className="text-center">
                  <p className="font-['Space_Grotesk'] font-black text-3xl text-[#00e3fd]">{profile.followers_count || 0}</p>
                  <p className="font-['Space_Grotesk'] font-bold uppercase text-[10px] tracking-[0.3em] text-white/30">FOLLOWERS</p>
                </div>
                <div className="text-center">
                  <p className="font-['Space_Grotesk'] font-black text-3xl">{profile.following_count || 0}</p>
                  <p className="font-['Space_Grotesk'] font-bold uppercase text-[10px] tracking-[0.3em] text-white/30">FOLLOWING</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-12">
        <div className="flex items-center justify-between mb-8 border-b-4 border-[#FF4D00]/30 pb-4">
          <h2 className="font-['Space_Grotesk'] font-black text-2xl uppercase tracking-tighter">PORTFOLIO // {posts.length} WORKS</h2>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-[#0a0a0a] border-2 border-dashed border-[#FF4D00]/20">
            <span className="material-symbols-outlined text-6xl text-white/10 mb-4">palette</span>
            <p className="font-['Space_Grotesk'] font-bold uppercase text-white/20">No works yet</p>
            {isOwn && (
              <button onClick={() => navigate("/upload")}
                className="mt-4 bg-[#FF4D00] text-black px-8 py-3 font-['Space_Grotesk'] font-black uppercase">
                DROP YOUR FIRST WORK
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {posts.map((post, idx) => (
              <motion.div key={post.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: Math.min(idx * 0.06, 0.5), ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setSelectedPost(post.id)}
                className="group relative cursor-pointer bg-[#121212] border-2 border-transparent hover:border-[#FF4D00] transition-colors overflow-hidden aspect-square">
                <img src={imageUrl(post.image_url)} alt={post.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-end p-3 opacity-0 group-hover:opacity-100">
                  <div className="flex gap-4 text-sm font-['Space_Grotesk'] font-bold">
                    <span className="flex items-center gap-1 text-[#FF4D00]">
                      <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
                      {post.like_count || 0}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
