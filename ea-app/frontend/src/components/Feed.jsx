import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "motion/react";
import { api, imageUrl, clearAuth } from "../api";
import PostDetail from "./PostDetail";
import toast from "react-hot-toast";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + "m";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h";
  const d = Math.floor(h / 24);
  if (d < 7) return d + "d";
  return Math.floor(d / 7) + "w";
}

function FeedCard({ post, idx, onSelect, onLike, onBookmark, onProfile }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60, rotate: idx % 2 === 0 ? -1 : 1 }}
      animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      className={"relative group " + (idx % 3 === 1 ? "md:translate-x-8" : idx % 3 === 2 ? "md:-translate-x-4" : "")}
    >
      <div className="relative bg-[#121212] p-3 border-4 border-[#FF4D00]/20 hover:border-[#FF4D00] transition-colors shadow-[12px_12px_0px_0px_rgba(0,227,253,0.1)] hover:shadow-[12px_12px_0px_0px_#00e3fd] duration-300">
        <div className="relative overflow-hidden cursor-pointer" onClick={() => onSelect(post.id)} onDoubleClick={() => onLike(post.id)}>
          <img
            src={imageUrl(post.image_url)}
            alt={post.title}
            className="w-full h-auto object-contain grayscale brightness-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            loading="lazy"
          />
          {post.title && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="absolute top-4 right-4 bg-[#FF4D00] text-black px-6 py-2 font-['Space_Grotesk'] font-black italic text-lg uppercase tracking-tighter shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-3"
            >
              {post.title}
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="absolute -bottom-4 left-4 bg-white text-black px-4 py-2 font-['Space_Grotesk'] font-black uppercase text-sm tape-edge shadow-lg cursor-pointer"
          onClick={() => onProfile(post.author.id)}
        >
          @{post.author.username}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-8 flex justify-between items-center px-2"
      >
        <div>
          {post.title && <p className="font-['Space_Grotesk'] font-black uppercase text-xl">{post.title}</p>}
          <p className="text-xs font-mono opacity-50 mt-1">{timeAgo(post.created_at)} // #{post.id}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onLike(post.id)}
            className={"w-10 h-10 border-2 flex items-center justify-center active:translate-x-1 active:translate-y-1 transition-colors " +
              (post.is_liked ? "border-[#FF4D00] bg-[#FF4D00] text-black" : "border-[#FF4D00] text-[#FF4D00] hover:bg-[#FF4D00] hover:text-black")}
          >
            <span className="material-symbols-outlined text-sm" style={post.is_liked ? {fontVariationSettings: "'FILL' 1"} : {}}>favorite</span>
          </button>
          <button
            onClick={() => onSelect(post.id)}
            className="w-10 h-10 border-2 border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
          >
            <span className="material-symbols-outlined text-sm">mode_comment</span>
          </button>
          <button
            onClick={() => onBookmark(post.id)}
            className={"w-10 h-10 border-2 flex items-center justify-center transition-colors " +
              (post.is_bookmarked ? "border-[#00e3fd] bg-[#00e3fd] text-black" : "border-white/20 text-white hover:bg-[#00e3fd] hover:text-black")}
          >
            <span className="material-symbols-outlined text-sm" style={post.is_bookmarked ? {fontVariationSettings: "'FILL' 1"} : {}}>bookmark</span>
          </button>
        </div>
      </motion.div>
      {post.like_count > 0 && (
        <p className="text-xs font-['Space_Grotesk'] font-bold uppercase tracking-widest text-[#FF4D00] mt-2 px-2">{post.like_count} {post.like_count === 1 ? "SIGNAL" : "SIGNALS"}</p>
      )}
    </motion.article>
  );
}

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  useEffect(() => {
    api("/api/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => { clearAuth(); navigate("/"); });
  }, [navigate]);

  const fetchPosts = useCallback(async (p) => {
    try {
      setLoading(true);
      const data = await api("/api/uploads/feed?page=" + p + "&limit=10");
      if (p === 1) setPosts(data.posts);
      else setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.page < data.pages);
    } catch { toast.error("Failed to load feed"); }
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
    <div className="min-h-screen bg-[#050505] text-white">
      {selectedPost && (
        <PostDetail postId={selectedPost} onClose={() => setSelectedPost(null)} onLike={toggleLike} onBookmark={toggleBookmark} />
      )}

      <main className="pt-8 pb-32 px-4 md:px-8 max-w-5xl mx-auto space-y-16">
        {loading && posts.length === 0 ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-[#1a1a1a] border-4 border-[#FF4D00]/10 p-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#262626]" />
                  <div className="flex-1"><div className="h-3 w-24 bg-[#262626] mb-2" /><div className="h-2 w-16 bg-[#262626]" /></div>
                </div>
                <div className="aspect-[4/3] bg-[#0e0e0e]" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <h2 className="font-['Space_Grotesk'] font-black text-6xl uppercase italic tracking-tighter text-white mb-4">DEAD AIR</h2>
            <p className="text-white/40 font-['Space_Grotesk'] uppercase tracking-widest mb-8">Your feed is empty. Follow artists or drop your first work.</p>
            <button onClick={() => navigate("/explore")} className="bg-[#FF4D00] text-black px-12 py-4 font-['Space_Grotesk'] font-black uppercase text-xl hover:bg-[#00e3fd] transition-all">
              EXPLORE
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              ref={headerRef}
              initial={{ opacity: 0, x: -40 }}
              animate={headerInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between mb-4 border-b-4 border-[#FF4D00] pb-4"
            >
              <h2 className="font-['Space_Grotesk'] font-black text-4xl uppercase italic tracking-tighter">FEED_EXPLORER</h2>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-[#FF4D00] text-4xl">grid_view</span>
                <span className="material-symbols-outlined text-white opacity-40 text-4xl">splitscreen</span>
              </div>
            </motion.div>

            <div className="space-y-16">
              {posts.map((post, idx) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  idx={idx}
                  onSelect={setSelectedPost}
                  onLike={toggleLike}
                  onBookmark={toggleBookmark}
                  onProfile={(id) => navigate("/profile/" + id)}
                />
              ))}
            </div>

            {hasMore && (
              <div className="text-center pt-8">
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
