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
    <div style={{ width: 300, height: 300, position: 'relative', flexShrink: 0 }}>
      <svg
        viewBox="0 0 280 280"
        width="300"
        height="300"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        <defs>
          <radialGradient id="ww-bg-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#0EA5E9" stopOpacity="0.15" />
            <stop offset="55%"  stopColor="#003B46" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ww-sphere" cx="35%" cy="28%" r="65%">
            <stop offset="0%"   stopColor="#1B3D52" />
            <stop offset="40%"  stopColor="#0C1D2A" />
            <stop offset="100%" stopColor="#020A0F" />
          </radialGradient>
          <radialGradient id="ww-sphere-edge" cx="50%" cy="50%" r="50%">
            <stop offset="72%"  stopColor="#0EA5E9" stopOpacity="0" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.28" />
          </radialGradient>
          <filter id="ww-node-glow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ww-core-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient background glow */}
        <circle cx="140" cy="140" r="128" fill="url(#ww-bg-glow)" className="ww-glow-breathe" />

        {/* Outer orbit ring — CCW */}
        <g className="ww-orbit-1">
          <ellipse cx="140" cy="140" rx="120" ry="36"
            fill="none" stroke="#0EA5E9" strokeWidth="0.55" strokeOpacity="0.22" />
          <circle cx="260" cy="140" r="3.5" fill="#0EA5E9" filter="url(#ww-node-glow)" />
          <circle cx="20"  cy="140" r="2.5" fill="#7DDCFF" fillOpacity="0.75" filter="url(#ww-node-glow)" />
        </g>

        {/* Middle orbit ring — CW */}
        <g className="ww-orbit-2">
          <ellipse cx="140" cy="140" rx="96" ry="29"
            fill="none" stroke="#7DDCFF" strokeWidth="0.5" strokeOpacity="0.18" />
          <circle cx="236" cy="140" r="3"   fill="#7DDCFF" fillOpacity="0.80" filter="url(#ww-node-glow)" />
          <circle cx="44"  cy="140" r="2"   fill="#0EA5E9" fillOpacity="0.60" filter="url(#ww-node-glow)" />
        </g>

        {/* Inner orbit ring — CW faster */}
        <g className="ww-orbit-3">
          <ellipse cx="140" cy="140" rx="70" ry="21"
            fill="none" stroke="#0EA5E9" strokeWidth="0.45" strokeOpacity="0.30" />
          <circle cx="210" cy="140" r="2.5" fill="#0EA5E9" fillOpacity="0.70" filter="url(#ww-node-glow)" />
        </g>

        {/* Core glow behind sphere */}
        <circle cx="140" cy="140" r="52" fill="#0B3040" className="ww-orb-pulse" filter="url(#ww-core-glow)" />

        {/* Core sphere body */}
        <circle cx="140" cy="140" r="48" fill="url(#ww-sphere)" />

        {/* Sphere edge rim light */}
        <circle cx="140" cy="140" r="48" fill="url(#ww-sphere-edge)" />

        {/* Specular highlight */}
        <ellipse cx="126" cy="122" rx="16" ry="11" fill="#7DDCFF" fillOpacity="0.055" />

        {/* Inner ring details on sphere surface */}
        <circle cx="140" cy="140" r="34" fill="none"
          stroke="#0EA5E9" strokeWidth="0.4" strokeOpacity="0.18" strokeDasharray="4 8" />
        <circle cx="140" cy="140" r="20" fill="none"
          stroke="#7DDCFF" strokeWidth="0.3" strokeOpacity="0.14" />

        {/* Central core dot */}
        <circle cx="140" cy="140" r="4" fill="#0EA5E9" fillOpacity="0.65" filter="url(#ww-node-glow)" />
        <circle cx="140" cy="140" r="2" fill="#7DDCFF" />

        {/* Axis crosshair on sphere */}
        <line x1="140" y1="93"  x2="140" y2="187"
          stroke="#0EA5E9" strokeWidth="0.3" strokeOpacity="0.10" />
        <line x1="93"  y1="140" x2="187" y2="140"
          stroke="#0EA5E9" strokeWidth="0.3" strokeOpacity="0.10" />

        {/* Corner data nodes */}
        <g opacity="0.65">
          <rect x="36" y="44" width="9" height="9" rx="2"
            fill="#071011" stroke="#0EA5E9" strokeWidth="0.8" />
          <line x1="45" y1="48" x2="97" y2="99"
            stroke="#0EA5E9" strokeWidth="0.4" strokeOpacity="0.22" strokeDasharray="2 7" />
        </g>
        <g opacity="0.50">
          <rect x="234" y="44" width="9" height="9" rx="2"
            fill="#071011" stroke="#7DDCFF" strokeWidth="0.8" />
          <line x1="234" y1="48" x2="183" y2="99"
            stroke="#7DDCFF" strokeWidth="0.4" strokeOpacity="0.18" strokeDasharray="2 7" />
        </g>
        <g opacity="0.50">
          <rect x="234" y="226" width="9" height="9" rx="2"
            fill="#071011" stroke="#0EA5E9" strokeWidth="0.8" />
          <line x1="234" y1="226" x2="183" y2="181"
            stroke="#0EA5E9" strokeWidth="0.4" strokeOpacity="0.18" strokeDasharray="2 7" />
        </g>
        <g opacity="0.45">
          <rect x="36" y="226" width="9" height="9" rx="2"
            fill="#071011" stroke="#7DDCFF" strokeWidth="0.8" />
          <line x1="45" y1="230" x2="97" y2="181"
            stroke="#7DDCFF" strokeWidth="0.4" strokeOpacity="0.16" strokeDasharray="2 7" />
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

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px_1fr] gap-12 lg:gap-8 xl:gap-12 items-center">

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

        {/* Center: 3D automation orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
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
              <div className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center group-hover:text-accent-cyan group-hover:border-accent-cyan/30" style={{ background: '#101820', border: '1px solid rgba(255,255,255,0.10)', color: '#94A3B8', transition: 'color 250ms, border-color 250ms' }}>
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
