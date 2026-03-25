import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { api, imageUrl } from "../api";
import toast from "react-hot-toast";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return m + "m";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h";
  const d = Math.floor(h / 24);
  if (d < 7) return d + "d";
  return Math.floor(d / 7) + "w";
}

export default function PostDetail({ postId, onClose, onLike, onBookmark }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const commentsEnd = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [postData, commentsData] = await Promise.all([
          api("/api/uploads/" + postId),
          api("/api/uploads/" + postId + "/comments"),
        ]);
        setPost(postData);
        setComments(commentsData.comments || commentsData);
      } catch { toast.error("Failed to load post"); onClose(); }
      finally { setLoading(false); }
    })();
  }, [postId, onClose]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const data = await api("/api/uploads/" + postId + "/comment", {
        method: "POST",
        body: { content: newComment.trim() },
      });
      setComments((prev) => [...prev, data.comment || data]);
      setNewComment("");
      setTimeout(() => commentsEnd.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { toast.error("Failed to post comment"); }
    finally { setSubmitting(false); }
  };

  const handleLike = () => {
    if (!post) return;
    onLike?.(post.id);
    setPost((p) => ({ ...p, is_liked: !p.is_liked, like_count: p.is_liked ? p.like_count - 1 : p.like_count + 1 }));
  };

  const handleBookmark = () => {
    if (!post) return;
    onBookmark?.(post.id);
    setPost((p) => ({ ...p, is_bookmarked: !p.is_bookmarked }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-5xl max-h-[90vh] bg-[#0a0a0a] border-4 border-[#FF4D00] shadow-[16px_16px_0px_0px_#00e3fd] overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}>

        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-12 h-12 bg-[#FF4D00] text-black flex items-center justify-center font-black text-2xl hover:bg-[#00e3fd] transition-none rotate-3 hover:rotate-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="material-symbols-outlined">close</span>
        </button>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-20">
            <p className="font-['Space_Grotesk'] font-black text-2xl text-white/20 uppercase animate-pulse">LOADING...</p>
          </div>
        ) : post ? (
          <>
            <div className="md:w-3/5 relative bg-black flex items-center justify-center overflow-hidden">
              <img src={imageUrl(post.image_url)} alt={post.title}
                className="w-full h-auto max-h-[40vh] md:max-h-[90vh] object-contain" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => { onClose(); navigate("/profile/" + post.author.id); }}>
                  <div className="w-10 h-10 bg-[#FF4D00] border-2 border-[#FF4D00] flex items-center justify-center overflow-hidden -rotate-3">
                    {post.author.avatar_url
                      ? <img src={imageUrl(post.author.avatar_url)} className="w-full h-full object-cover" />
                      : <span className="font-['Space_Grotesk'] font-black text-black">{post.author.username[0].toUpperCase()}</span>}
                  </div>
                  <div>
                    <p className="font-['Space_Grotesk'] font-black text-white uppercase text-sm">@{post.author.username}</p>
                    <p className="font-mono text-[10px] text-white/40">{timeAgo(post.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-2/5 flex flex-col border-l-4 border-[#FF4D00]/30 bg-[#0a0a0a]">
              <div className="p-6 border-b-4 border-[#1a1a1a]">
                {post.title && <h2 className="font-['Space_Grotesk'] font-black text-2xl uppercase italic tracking-tighter mb-2">{post.title}</h2>}
                {post.description && <p className="text-sm text-white/50 font-['Inter'] leading-relaxed">{post.description}</p>}
                <div className="flex gap-3 mt-4">
                  <button onClick={handleLike}
                    className={"flex items-center gap-2 px-4 py-2 border-2 font-['Space_Grotesk'] font-bold uppercase text-sm " +
                      (post.is_liked ? "border-[#FF4D00] bg-[#FF4D00] text-black" : "border-[#FF4D00] text-[#FF4D00] hover:bg-[#FF4D00] hover:text-black")}>
                    <span className="material-symbols-outlined text-lg" style={post.is_liked ? {fontVariationSettings: "'FILL' 1"} : {}}>favorite</span>
                    {post.like_count || 0}
                  </button>
                  <button onClick={handleBookmark}
                    className={"flex items-center gap-2 px-4 py-2 border-2 font-['Space_Grotesk'] font-bold uppercase text-sm " +
                      (post.is_bookmarked ? "border-[#00e3fd] bg-[#00e3fd] text-black" : "border-white/20 text-white hover:bg-[#00e3fd] hover:text-black")}>
                    <span className="material-symbols-outlined text-lg" style={post.is_bookmarked ? {fontVariationSettings: "'FILL' 1"} : {}}>bookmark</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                <h3 className="font-['Space_Grotesk'] font-black uppercase text-xs tracking-[0.3em] text-[#00e3fd]">TRANSMISSIONS [{comments.length}]</h3>
                {comments.length === 0 ? (
                  <p className="text-white/20 font-['Space_Grotesk'] uppercase text-sm">No transmissions yet. Be the first.</p>
                ) : (
                  comments.map((c, i) => (
                    <div key={c.id || i} className="border-l-2 border-[#FF4D00]/30 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-['Space_Grotesk'] font-bold text-sm uppercase cursor-pointer text-[#FF4D00] hover:text-[#00e3fd]"
                          onClick={() => { onClose(); navigate("/profile/" + c.user_id); }}>
                          @{c.username}
                        </span>
                        <span className="font-mono text-[10px] text-white/30">{timeAgo(c.created_at)}</span>
                      </div>
                      <p className="text-sm text-white/70">{c.text}</p>
                    </div>
                  ))
                )}
                <div ref={commentsEnd} />
              </div>

              <form onSubmit={submitComment} className="p-4 border-t-4 border-[#1a1a1a] flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="TRANSMIT..."
                  className="flex-1 bg-[#1a1a1a] border-2 border-[#FF4D00]/20 text-white px-4 py-3 font-['Space_Grotesk'] uppercase text-sm placeholder:text-white/20 focus:border-[#FF4D00] focus:outline-none"
                />
                <button type="submit" disabled={submitting || !newComment.trim()}
                  className="bg-[#FF4D00] text-black w-12 h-12 flex items-center justify-center font-black disabled:opacity-30 hover:bg-[#00e3fd] transition-none">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            </div>
          </>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
