import React, { useState } from 'react'
import Title from './Title'
import { teamData } from '../assets/assets'
import { motion, useMotionValue, useTransform, AnimatePresence } from "motion/react"

const TeamCard = ({ team, index }) => {
  const [hovered, setHovered] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-80, 80], [12, -12])
  const rotateY = useTransform(x, [-80, 80], [-12, 12])
  const spotX   = useTransform(x, [-80, 80], [20, 80])
  const spotY   = useTransform(y, [-80, 80], [20, 80])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top  - rect.height / 2)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setHovered(false)
  }

  const accents = [
    'from-rose-400/30 to-orange-300/20',
    'from-cyan-400/30 to-blue-300/20',
    'from-violet-400/30 to-fuchsia-300/20',
    'from-emerald-400/30 to-teal-300/20',
    'from-amber-400/30 to-yellow-300/20',
    'from-pink-400/30 to-red-300/20',
  ]
  const accent = accents[index % accents.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      style={{ perspective: 800 }}
      className="cursor-pointer"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative rounded-2xl overflow-hidden group"
      >
        {/* Portrait image — tall gallery proportion */}
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl">
          <motion.img
            src={team.image}
            alt={team.name}
            className="w-full h-full object-cover object-top"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />

          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          {/* Color wash on hover */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${accent} mix-blend-screen`}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Spotlight that follows cursor */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: hovered
                ? `radial-gradient(circle 130px at 50% 40%, rgba(255,255,255,0.10), transparent 70%)`
                : `radial-gradient(circle 0px at 50% 50%, transparent, transparent)`
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Hover border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{
              boxShadow: hovered
                ? 'inset 0 0 0 1px rgba(255,255,255,0.25)'
                : 'inset 0 0 0 1px rgba(255,255,255,0)'
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Corner marks */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-white/30 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-white/30 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-[72px] left-3 w-5 h-5 border-b-2 border-l-2 border-white/30 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-[72px] right-3 w-5 h-5 border-b-2 border-r-2 border-white/30 rounded-br-sm pointer-events-none" />

          {/* Gallery index number */}
          <motion.span
            className="absolute top-4 right-4 text-[10px] font-mono text-white/35 tracking-widest pointer-events-none"
            animate={{ opacity: hovered ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {String(index + 1).padStart(2, '0')}
          </motion.span>

          {/* Name & role */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <motion.div animate={{ y: hovered ? -4 : 0 }} transition={{ duration: 0.3 }}>
              <h3 className="font-bold text-white text-base leading-tight tracking-tight drop-shadow-sm">
                {team.name}
              </h3>
              <p className="text-white/55 text-xs mt-0.5 tracking-widest uppercase font-medium">
                {team.title}
              </p>
            </motion.div>

            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22 }}
                  className="mt-2 pt-2 border-t border-white/15"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                    <span className="text-[10px] text-white/45 tracking-widest uppercase font-mono">
                      View Profile
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const Teams = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      transition={{ staggerChildren: 0.1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-10 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white"
    >
      <Title title="The Soul of Artists" desc="Empty Art is here for you to project your own internal feelings—sadness, tranquility, or chaos" />

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 w-full">
        {teamData.map((team, index) => (
          <TeamCard key={index} team={team} index={index} />
        ))}
      </div>
    </motion.div>
  )
}

export default Teams

