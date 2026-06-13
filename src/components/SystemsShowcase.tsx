import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Bot, Workflow, MessageSquare, LineChart, ArrowRight, type LucideIcon } from 'lucide-react'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ─── Per-card colour tokens ───────────────────────────────────────────────────

interface ServiceDef {
  num: string
  Icon: LucideIcon
  title: string
  description: string
  accent: string        // solid hex
  gAlpha8: string       // glass fill
  gAlpha18: string      // border resting
  gAlpha35: string      // border hover
  gAlpha55: string      // top line / icon ring hover
  glowRgb: string       // box-shadow rgb triple
}

const SERVICES: ServiceDef[] = [
  {
    num: '01',
    Icon: Bot,
    title: 'AI Content Automation',
    description:
      'Auto-generate branded content at scale. We build custom LLM pipelines that understand your brand voice and output ready-to-publish assets.',
    accent:    '#38BDF8',
    gAlpha8:   'hsl(199 89% 60% / 0.08)',
    gAlpha18:  'hsl(199 89% 60% / 0.18)',
    gAlpha35:  'hsl(199 89% 60% / 0.35)',
    gAlpha55:  'hsl(199 89% 60% / 0.55)',
    glowRgb:   '56 189 248',
  },
  {
    num: '02',
    Icon: Workflow,
    title: 'Growth Systems',
    description:
      'Automated funnels, lead generation, and CRM workflows. Never let a lead slip through the cracks again with intelligent routing and follow-up.',
    accent:    '#22C55E',
    gAlpha8:   'hsl(142 71% 45% / 0.08)',
    gAlpha18:  'hsl(142 71% 45% / 0.18)',
    gAlpha35:  'hsl(142 71% 45% / 0.35)',
    gAlpha55:  'hsl(142 71% 45% / 0.55)',
    glowRgb:   '34 197 94',
  },
  {
    num: '03',
    Icon: MessageSquare,
    title: 'Communication AI',
    description:
      'Intelligent chatbots, email automation, and social scheduling. Provide 24/7 support and engagement without expanding your team.',
    accent:    '#A855F7',
    gAlpha8:   'hsl(270 91% 65% / 0.08)',
    gAlpha18:  'hsl(270 91% 65% / 0.18)',
    gAlpha35:  'hsl(270 91% 65% / 0.35)',
    gAlpha55:  'hsl(270 91% 65% / 0.55)',
    glowRgb:   '168 85 247',
  },
  {
    num: '04',
    Icon: LineChart,
    title: 'Brand Intelligence',
    description:
      'Live monitoring, analytics, and automated reporting. Real-time insights delivered directly to your Slack or inbox — automatically.',
    accent:    '#F59E0B',
    gAlpha8:   'hsl(38 92% 50% / 0.08)',
    gAlpha18:  'hsl(38 92% 50% / 0.18)',
    gAlpha35:  'hsl(38 92% 50% / 0.35)',
    gAlpha55:  'hsl(38 92% 50% / 0.55)',
    glowRgb:   '245 158 11',
  },
]

// Orbital node colour matches each card accent (top=01, right=02, bottom=03, left=04)
const ORB_NODES = [
  { deg: 0,   color: '#38BDF8' },
  { deg: 90,  color: '#22C55E' },
  { deg: 180, color: '#A855F7' },
  { deg: 270, color: '#F59E0B' },
]

// ─── Central orb ─────────────────────────────────────────────────────────────

