import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, imageUrl, clearAuth } from "../api";
import PostDetail from "./PostDetail";
import toast from "react-hot-toast";

export default function Bookmarks() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api("/api/auth/me").catch(() => { clearAuth(); navigate("/"); });
  }, [navigate]);

  useEffect(() => {
    (async () => {
      try {
        const data = await api("/api/uploads/bookmarked");
        setPosts(data.uploads || data.posts || data);
      } catch { toast.error("Failed to load bookmarks"); }
      finally { setLoading(false); }
    })();
  }, []);

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

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32">
      {selectedPost && (
        <PostDetail postId={selectedPost} onClose={() => setSelectedPost(null)} onLike={toggleLike} onBookmark={toggleBookmark} />
      )}
      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-8">
        <div className="mb-10 border-b-4 border-[#00e3fd] pb-4">
          <h1 className="font-['Space_Grotesk'] font-black text-5xl md:text-6xl uppercase italic tracking-tighter">THE_VAULT</h1>
          <p className="font-['Space_Grotesk'] uppercase tracking-[0.3em] text-white/30 text-sm mt-2">YOUR SAVED WORKS</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-[#1a1a1a] animate-pulse border-2 border-[#00e3fd]/5" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-[#0a0a0a] border-2 border-dashed border-[#00e3fd]/20">
            <span className="material-symbols-outlined text-7xl text-white/10 mb-4 block">bookmark</span>
            <p className="font-['Space_Grotesk'] font-black text-3xl uppercase text-white/20 mb-2">VAULT IS EMPTY</p>
            <p className="text-white/30 font-['Space_Grotesk'] uppercase text-sm">Bookmark works to save them here</p>
            <button onClick={() => navigate("/explore")}
              className="mt-6 bg-[#00e3fd] text-black px-8 py-3 font-['Space_Grotesk'] font-black uppercase hover:bg-[#FF4D00] transition-colors">
              EXPLORE
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {posts.map((post) => (
              <div key={post.id}
                onClick={() => setSelectedPost(post.id)}
                className="group relative cursor-pointer bg-[#121212] border-2 border-transparent hover:border-[#00e3fd] transition-colors overflow-hidden aspect-square">
                <img src={imageUrl(post.image_url)} alt={post.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-end p-3 opacity-0 group-hover:opacity-100">
                  <div>
                    {post.title && <p className="font-['Space_Grotesk'] font-black text-sm uppercase truncate">{post.title}</p>}
                    <p className="text-[10px] font-mono text-white/50">@{post.author?.username || "unknown"}</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="material-symbols-outlined text-[#00e3fd] text-lg" style={{fontVariationSettings: "'FILL' 1"}}>bookmark</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
