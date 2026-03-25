import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "motion/react";
import { api, imageUrl, clearAuth } from "../api";
import PostDetail from "./PostDetail";
import toast from "react-hot-toast";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api("/api/auth/me").catch(() => { clearAuth(); navigate("/"); });
  }, [navigate]);

  const fetchPosts = useCallback(async (p) => {
    try {
      setLoading(true);
      const data = await api("/api/uploads/?page=" + p + "&limit=24");
      const uploads = data.uploads || data.posts || data;
      if (p === 1) setPosts(uploads);
      else setPosts((prev) => [...prev, ...uploads]);
      setHasMore(data.page < data.pages);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPosts(1); }, [fetchPosts]);

  const loadMore = () => { const next = page + 1; setPage(next); fetchPosts(next); };

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
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 border-b-4 border-[#FF4D00] pb-4">
          <h1 className="font-['Space_Grotesk'] font-black text-5xl md:text-6xl uppercase italic tracking-tighter">EXPLORE</h1>
          <p className="font-['Space_Grotesk'] uppercase tracking-[0.3em] text-white/30 text-sm mt-2">DISCOVER THE UNDERGROUND</p>
        </motion.div>

        {loading && posts.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square bg-[#1a1a1a] animate-pulse border-2 border-[#FF4D00]/5" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-7xl text-white/10 mb-4 block">search_off</span>
            <p className="font-['Space_Grotesk'] font-black text-3xl uppercase text-white/20">NOTHING YET</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {posts.map((post, idx) => (
                <motion.div key={post.id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setSelectedPost(post.id)}
                  className="group relative cursor-pointer bg-[#121212] border-2 border-transparent hover:border-[#FF4D00] transition-colors overflow-hidden aspect-square">
                  <img src={imageUrl(post.image_url)} alt={post.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-end p-3 opacity-0 group-hover:opacity-100">
                    <div>
                      {post.title && <p className="font-['Space_Grotesk'] font-black text-sm uppercase truncate">{post.title}</p>}
                      <p className="text-[10px] font-mono text-white/50">@{post.author?.username || "unknown"}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {hasMore && (
              <div className="text-center pt-10">
                <button onClick={loadMore} disabled={loading}
                  className="bg-[#1a1a1a] text-white px-12 py-4 font-['Space_Grotesk'] font-black uppercase tracking-widest border-2 border-[#FF4D00]/30 hover:border-[#FF4D00] hover:bg-[#FF4D00] hover:text-black transition-all">
                  {loading ? "LOADING..." : "LOAD MORE"}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