function OrbCore() {
  const R_OUTER = 76   // px — outer ring radius
  const R_INNER = 52   // px — inner ring radius

  return (
    <div className="relative w-full h-full flex items-center justify-center">

      {/* Vertical data-path through center column */}
      <div
        className="absolute inset-x-1/2 top-0 bottom-0 w-px -translate-x-1/2 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, hsl(199 89% 60% / 0.14) 20%, hsl(199 89% 60% / 0.14) 80%, transparent 100%)',
        }}
      />

      {/* Horizontal data-path through center column */}
      <div
        className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, hsl(199 89% 60% / 0.22), hsl(199 89% 60% / 0.06) 45%, hsl(199 89% 60% / 0.06) 55%, hsl(199 89% 60% / 0.22))',
        }}
      />

      {/* Outer rotating ring */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width:  R_OUTER * 2 + 'px',
          height: R_OUTER * 2 + 'px',
          border: '1px solid hsl(0 0% 100% / 0.07)',
          animation: 'spin-slow 30s linear infinite',
        }}
      />

      {/* Inner counter-rotating ring */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width:  R_INNER * 2 + 'px',
          height: R_INNER * 2 + 'px',
          border: '1px dashed hsl(199 89% 60% / 0.2)',
          animation: 'orb-spin-ccw 20s linear infinite',
        }}
      />

      {/* 4 coloured orbital nodes on outer ring */}
      {ORB_NODES.map(({ deg, color }) => {
        const rad = ((deg - 90) * Math.PI) / 180
        return (
          <div
            key={deg}
            className="absolute rounded-full pointer-events-none"
            style={{
              width:  '7px',
              height: '7px',
              top:    `calc(50% + ${R_OUTER * Math.sin(rad)}px)`,
              left:   `calc(50% + ${R_OUTER * Math.cos(rad)}px)`,
              transform: 'translate(-50%, -50%)',
              background: color,
              boxShadow:  `0 0 8px ${color}, 0 0 16px ${color}66`,
            }}
          />
        )
      })}

      {/* Glowing core sphere */}
      <div
        className="relative rounded-full flex items-center justify-center pointer-events-none"
        style={{
          width:  '60px',
          height: '60px',
          background:
            'radial-gradient(circle, hsl(199 89% 60% / 0.22) 0%, hsl(210 85% 40% / 0.1) 55%, transparent 72%)',
          boxShadow:
            '0 0 28px hsl(199 89% 60% / 0.32),' +
            '0 0 56px hsl(199 89% 60% / 0.12),' +
            '0 0 96px hsl(199 89% 60% / 0.06)',
          animation: 'energy-core-breathe 3.2s ease-in-out infinite',
        }}
      >
        {/* Core dot */}
        <div
          className="rounded-full"
          style={{
            width:  '10px',
            height: '10px',
            background: '#38BDF8',
            boxShadow: '0 0 10px #38BDF8, 0 0 22px hsl(199 89% 60% / 0.6)',
          }}
        />
      </div>

      {/* "AI Core" label */}
      <div
        className="absolute pointer-events-none"
        style={{ top: 'calc(50% + 52px)' }}
      >
        <span
          className="block text-center uppercase tracking-[0.22em]"
          style={{ fontSize: '0.5rem', color: 'hsl(199 89% 60% / 0.45)' }}
        >
          AI Core
        </span>
      </div>

    </div>
  )
}

// ─── Individual architecture card ────────────────────────────────────────────

