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

function AutomationOrb() {
  return (
    <div
      className="w-full mx-auto"
      style={{ maxWidth: 320, aspectRatio: '1' }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 360 360"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="ww2-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#0EA5E9" stopOpacity="0.13" />
            <stop offset="55%"  stopColor="#003B46" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ww2-sphere" cx="32%" cy="26%" r="70%">
            <stop offset="0%"   stopColor="#1C4060" />
            <stop offset="30%"  stopColor="#0E2235" />
            <stop offset="68%"  stopColor="#060F18" />
            <stop offset="100%" stopColor="#020810" />
          </radialGradient>
          <radialGradient id="ww2-rim" cx="50%" cy="50%" r="50%">
            <stop offset="68%"  stopColor="#0EA5E9" stopOpacity="0" />
            <stop offset="92%"  stopColor="#0EA5E9" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#7DDCFF" stopOpacity="0.14" />
          </radialGradient>
          <filter id="ww2-dot-glow" x="-400%" y="-400%" width="900%" height="900%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ww2-core-glow" x="-55%" y="-55%" width="210%" height="210%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient background glow */}
        <circle cx="180" cy="180" r="162" fill="url(#ww2-bg)" className="ww2-glow-breathe" />

        {/* ── Orbit 1: nearly flat, CCW dots ── */}
        <g>
          <ellipse cx="180" cy="180" rx="148" ry="44"
            fill="none" stroke="#0EA5E9" strokeWidth="0.55" strokeOpacity="0.20"
            strokeDasharray="3 9" />
          {/* dot A */}
          <circle r="3" fill="#0EA5E9" className="ww2-traveling-dot" filter="url(#ww2-dot-glow)">
            <animateMotion dur="15s" repeatCount="indefinite"
              path="M328,180 A148,44 0 1,0 32,180 A148,44 0 1,0 328,180" />
          </circle>
          {/* dot B — staggered half-lap */}
          <circle r="2" fill="#7DDCFF" className="ww2-traveling-dot" filter="url(#ww2-dot-glow)">
            <animateMotion dur="15s" begin="-7.5s" repeatCount="indefinite"
              path="M328,180 A148,44 0 1,0 32,180 A148,44 0 1,0 328,180" />
          </circle>
        </g>

        {/* ── Orbit 2: tilted 65°, CW dots ── */}
        <g transform="rotate(65 180 180)">
          <ellipse cx="180" cy="180" rx="112" ry="34"
            fill="none" stroke="#7DDCFF" strokeWidth="0.5" strokeOpacity="0.17"
            strokeDasharray="2 7" />
          {/* dot A */}
          <circle r="2.5" fill="#7DDCFF" className="ww2-traveling-dot" filter="url(#ww2-dot-glow)">
            <animateMotion dur="11s" repeatCount="indefinite"
              path="M292,180 A112,34 0 1,1 68,180 A112,34 0 1,1 292,180" />
          </circle>
          {/* dot B */}
          <circle r="1.8" fill="#0EA5E9" className="ww2-traveling-dot" filter="url(#ww2-dot-glow)">
            <animateMotion dur="11s" begin="-5.5s" repeatCount="indefinite"
              path="M292,180 A112,34 0 1,1 68,180 A112,34 0 1,1 292,180" />
          </circle>
        </g>

        {/* ── Orbit 3: tilted −40°, fastest CCW ── */}
        <g transform="rotate(-40 180 180)">
          <ellipse cx="180" cy="180" rx="78" ry="24"
            fill="none" stroke="#0EA5E9" strokeWidth="0.5" strokeOpacity="0.28"
            strokeDasharray="3 6" />
          {/* dot */}
          <circle r="2.5" fill="#0EA5E9" className="ww2-traveling-dot" filter="url(#ww2-dot-glow)">
            <animateMotion dur="7.5s" repeatCount="indefinite"
              path="M258,180 A78,24 0 1,0 102,180 A78,24 0 1,0 258,180" />
          </circle>
        </g>

        {/* Core sphere glow */}
        <circle cx="180" cy="180" r="65" fill="#082840" className="ww2-orb-pulse" filter="url(#ww2-core-glow)" />

        {/* Core sphere body */}
        <circle cx="180" cy="180" r="55" fill="url(#ww2-sphere)" />

        {/* Sphere rim light */}
        <circle cx="180" cy="180" r="55" fill="url(#ww2-rim)" />

        {/* Equatorial band — depth illusion */}
        <ellipse cx="180" cy="180" rx="55" ry="13"
          fill="none" stroke="#0EA5E9" strokeWidth="0.4" strokeOpacity="0.15" />

        {/* Inner dashed ring details on sphere surface */}
        <circle cx="180" cy="180" r="40" fill="none"
          stroke="#0EA5E9" strokeWidth="0.4" strokeOpacity="0.16" strokeDasharray="4 10" />
        <circle cx="180" cy="180" r="26" fill="none"
          stroke="#7DDCFF" strokeWidth="0.3" strokeOpacity="0.12" />

        {/* Specular highlight */}
        <ellipse cx="161" cy="158" rx="19" ry="13" fill="#7DDCFF" fillOpacity="0.055" />
        <ellipse cx="154" cy="152" rx="6"  ry="4"  fill="#FFFFFF" fillOpacity="0.038" />

        {/* Axis crosshair on sphere */}
        <line x1="180" y1="126" x2="180" y2="234" stroke="#0EA5E9" strokeWidth="0.3" strokeOpacity="0.10" />
        <line x1="126" y1="180" x2="234" y2="180" stroke="#0EA5E9" strokeWidth="0.3" strokeOpacity="0.10" />

        {/* Central core dot */}
        <circle cx="180" cy="180" r="5"   fill="#0EA5E9" fillOpacity="0.70" filter="url(#ww2-dot-glow)" />
        <circle cx="180" cy="180" r="2.5" fill="#7DDCFF" />

        {/* Connection whiskers toward left / right edges */}
        <line x1="32"  y1="180" x2="0"   y2="180" stroke="#0EA5E9" strokeWidth="0.4" strokeOpacity="0.16" strokeDasharray="2 5" />
        <line x1="328" y1="180" x2="360" y2="180" stroke="#0EA5E9" strokeWidth="0.4" strokeOpacity="0.16" strokeDasharray="2 5" />

        {/* Corner data nodes */}
        <g opacity="0.60">
          <rect x="28" y="28" width="11" height="11" rx="2.5" fill="#071011" stroke="#0EA5E9" strokeWidth="0.9" />
          <line x1="39" y1="33" x2="129" y2="128" stroke="#0EA5E9" strokeWidth="0.35" strokeOpacity="0.20" strokeDasharray="2 8" />
        </g>
        <g opacity="0.48">
          <rect x="321" y="28" width="11" height="11" rx="2.5" fill="#071011" stroke="#7DDCFF" strokeWidth="0.9" />
          <line x1="321" y1="33" x2="231" y2="128" stroke="#7DDCFF" strokeWidth="0.35" strokeOpacity="0.17" strokeDasharray="2 8" />
        </g>
        <g opacity="0.48">
          <rect x="321" y="321" width="11" height="11" rx="2.5" fill="#071011" stroke="#0EA5E9" strokeWidth="0.9" />
          <line x1="321" y1="321" x2="231" y2="232" stroke="#0EA5E9" strokeWidth="0.35" strokeOpacity="0.17" strokeDasharray="2 8" />
        </g>
        <g opacity="0.42">
          <rect x="28" y="321" width="11" height="11" rx="2.5" fill="#071011" stroke="#7DDCFF" strokeWidth="0.9" />
          <line x1="39" y1="326" x2="129" y2="232" stroke="#7DDCFF" strokeWidth="0.35" strokeOpacity="0.15" strokeDasharray="2 8" />
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
      {/* Top blend — continues from SystemsShowcase boundary */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '220px',
          background: 'linear-gradient(to bottom, #071011 0%, rgba(7,16,17,0.65) 40%, rgba(7,16,17,0.2) 72%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* Diagonal lines atmospheric layer */}
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

      {/* Cyan/teal radial glow — upper left */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-15%',
          left: '-8%',
          width: '60%',
          height: '72%',
          background:
            'radial-gradient(ellipse at center, hsl(199 89% 58% / 0.07) 0%, hsl(210 80% 35% / 0.04) 40%, transparent 68%)',
        }}
        aria-hidden="true"
      />

      {/* Blue-green glow — lower right */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-10%',
          right: '-5%',
          width: '50%',
          height: '60%',
          background:
            'radial-gradient(ellipse at center, hsl(180 55% 28% / 0.055) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      {/* Dark charcoal gradient depth layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(148deg, hsl(210 35% 7% / 0.38) 0%, transparent 45%, hsl(180 30% 5% / 0.22) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Cinematic noise texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.022,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)'/%3E%3C/svg%3E\")",
          backgroundSize: '256px 256px',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px_1fr] gap-12 lg:gap-8 xl:gap-12 items-center">

        {/* Left: heading */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs uppercase tracking-widest text-accent-cyan/70 mb-5"
          >
            Why Weavy Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tighter text-primary"
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
            className="mt-6 text-lg font-medium max-w-md"
            style={{ color: '#CBD5E1', lineHeight: 1.75 }}
          >
            We operate differently than traditional agencies. We are an extension
            of your team, focused purely on leverage.
          </motion.p>
        </div>

        {/* Center: automation orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
              className="feature-card group flex gap-5 p-6 rounded-2xl border border-transparent"
              style={{
                transition: 'background-color 250ms, border-color 250ms',
                background: 'transparent',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(16,24,32,0.7)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
              }}
            >
              <div
                className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center group-hover:text-accent-cyan group-hover:border-accent-cyan/30"
                style={{ background: '#101820', border: '1px solid rgba(255,255,255,0.10)', color: '#94A3B8', transition: 'color 250ms, border-color 250ms' }}
              >
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-medium tracking-tight mb-2 text-primary">
                  {feature.title}
                </h3>
                <p className="font-medium leading-relaxed" style={{ color: '#CBD5E1', lineHeight: 1.75 }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Bottom blend — dissolves atmospheric overlays before section boundary */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '380px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(1,7,9,0.14) 24%, rgba(1,7,9,0.50) 50%, rgba(1,7,9,0.86) 75%, #010709 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </section>
  )
}
