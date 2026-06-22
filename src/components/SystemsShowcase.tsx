import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Bot, Workflow, MessageSquare, LineChart, ArrowRight, type LucideIcon } from 'lucide-react'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface ServiceDef {
  num: string
  Icon: LucideIcon
  title: string
  description: string
  accent: string
  glowRgb: string
}

const SERVICES: ServiceDef[] = [
  {
    num: '01',
    Icon: Bot,
    title: 'AI Content Automation',
    description:
      'Auto-generate branded content at scale. We build custom LLM pipelines that understand your brand voice and output ready-to-publish assets.',
    accent: '#38BDF8',
    glowRgb: '56 189 248',
  },
  {
    num: '02',
    Icon: Workflow,
    title: 'Growth Systems',
    description:
      'Automated funnels, lead generation, and CRM workflows. Never let a lead slip through the cracks again with intelligent routing and follow-up.',
    accent: '#22C55E',
    glowRgb: '34 197 94',
  },
  {
    num: '03',
    Icon: MessageSquare,
    title: 'Communication AI',
    description:
      'Intelligent chatbots, email automation, and social scheduling. Provide 24/7 support and engagement without expanding your team.',
    accent: '#A855F7',
    glowRgb: '168 85 247',
  },
  {
    num: '04',
    Icon: LineChart,
    title: 'Brand Intelligence',
    description:
      'Live monitoring, analytics, and automated reporting. Real-time insights delivered directly to your Slack or inbox — automatically.',
    accent: '#F59E0B',
    glowRgb: '245 158 11',
  },
]

// Node centre from panel left edge: px-6 (24px) + half of w-8 (16px) = 40px
const SPINE_LEFT = 40

// ─── Module row ───────────────────────────────────────────────────────────────