function ArchCard({
  svc,
  index,
  side,
}: {
  svc: ServiceDef
  index: number
  side: 'left' | 'right'
}) {
  const ref = useRef<HTMLDivElement>(null)

  const enter = () => {
    if (!ref.current) return
    ref.current.style.borderColor = svc.gAlpha35
    ref.current.style.boxShadow  = `0 0 48px rgb(${svc.glowRgb} / 0.1), inset 0 0 32px rgb(${svc.glowRgb} / 0.03)`
  }
  const leave = () => {
    if (!ref.current) return
    ref.current.style.borderColor = svc.gAlpha18
    ref.current.style.boxShadow   = ''
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: side === 'left' ? -28 : 28, y: 12 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.72, delay: index * 0.1, ease: E }}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className="group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full"
      style={{
        background:   'hsl(0 0% 100% / 0.026)',
        border:       `1px solid ${svc.gAlpha18}`,
        backdropFilter: 'blur(12px)',
        transition:   'border-color 350ms, box-shadow 350ms',
      }}
    >
      {/* Corner accent glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          [side === 'left' ? 'right' : 'left']: 0,
          width: '140px',
          height: '140px',
          background: `radial-gradient(circle at ${side === 'left' ? 'top right' : 'top left'}, ${svc.gAlpha8}, transparent 68%)`,
        }}
      />

      {/* Top accent line — reveals on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: `linear-gradient(to right, transparent, ${svc.gAlpha55}, transparent)`,
          transition: 'opacity 350ms',
        }}
      />

      {/* Inner-edge connector stub — points toward orb */}
      <div
        className="absolute top-1/2 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          [side === 'left' ? 'right' : 'left']: 0,
          transform: 'translateY(-50%)',
          width: '20px',
          height: '1px',
          background:
            side === 'left'
              ? `linear-gradient(to right, transparent, ${svc.accent}66)`
              : `linear-gradient(to left, transparent, ${svc.accent}66)`,
          transition: 'opacity 350ms',
        }}
      />

      <div className="relative p-7 lg:p-8 flex flex-col flex-1">

        {/* Number badge + icon */}
        <div className="flex items-start justify-between mb-6">
          <span
            className="font-serif italic select-none leading-none"
            style={{ fontSize: '2.2rem', color: `${svc.accent}22` }}
          >
            {svc.num}
          </span>

          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
            style={{
              background: svc.gAlpha8,
              border:     `1px solid ${svc.gAlpha18}`,
              color:      svc.accent,
            }}
          >
            <svc.Icon className="w-[15px] h-[15px]" />
          </div>
        </div>

        <h3 className="text-base font-semibold tracking-tight mb-3 text-primary/95 leading-snug">
          {svc.title}
        </h3>

        <p className="text-muted font-light leading-relaxed text-sm flex-1 mb-6">
          {svc.description}
        </p>

        <div
          className="inline-flex items-center text-xs font-medium gap-1.5 w-fit"
          style={{
            color: `${svc.accent}88`,
            transition: 'color 250ms',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = svc.accent }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = `${svc.accent}88` }}
        >
          Learn more
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-250" />
        </div>

      </div>
    </motion.div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function SystemsShowcase() {
  return (
    <section id="section-9" className="py-32 px-6 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: E }}
              className="text-xs uppercase tracking-widest text-accent-cyan/70 mb-4"
            >
              Systems in Motion
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.08, ease: E }}
              className="text-4xl md:text-5xl font-light tracking-tighter mb-6 text-primary"
            >
              Four core{' '}
              <span className="font-serif italic text-accent-cyan">architectures</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.16, ease: E }}
              className="text-muted text-lg font-light"
            >
              We don't sell hours. We sell outcomes. Here are the core architectures
              we deploy to scale your operations.
            </motion.p>
          </div>

          <motion.a
            href="#contact"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: E }}
            className="hidden md:inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors duration-200 shrink-0 group cursor-pointer"
          >
            All services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.a>
        </div>

        {/* ── Desktop: orbital 3-column layout ── */}
        <div
          className="hidden lg:grid"
          style={{
            gridTemplateColumns: '1fr 168px 1fr',
            gridTemplateRows:    'auto auto',
            gap:                 '18px',
          }}
        >
          {/* Card 01 — top-left */}
          <div style={{ gridColumn: '1', gridRow: '1' }}>
            <ArchCard svc={SERVICES[0]} index={0} side="left" />
          </div>

          {/* Orb — spans both rows */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.25, ease: E }}
            style={{ gridColumn: '2', gridRow: '1 / 3' }}
            className="relative"
          >
            <OrbCore />
          </motion.div>

          {/* Card 02 — top-right */}
          <div style={{ gridColumn: '3', gridRow: '1' }}>
            <ArchCard svc={SERVICES[1]} index={1} side="right" />
          </div>

          {/* Card 03 — bottom-left */}
          <div style={{ gridColumn: '1', gridRow: '2' }}>
            <ArchCard svc={SERVICES[2]} index={2} side="left" />
          </div>

          {/* Card 04 — bottom-right */}
          <div style={{ gridColumn: '3', gridRow: '2' }}>
            <ArchCard svc={SERVICES[3]} index={3} side="right" />
          </div>
        </div>

        {/* ── Mobile / Tablet: stacked 2-column grid ── */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SERVICES.map((svc, i) => (
            <ArchCard key={svc.title} svc={svc} index={i} side={i % 2 === 0 ? 'left' : 'right'} />
          ))}
        </div>

      </div>
    </section>
  )
}
