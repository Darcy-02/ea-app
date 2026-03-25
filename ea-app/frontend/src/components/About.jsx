import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] md:pl-0">
      {/* Hero — The Name */}
      <section className="relative overflow-hidden py-20 px-6 sm:px-12 lg:px-20">
        <div className="absolute inset-0 halftone-overlay opacity-10 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-['Space_Grotesk'] font-black uppercase text-sm tracking-[0.3em] text-[#00e3fd] mb-4"
          >
            ABOUT US
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="font-['Space_Grotesk'] font-black uppercase text-5xl sm:text-7xl tracking-tighter italic text-[#FF4D00] leading-none mb-6"
          >
            HOW CAN ART<br />BE EMPTY?
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3 }}
            className="h-1 w-40 bg-[#FF4D00] origin-left mb-8"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/70 text-lg sm:text-xl max-w-2xl leading-relaxed font-['Space_Grotesk']"
          >
            That curiosity is the starting point. Even the name <span className="text-[#FF4D00] font-bold">Empty Art</span> makes
            you wonder. And that's exactly the point — this platform forces interaction,
            pushes you to ask questions, and challenges you to see art not as a finished
            object but as a <span className="text-[#00e3fd] font-bold">living experience</span>.
          </motion.p>
        </div>
      </section>

      {/* Mission — Personal voice */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 border-t-4 border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Space_Grotesk'] font-black uppercase text-3xl sm:text-4xl tracking-tighter text-white mb-8">
            MY MISSION
          </h2>
          <div className="bg-[#0e0e0e] border-4 border-[#FF4D00] p-8 sm:p-12 shadow-[8px_8px_0px_0px_#00e3fd]">
            <p className="text-white/80 text-lg leading-relaxed font-['Space_Grotesk'] mb-6">
              My mission is to create an interactive application that shows within an artist's soul.
              Here, you are going to witness artworks and engage with the creative process behind them.
              The main purpose isn't just to understand the journey of an artist, but to help you
              find <span className="text-[#00e3fd] font-bold">your own creative voice</span>.
            </p>
            <p className="text-white/80 text-lg leading-relaxed font-['Space_Grotesk']">
              The goal is to show that art is not just a job or a finished product —
              it is <span className="text-[#FF4D00] font-bold">identity</span>, and a tool for self-expression.
            </p>
          </div>
          <p className="text-white/40 text-sm font-['Space_Grotesk'] mt-4 uppercase tracking-wider">
            — Mbanza Teta Darcy, Founder
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 border-t-4 border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Space_Grotesk'] font-black uppercase text-3xl sm:text-4xl tracking-tighter text-white mb-8">
            THE PROBLEM WE SEE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0e0e0e] border-2 border-[#1a1a1a] p-8 hover:border-[#FF4D00] transition-colors"
            >
              <span className="material-symbols-outlined text-4xl text-[#FF4D00] mb-4 block">visibility_off</span>
              <h3 className="font-['Space_Grotesk'] font-black uppercase text-xl text-[#00e3fd] tracking-wider mb-3">
                CONSUMPTION OVER CREATION
              </h3>
              <p className="text-white/60 leading-relaxed font-['Space_Grotesk']">
                The youth admire art but can't find ways to engage with it in a meaningful way.
                Education systems focus on consumption over creation, making the youth appreciate
                art as something to observe or own — never to question or create.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0e0e0e] border-2 border-[#1a1a1a] p-8 hover:border-[#FF4D00] transition-colors"
            >
              <span className="material-symbols-outlined text-4xl text-[#FF4D00] mb-4 block">help</span>
              <h3 className="font-['Space_Grotesk'] font-black uppercase text-xl text-[#00e3fd] tracking-wider mb-3">
                CURIOSITY WITHOUT GUIDANCE
              </h3>
              <p className="text-white/60 leading-relaxed font-['Space_Grotesk']">
                The youth across Africa are curious, but a lack of guidance is killing their
                ability to be creative. They observe and admire, but never ask <em>why</em> a
                particular artwork was made or <em>how</em> — yet they interact with art every day.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0e0e0e] border-2 border-[#1a1a1a] p-8 hover:border-[#FF4D00] transition-colors md:col-span-2"
            >
              <span className="material-symbols-outlined text-4xl text-[#FF4D00] mb-4 block">warning</span>
              <p className="text-white/60 leading-relaxed font-['Space_Grotesk'] text-lg">
                Art is everywhere — schools, galleries, and social media — but it remains
                without change if the youth don't stop and wonder <span className="text-[#FF4D00] font-bold">"why?"</span> or <span className="text-[#FF4D00] font-bold">"how?"</span>.
                As long as these youth think that art is for others or too difficult to engage with,
                we have failed as a community in aspects of self-expression and creativity.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* African Context */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 border-t-4 border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Space_Grotesk'] font-black uppercase text-3xl sm:text-4xl tracking-tighter text-white mb-8">
            WHY THIS MATTERS IN AFRICA
          </h2>
          <div className="bg-[#0e0e0e] border-l-4 border-[#00e3fd] p-8 sm:p-12">
            <p className="text-white/80 text-lg leading-relaxed font-['Space_Grotesk'] mb-6">
              In many African societies, art is seen as a tool to fill space — decoration.
              In education, we are supposed to consume knowledge instead of creating, asking
              questions, or expressing ourselves. Creativity is seen as <span className="text-[#FF4D00] font-bold italic">extra</span>,
              <span className="text-[#FF4D00] font-bold italic"> too much</span>.
            </p>
            <p className="text-white/80 text-lg leading-relaxed font-['Space_Grotesk'] mb-6">
              As a result, many people grow up disconnected from their own creativity, thinking
              that art is something they aren't a part of — instead of something that
              <span className="text-[#00e3fd] font-bold"> lives inside them</span>.
            </p>
            <p className="text-white/80 text-lg leading-relaxed font-['Space_Grotesk']">
              I use technology to exhibit art as living rather than an object. This project
              challenges that mindset by proving that art is a human experience — it struggles,
              grows, and has an identity. This approach helps the Youth remember that art is
              not separate from who we are. <span className="text-[#FF4D00] font-bold">Art is us</span>,
              and this project is a bridge to that truth.
            </p>
          </div>
        </div>
      </section>

      {/* What you can do */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 border-t-4 border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Space_Grotesk'] font-black uppercase text-3xl sm:text-4xl tracking-tighter text-white mb-12">
            WHAT YOU CAN DO HERE
          </h2>
          <div className="flex flex-col sm:flex-row gap-6">
            {[
              { step: "01", icon: "search", title: "EXPLORE", desc: "Browse artworks uploaded by artists across the platform. See what moves you." },
              { step: "02", icon: "favorite", title: "INTERACT", desc: "Like, comment, and bookmark pieces that speak to you. Art was never meant to be silent." },
              { step: "03", icon: "group", title: "CONNECT", desc: "Follow artists. Build a personalized feed. Join a creative community." },
              { step: "04", icon: "brush", title: "CREATE", desc: "Upload your own artworks with titles and descriptions that tell your story." },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i }}
                className="flex-1 text-center p-6 bg-[#0e0e0e] border-2 border-[#1a1a1a] hover:border-[#FF4D00] transition-colors"
              >
                <span className="font-['Space_Grotesk'] font-black text-5xl text-[#FF4D00]/20 block mb-1">
                  {s.step}
                </span>
                <span className="material-symbols-outlined text-3xl text-[#00e3fd] mb-3 block">{s.icon}</span>
                <h3 className="font-['Space_Grotesk'] font-black uppercase text-lg text-white tracking-widest mb-2">
                  {s.title}
                </h3>
                <p className="text-white/50 text-sm font-['Space_Grotesk']">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 sm:px-12 lg:px-20 border-t-4 border-[#1a1a1a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-['Space_Grotesk'] font-black uppercase text-4xl sm:text-5xl tracking-tighter italic text-white mb-4">
            THE CANVAS IS <span className="text-[#FF4D00]">EMPTY</span>.
          </h2>
          <p className="text-white/50 text-lg font-['Space_Grotesk'] mb-10">
            Fill it with something the world hasn't seen yet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/explore")}
              className="bg-[#FF4D00] text-black py-4 px-10 font-['Space_Grotesk'] font-black uppercase text-lg tracking-widest hover:bg-[#00e3fd] transition-all active:translate-y-1 border-2 border-black shadow-[4px_4px_0px_0px_#ffffff]"
            >
              EXPLORE THE VAULT
            </button>
            <button
              onClick={() => navigate("/upload")}
              className="border-4 border-[#FF4D00] text-[#FF4D00] py-4 px-10 font-['Space_Grotesk'] font-black uppercase text-lg tracking-widest hover:bg-[#FF4D00] hover:text-black transition-all"
            >
              DROP YOUR ART
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