function ModuleRow({ svc, index }: { svc: ServiceDef; index: number }) {
  const rowRef   = useRef<HTMLDivElement>(null)
  const nodeRef  = useRef<HTMLDivElement>(null)
  const iconRef  = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const enter = () => {
    if (rowRef.current)  rowRef.current.style.background  = `rgb(${svc.glowRgb} / 0.045)`
    if (nodeRef.current) {
      nodeRef.current.style.background = svc.accent
      nodeRef.current.style.boxShadow  = `0 0 10px ${svc.accent}cc, 0 0 20px ${svc.accent}44`
      nodeRef.current.style.transform  = 'scale(1.45)'
    }
    if (iconRef.current) {
      iconRef.current.style.borderColor = `rgb(${svc.glowRgb} / 0.4)`
      iconRef.current.style.color       = svc.accent
      iconRef.current.style.background  = `rgb(${svc.glowRgb} / 0.08)`
    }
    if (titleRef.current) titleRef.current.style.color = '#f8fafc'
  }

  const leave = () => {
    if (rowRef.current)  rowRef.current.style.background  = 'transparent'
    if (nodeRef.current) {
      nodeRef.current.style.background = `rgb(${svc.glowRgb} / 0.45)`
      nodeRef.current.style.boxShadow  = `0 0 6px ${svc.accent}55`
      nodeRef.current.style.transform  = 'scale(1)'
    }
    if (iconRef.current) {
      iconRef.current.style.borderColor = 'hsl(0 0% 100% / 0.08)'
      iconRef.current.style.color       = 'hsl(0 0% 48%)'
      iconRef.current.style.background  = 'hsl(0 0% 100% / 0.03)'
    }
    if (titleRef.current) titleRef.current.style.color = 'hsl(0 0% 90%)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: 0.2 + index * 0.09, ease: E }}
    >
      {index > 0 && (
        <div
          className="pointer-events-none"
          style={{
            height: '1px',
            marginLeft: '56px',
            background: 'hsl(0 0% 100% / 0.045)',
          }}
        />
      )}

      <div
        ref={rowRef}
        className="flex items-start gap-4 px-6 py-5 cursor-default"
        style={{ transition: 'background 220ms ease' }}
        onMouseEnter={enter}
        onMouseLeave={leave}
      >
        {/* Node — vertically centred on spine */}
        <div className="flex-shrink-0 w-8 flex items-center justify-center pt-[0.35rem]">
          <div
            ref={nodeRef}
            className="rounded-full"
            style={{
              width: '7px',
              height: '7px',
              background: `rgb(${svc.glowRgb} / 0.45)`,
              boxShadow: `0 0 6px ${svc.accent}55`,
              transition:
                'background 220ms ease, box-shadow 220ms ease, transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        {/* Icon ring */}
        <div
          ref={iconRef}
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            border: '1px solid hsl(0 0% 100% / 0.08)',
            color: 'hsl(0 0% 48%)',
            background: 'hsl(0 0% 100% / 0.03)',
            transition: 'border-color 220ms, color 220ms, background 220ms',
          }}
        >
          <svc.Icon className="w-[14px] h-[14px]" strokeWidth={1.5} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1.5">
            <span
              className="font-mono text-[10px] tracking-widest select-none shrink-0"
              style={{ color: `${svc.accent}66` }}
            >
              {svc.num}
            </span>
            <h3
              ref={titleRef}
              className="text-sm font-semibold tracking-tight"
              style={{ color: 'hsl(0 0% 90%)', transition: 'color 220ms' }}
            >
              {svc.title}
            </h3>
          </div>
          <p className="text-xs leading-[1.72]" style={{ color: 'hsl(0 0% 40%)' }}>
            {svc.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Architecture panel ───────────────────────────────────────────────────────

function ArchitecturePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: E }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'hsl(0 0% 5% / 0.92)',
        border: '1px solid hsl(0 0% 100% / 0.07)',
        backdropFilter: 'blur(20px)',
        boxShadow:
          '0 0 0 1px hsl(0 0% 100% / 0.02),' +
          '0 24px 64px -12px hsl(0 0% 0% / 0.5),' +
          '0 0 80px -30px hsl(199 89% 60% / 0.08)',
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, transparent 5%, hsl(199 89% 60% / 0.5) 28%, hsl(270 91% 65% / 0.25) 60%, transparent 95%)',
        }}
      />

      {/* Panel header */}
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{
          borderBottom: '1px solid hsl(0 0% 100% / 0.045)',
          background: 'hsl(0 0% 100% / 0.018)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-[7px] h-[7px] rounded-full"
            style={{
              background: '#22C55E',
              boxShadow: '0 0 6px #22C55E88',
              animation: 'energy-core-breathe 2.4s ease-in-out infinite',
            }}
          />
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: 'hsl(0 0% 36%)' }}
          >
            Weavy · System Architecture
          </span>
        </div>

        <div className="flex items-center gap-[5px]">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="rounded-full"
              style={{ width: '7px', height: '7px', background: 'hsl(0 0% 17%)' }}
            />
          ))}
        </div>
      </div>

      {/* Module list + spine */}
      <div className="relative">
        {/* Vertical spine */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${SPINE_LEFT}px`,
            top: 0,
            bottom: 0,
            width: '1px',
            background:
              'linear-gradient(to bottom, transparent 1%, hsl(0 0% 100% / 0.07) 8%, hsl(0 0% 100% / 0.07) 92%, transparent 99%)',
          }}
        />

        {SERVICES.map((svc, i) => (
          <ModuleRow key={svc.num} svc={svc} index={i} />
        ))}
      </div>

      {/* Bottom accent */}
      <div
        className="h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, transparent, hsl(199 89% 60% / 0.07), transparent)',
        }}
      />
    </motion.div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function SystemsShowcase() {
  return (
    <section id="section-9" className="py-32 px-6 bg-background overflow-hidden relative">

      {/* Top blend — continues from Stats section boundary */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, #071011 0%, rgba(7,16,17,0.4) 55%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.45fr] gap-12 lg:gap-20 items-center">

          {/* ── Left: text block ── */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: E }}
              className="text-xs uppercase tracking-widest text-accent-cyan/70 mb-5"
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
              className="text-muted text-lg font-light leading-relaxed mb-10"
            >
              We don't sell hours. We sell outcomes. Here are the core architectures
              we deploy to scale your operations.
            </motion.p>

            <motion.a
              href="#section-9"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.26, ease: E }}
              className="inline-flex items-center gap-2 text-sm w-fit cursor-pointer"
              style={{ color: 'hsl(0 0% 40%)', transition: 'color 200ms' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = 'hsl(0 0% 90%)'
                const arrow = el.querySelector('svg') as SVGElement | null
                if (arrow) arrow.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = 'hsl(0 0% 40%)'
                const arrow = el.querySelector('svg') as SVGElement | null
                if (arrow) arrow.style.transform = 'translateX(0)'
              }}
            >
              All services
              <ArrowRight
                className="w-4 h-4"
                style={{ transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </motion.a>
          </div>

          {/* ── Right: architecture panel ── */}
          <div className="relative">
            {/* Ambient glow behind panel */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: '-48px',
                background:
                  'radial-gradient(ellipse at 50% 25%, hsl(199 89% 60% / 0.06), transparent 65%)',
              }}
            />
            <ArchitecturePanel />
          </div>

        </div>
      </div>

      {/* Bottom blend — dissolves panel shadow before section boundary */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '280px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(7,16,17,0.2) 30%, rgba(7,16,17,0.62) 60%, rgba(7,16,17,0.92) 82%, #071011 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </section>
  )
}
