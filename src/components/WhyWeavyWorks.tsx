import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Scaling, Target } from 'lucide-react'
import { DiagonalLinesBg } from './ui/grid-background'

const features = [
  {
    icon: <CheckCircle2 className="w-5 h-5" />,
    title: 'End-to-end ownership',
    description:
      'We handle the strategy, the code, the integrations, and the maintenance. You just get the results.',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Async-first delivery',
    description:
      'No unnecessary meetings. We communicate via Slack and Loom, delivering updates while you sleep.',
  },
  {
    icon: <Scaling className="w-5 h-5" />,
    title: 'Built for scale from day one',
    description:
      'Our architectures are designed to handle 10× your current volume without breaking a sweat.',
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Results-obsessed',
    description:
      "We tie our success to your metrics. If a system isn't saving you time or making you money, we rebuild it.",
  },
]

/* ─────────────────────────────────────────────────────────
   AutomationOrb
   Premium SVG glass-sphere with three orbit rings and
   animateMotion traveling data dots.
   ViewBox 0 0 380 380, centre (190, 190).
───────────────────────────────────────────────────────── */
function AutomationOrb() {
  return (
    <div
      className="w-full mx-auto"
      style={{ maxWidth: 340, aspectRatio: '1' }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 380 380"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Ambient glow */}
          <radialGradient id="ww3-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#0EA5E9" stopOpacity="0.12" />
            <stop offset="48%"  stopColor="#003B46" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Glass-sphere body — 7-stop gradient */}
          <radialGradient id="ww3-sphere" cx="34%" cy="27%" r="72%">
            <stop offset="0%"   stopColor="#224668" />
            <stop offset="14%"  stopColor="#163452" />
            <stop offset="32%"  stopColor="#0D2038" />
            <stop offset="52%"  stopColor="#081626" />
            <stop offset="72%"  stopColor="#050E1A" />
            <stop offset="88%"  stopColor="#030A12" />
            <stop offset="100%" stopColor="#010609" />
          </radialGradient>

          {/* Rim edge glow */}
          <radialGradient id="ww3-rim" cx="50%" cy="50%" r="50%">
            <stop offset="64%"  stopColor="#0EA5E9" stopOpacity="0"    />
            <stop offset="88%"  stopColor="#0EA5E9" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#7DDCFF" stopOpacity="0.16" />
          </radialGradient>

          {/* Front-face glass reflection */}
          <radialGradient id="ww3-reflect" cx="42%" cy="38%" r="58%">
            <stop offset="0%"   stopColor="#7DDCFF" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#7DDCFF" stopOpacity="0"    />
          </radialGradient>

          {/* Traveling-dot glow filter */}
          <filter id="ww3-dot" x="-400%" y="-400%" width="900%" height="900%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Core halo filter */}
          <filter id="ww3-halo" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="18" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Inner-shadow depth filter */}
          <filter id="ww3-shadow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        {/* ── Ambient glow ── */}
        <circle cx="190" cy="190" r="176" fill="url(#ww3-bg)" className="ww3-glow-breathe" />

        {/* ── Orbit 1 — nearly flat, CCW, 2 dots ── */}
        <g>
          <ellipse cx="190" cy="190" rx="152" ry="46"
            fill="none" stroke="#0EA5E9" strokeWidth="0.6" strokeOpacity="0.22"
            strokeDasharray="3 10" />
          <circle r="3.5" fill="#0EA5E9" className="ww3-traveling-dot" filter="url(#ww3-dot)">
            <animateMotion dur="16s" repeatCount="indefinite"
              path="M342,190 A152,46 0 1,0 38,190 A152,46 0 1,0 342,190" />
          </circle>
          <circle r="2.2" fill="#7DDCFF" className="ww3-traveling-dot" filter="url(#ww3-dot)">
            <animateMotion dur="16s" begin="-8s" repeatCount="indefinite"
              path="M342,190 A152,46 0 1,0 38,190 A152,46 0 1,0 342,190" />
          </circle>
        </g>

        {/* ── Orbit 2 — tilted 62°, CW, 2 dots ── */}
        <g transform="rotate(62 190 190)">
          <ellipse cx="190" cy="190" rx="118" ry="36"
            fill="none" stroke="#7DDCFF" strokeWidth="0.5" strokeOpacity="0.18"
            strokeDasharray="2 8" />
          <circle r="3" fill="#7DDCFF" className="ww3-traveling-dot" filter="url(#ww3-dot)">
            <animateMotion dur="12s" repeatCount="indefinite"
              path="M308,190 A118,36 0 1,1 72,190 A118,36 0 1,1 308,190" />
          </circle>
          <circle r="2" fill="#0EA5E9" className="ww3-traveling-dot" filter="url(#ww3-dot)">
            <animateMotion dur="12s" begin="-6s" repeatCount="indefinite"
              path="M308,190 A118,36 0 1,1 72,190 A118,36 0 1,1 308,190" />
          </circle>
        </g>

        {/* ── Orbit 3 — tilted −38°, CCW, 1 dot ── */}
        <g transform="rotate(-38 190 190)">
          <ellipse cx="190" cy="190" rx="84" ry="26"
            fill="none" stroke="#0EA5E9" strokeWidth="0.5" strokeOpacity="0.30"
            strokeDasharray="3 6" />
          <circle r="2.8" fill="#0EA5E9" className="ww3-traveling-dot" filter="url(#ww3-dot)">
            <animateMotion dur="8s" repeatCount="indefinite"
              path="M274,190 A84,26 0 1,0 106,190 A84,26 0 1,0 274,190" />
          </circle>
        </g>

        {/* ── Sphere: halo (behind body) ── */}
        <circle cx="190" cy="190" r="80" fill="#082840" className="ww3-orb-pulse" filter="url(#ww3-halo)" />

        {/* ── Sphere: inner-shadow depth layer ── */}
        <circle cx="204" cy="208" r="56" fill="#010609" opacity="0.55" filter="url(#ww3-shadow)" />

        {/* ── Sphere: glass body ── */}
        <circle cx="190" cy="190" r="72" fill="url(#ww3-sphere)" />

        {/* ── Sphere: rim light ── */}
        <circle cx="190" cy="190" r="72" fill="url(#ww3-rim)" />

        {/* ── Sphere: front-face glass reflection ── */}
        <ellipse cx="172" cy="164" rx="34" ry="24" fill="url(#ww3-reflect)" />

        {/* ── Sphere: equatorial band ── */}
        <ellipse cx="190" cy="190" rx="72" ry="16"
          fill="none" stroke="#0EA5E9" strokeWidth="0.5" strokeOpacity="0.16" />

        {/* ── Sphere: surface detail rings ── */}
        <circle cx="190" cy="190" r="54"
          fill="none" stroke="#0EA5E9" strokeWidth="0.4" strokeOpacity="0.14" strokeDasharray="4 10" />
        <circle cx="190" cy="190" r="36"
          fill="none" stroke="#7DDCFF" strokeWidth="0.3" strokeOpacity="0.11" />
        <circle cx="190" cy="190" r="20"
          fill="none" stroke="#0EA5E9" strokeWidth="0.3" strokeOpacity="0.09" />

        {/* ── Sphere: axis lines ── */}
        <line x1="190" y1="120" x2="190" y2="260" stroke="#0EA5E9" strokeWidth="0.3" strokeOpacity="0.11" />
        <line x1="120" y1="190" x2="260" y2="190" stroke="#0EA5E9" strokeWidth="0.3" strokeOpacity="0.11" />

        {/* ── Sphere: specular highlights ── */}
        <ellipse cx="168" cy="158" rx="23" ry="16" fill="#7DDCFF" fillOpacity="0.065" />
        <ellipse cx="160" cy="150" rx="10" ry="7"  fill="#7DDCFF" fillOpacity="0.045" />
        <ellipse cx="155" cy="145" rx="4"  ry="3"  fill="#FFFFFF"  fillOpacity="0.06"  />

        {/* ── Sphere: central core dot ── */}
        <circle cx="190" cy="190" r="6.5" fill="#0EA5E9" fillOpacity="0.72" filter="url(#ww3-dot)" />
        <circle cx="190" cy="190" r="3.2" fill="#7DDCFF" />
        <circle cx="190" cy="190" r="1.2" fill="#FFFFFF" />

        {/* ── Connection whiskers ── */}
        <line x1="38"  y1="190" x2="0"   y2="190"
          stroke="#0EA5E9" strokeWidth="0.45" strokeOpacity="0.15" strokeDasharray="2 5" />
        <line x1="342" y1="190" x2="380" y2="190"
          stroke="#0EA5E9" strokeWidth="0.45" strokeOpacity="0.15" strokeDasharray="2 5" />

        {/* ── Corner data nodes ── */}
        <g opacity="0.62">
          <rect x="22" y="22" width="12" height="12" rx="3"
            fill="#071011" stroke="#0EA5E9" strokeWidth="0.9" />
          <line x1="34"  y1="28"  x2="123" y2="123"
            stroke="#0EA5E9" strokeWidth="0.35" strokeOpacity="0.22" strokeDasharray="2 8" />
        </g>
        <g opacity="0.50">
          <rect x="346" y="22" width="12" height="12" rx="3"
            fill="#071011" stroke="#7DDCFF" strokeWidth="0.9" />
          <line x1="346" y1="28"  x2="257" y2="123"
            stroke="#7DDCFF" strokeWidth="0.35" strokeOpacity="0.18" strokeDasharray="2 8" />
        </g>
        <g opacity="0.50">
          <rect x="346" y="346" width="12" height="12" rx="3"
            fill="#071011" stroke="#0EA5E9" strokeWidth="0.9" />
          <line x1="346" y1="346" x2="257" y2="257"
            stroke="#0EA5E9" strokeWidth="0.35" strokeOpacity="0.18" strokeDasharray="2 8" />
        </g>
        <g opacity="0.44">
          <rect x="22" y="346" width="12" height="12" rx="3"
            fill="#071011" stroke="#7DDCFF" strokeWidth="0.9" />
          <line x1="34"  y1="352" x2="123" y2="257"
            stroke="#7DDCFF" strokeWidth="0.35" strokeOpacity="0.16" strokeDasharray="2 8" />
        </g>
      </svg>
    </div>
  )
}

