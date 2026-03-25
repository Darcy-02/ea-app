import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { api, getToken } from "../api";
import toast from "react-hot-toast";

const SHOWCASE = [
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1558522195-e1201b090344?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1584804738473-a49b7441c464?w=800&auto=format&fit=crop&q=60",
];

export default function Landing() {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) navigate("/feed", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const t = setInterval(() => setImgIdx((i) => (i + 1) % SHOWCASE.length), 4000);
    return () => clearInterval(t);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd);
    try {
      const endpoint = mode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const result = await api(endpoint, { method: "POST", body: data });
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.user.role);
      if (result.user.role === "admin") navigate("/admin");
      else navigate("/feed");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSignup = mode === "signup";

  return (
    <div className="min-h-screen flex bg-[#050505]">
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={imgIdx}
            src={SHOWCASE[imgIdx]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-125"
            alt=""
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="absolute inset-0 halftone-overlay opacity-30 pointer-events-none" />
        <div className="relative z-10 text-left px-16">
          <h1 className="font-['Space_Grotesk'] font-black uppercase tracking-tighter text-7xl text-[#FF4D00] italic leading-none mb-6 glitch-hover">
            EMPTY<br />ART
          </h1>
          <p className="font-['Space_Grotesk'] text-[#00e3fd] text-xl font-bold uppercase tracking-[0.2em]">
            THE DIGITAL UNDERGROUND
          </p>
          <p className="text-white/60 text-lg max-w-sm mt-4 leading-relaxed">
            Share your art. Discover raw talent. Join the resistance.
          </p>
          <div className="mt-8 h-1 w-32 bg-[#FF4D00]" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 halftone-overlay opacity-10 pointer-events-none" />
        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <h1 className="font-['Space_Grotesk'] font-black uppercase tracking-tighter text-4xl text-[#FF4D00] italic">
              EMPTY ART
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#0e0e0e] border-4 border-[#FF4D00] overflow-hidden shadow-[8px_8px_0px_0px_#00e3fd]"
          >
            <div className="flex border-b-4 border-[#1a1a1a]">
              {["login", "signup"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMode(tab)}
                  className={"flex-1 py-4 font-['Space_Grotesk'] font-black uppercase text-sm tracking-widest transition-all " +
                    (mode === tab ? "text-[#FF4D00] bg-[#1a1a1a] border-b-4 border-[#FF4D00]" : "text-white/40 hover:text-white/60")
                  }
                >
                  {tab === "signup" ? "ENLIST" : "ENTER"}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-6 p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: isSignup ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isSignup ? -20 : 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  {isSignup && (
                    <div>
                      <label className="font-['Space_Grotesk'] font-black uppercase text-xs tracking-widest text-[#00e3fd] mb-2 block">ALIAS</label>
                      <input name="username" placeholder="YOUR HANDLE..." required className="input-field" />
                    </div>
                  )}
                  <div>
                    <label className="font-['Space_Grotesk'] font-black uppercase text-xs tracking-widest text-[#00e3fd] mb-2 block">SIGNAL</label>
                    <input name="email" type="email" placeholder="YOUR EMAIL..." required className="input-field" />
                  </div>
                  <div>
                    <label className="font-['Space_Grotesk'] font-black uppercase text-xs tracking-widest text-[#00e3fd] mb-2 block">PASSKEY</label>
                    <input name="password" type="password" placeholder="YOUR SECRET..." required minLength={6} className="input-field" />
                  </div>
                </motion.div>
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF4D00] text-black py-4 font-['Space_Grotesk'] font-black uppercase text-xl tracking-widest hover:bg-[#00e3fd] transition-all active:translate-y-1 disabled:opacity-50 border-2 border-black shadow-[4px_4px_0px_0px_#ffffff]"
              >
                {loading ? "TRANSMITTING..." : isSignup ? "JOIN THE RESISTANCE" : "AUTHENTICATE"}
              </button>
            </form>

            <p className="pb-6 text-center text-sm text-white/40 font-['Space_Grotesk'] uppercase tracking-wider">
              {isSignup ? "Already enlisted?" : "Not a member?"}{" "}
              <button onClick={() => setMode(isSignup ? "login" : "signup")} className="text-[#FF4D00] font-black hover:underline">
                {isSignup ? "ENTER" : "ENLIST"}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