export default function WhyWeavyWorks() {
  return (
    <section
      className="py-32 px-6 relative overflow-hidden bg-background"
      aria-label="Why Weavy Works"
    >
      {/* Top blend */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '220px',
          background: 'linear-gradient(to bottom, #071011 0%, rgba(7,16,17,0.65) 40%, rgba(7,16,17,0.2) 72%, transparent 100%)',
          pointerEvents: 'none', zIndex: 10,
        }}
      />

      <DiagonalLinesBg />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(0 0% 100% / 0.045) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      {/* Upper-left cyan glow */}
      <div className="absolute pointer-events-none" aria-hidden="true"
        style={{
          top: '-15%', left: '-8%', width: '60%', height: '72%',
          background: 'radial-gradient(ellipse at center, hsl(199 89% 58% / 0.07) 0%, hsl(210 80% 35% / 0.04) 40%, transparent 68%)',
        }}
      />

      {/* Lower-right glow */}
      <div className="absolute pointer-events-none" aria-hidden="true"
        style={{
          bottom: '-10%', right: '-5%', width: '50%', height: '60%',
          background: 'radial-gradient(ellipse at center, hsl(180 55% 28% / 0.055) 0%, transparent 65%)',
        }}
      />

      {/* Depth overlay */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{
          background: 'linear-gradient(148deg, hsl(210 35% 7% / 0.38) 0%, transparent 45%, hsl(180 30% 5% / 0.22) 100%)',
        }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{
          opacity: 0.022,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)'/%3E%3C/svg%3E\")",
          backgroundSize: '256px 256px',
        }}
      />

      {/* ── 3-column grid ── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px_1fr] gap-12 lg:gap-6 xl:gap-10 items-center">

        {/* Left: heading */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-label text-xs uppercase tracking-widest text-accent-cyan/70 mb-5"
          >
            Why Weavy Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-primary"
          >
            Built with{' '}
            <span className="font-serif italic text-accent-cyan">strategy</span>,
            powered by automation.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="font-body mt-6 text-lg font-normal max-w-md"
            style={{ color: '#CBD5E1', lineHeight: 1.75 }}
          >
            We operate differently than traditional agencies. We are an extension
            of your team, focused purely on leverage.
          </motion.p>
        </div>

        {/* Centre: automation orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.86 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center py-6 lg:py-0"
        >
          <AutomationOrb />
        </motion.div>

        {/* Right: feature rows */}
        <div className="flex flex-col gap-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="feature-card group flex gap-5 p-6 rounded-2xl w-full"
              style={{
                transition: 'background-color 250ms, border-color 250ms, box-shadow 250ms',
                background: 'rgba(8,30,38,0.45)',
                border: '1px solid rgba(77,196,225,0.28)',
                boxShadow: '0 0 20px rgba(77,196,225,0.06)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(9,27,36,0.75)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(125,220,255,0.34)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(125,220,255,0.09)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(8,30,38,0.45)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(77,196,225,0.28)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(77,196,225,0.06)'
              }}
            >
              <div
                className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(6,22,30,0.9)', border: '1px solid rgba(125,220,255,0.30)', color: '#7DDCFF', boxShadow: '0 0 16px rgba(125,220,255,0.13)', transition: 'color 250ms, border-color 250ms, box-shadow 250ms' }}
              >
                {feature.icon}
              </div>
              <div>
                <h3 className="font-heading text-xl font-medium tracking-tight mb-2" style={{ color: '#F8FAFC' }}>
                  {feature.title}
                </h3>
                <p className="font-body font-normal leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.75 }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Bottom blend */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '380px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(1,7,9,0.14) 24%, rgba(1,7,9,0.50) 50%, rgba(1,7,9,0.86) 75%, #010709 100%)',
          pointerEvents: 'none', zIndex: 10,
        }}
      />
    </section>
  )
}
