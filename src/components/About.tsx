import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Cpu, Zap } from 'lucide-react'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

const TAGS = ['Digital Marketing', 'Business Process Automation', 'Lead Generation', 'CRM Automation', 'Graphic Design', 'Paid Social Media Advertising']

const SERVICE_MODULES = [
  { num: '01', label: 'Automation',      desc: 'End-to-end workflow systems'       },
  { num: '02', label: 'Web Design',      desc: 'Bespoke, high-performance sites'   },
  { num: '03', label: 'AI Chatbots',     desc: 'Intelligent 24/7 engagement'       },
  { num: '04', label: 'Content Systems', desc: 'Scalable brand content at scale'   },
  { num: '05', label: 'Video Editing',   desc: 'Storytelling that drives results'  },
]

const ACTIVITY = [
  { event: 'Content batch generated', ago: '2m ago',  color: '#22C55E' },
  { event: 'Lead pipeline synced',    ago: '8m ago',  color: '#38BDF8' },
  { event: 'Social queue scheduled',  ago: '14m ago', color: '#38BDF8' },
]

const BAR_HEIGHTS  = [45, 75, 100, 55, 88, 42, 92, 68, 78, 38]
const BAR_DURATIONS = [0.75, 0.9, 0.65, 1.0, 0.8, 0.7, 0.85, 0.95, 0.72, 0.88]

function LiveBars() {
  return (
    <div className="flex items-end gap-[3px]" style={{ height: '28px' }}>
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          style={{
            width: '3px',
            height: `${h}%`,
            borderRadius: '2px',
            transformOrigin: 'bottom center',
            background: i % 3 === 0
              ? 'hsl(199 89% 60% / 0.88)'
              : 'hsl(199 89% 60% / 0.42)',
            animation: `live-bar ${BAR_DURATIONS[i]}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.07}s`,
          }}
        />
      ))}
    </div>
  )
}

function TaskCounter() {
  const [count, setCount] = useState(127)
  useEffect(() => {
    const id = setInterval(
      () => setCount(n => n + Math.floor(Math.random() * 3) + 1),
      2800,
    )
    return () => clearInterval(id)
  }, [])
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={count}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18 }}
        className="text-xs text-accent-cyan tabular-nums"
        style={{ fontFamily: 'monospace' }}
      >
        {count}
      </motion.span>
    </AnimatePresence>
  )
}

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-28 lg:py-36 px-6 relative bg-background overflow-hidden"
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(hsl(0 0% 100% / 0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/3 right-1/4 w-[520px] h-[520px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{ background: 'hsl(199 89% 60% / 0.04)', filter: 'blur(110px)' }}
      />

      <div className="max-w-6xl mx-auto">

        {/* ─── Main editorial grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 xl:gap-24 items-start mb-14 lg:mb-20">

          {/* ── Left: headline + body + tags + accent line ── */}
          <div className="flex flex-col gap-7 lg:pt-2">

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: E }}
              className="text-xs uppercase tracking-widest text-accent-cyan/70"
            >
              About Weavy
            </motion.p>

            <motion.h2
              id="about-heading"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.07, ease: E }}
              className="text-4xl md:text-5xl lg:text-[3.25rem] font-light tracking-tighter leading-[1.1] text-primary"
            >
              We are a{' '}
              <em className="font-serif italic">full-stack</em>
              <br className="hidden sm:block" />
              {' '}automation agency
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.13, ease: E }}
              className="space-y-4 text-muted font-light leading-relaxed"
              style={{ fontSize: 'clamp(0.9rem, 1.15vw, 1.02rem)' }}
            >
              <p>
                We craft bespoke websites, deploy AI-powered chatbots, and build intelligent
                systems for digital marketing, social media automation, and UGC content — so
                your brand operates at scale without adding headcount.
              </p>
              <p>
                Operating out of London, we partner with high-growth brands to replace manual
                chaos with elegant, automated workflows. We also deliver high-quality video
                editing that enhances storytelling and drives engagement across platforms.
              </p>
            </motion.div>

            {/* Service tag chips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2, ease: E }}
              className="flex flex-wrap gap-2"
            >
              {TAGS.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.22 + i * 0.055, ease: E }}
                  className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted border border-border rounded-full px-4 py-2 cursor-pointer select-none"
                  style={{ transition: 'border-color 200ms, color 200ms, background-color 200ms' }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'hsl(199 89% 60% / 0.35)'
                    el.style.color = 'hsl(0 0% 90%)'
                    el.style.backgroundColor = 'hsl(199 89% 60% / 0.04)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = ''
                    el.style.color = ''
                    el.style.backgroundColor = ''
                  }}
                >
                  <span className="w-[5px] h-[5px] rounded-full bg-accent-cyan/35 shrink-0" />
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            {/* Animated accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.55, ease: E }}
              className="h-px w-full max-w-[220px]"
              style={{
                transformOrigin: 'left center',
                background: 'linear-gradient(to right, hsl(199 89% 60% / 0.6), transparent)',
              }}
            />

          </div>

          {/* ── Right: Glass dashboard card ── */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: E }}
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'hsl(0 0% 100% / 0.025)',
                border: '1px solid hsl(0 0% 100% / 0.08)',
                backdropFilter: 'blur(28px) saturate(1.5)',
                boxShadow:
                  '0 0 0 1px hsl(0 0% 100% / 0.025),' +
                  '0 32px 72px -16px hsl(0 0% 0% / 0.55),' +
                  '0 0 80px -24px hsl(199 89% 60% / 0.1)',
              }}
            >
              {/* Corner glow */}
              <div
                className="absolute top-0 right-0 w-44 h-44 pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    'radial-gradient(circle at top right, hsl(199 89% 60% / 0.1), transparent 65%)',
                }}
              />

              {/* ─ Header ─ */}
              <div
                className="relative flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid hsl(0 0% 100% / 0.06)' }}
              >
                <span className="text-base font-light tracking-tighter text-primary">
                  Weavy<span className="font-serif italic text-accent-cyan">.</span>
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-muted/45">
                    Est. 2023
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-60" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-cyan" />
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-accent-cyan/75">
                      Live
                    </span>
                  </div>
                </div>
              </div>

              {/* ─ Info rows ─ */}
              <div
                className="relative px-6 py-5 space-y-[18px]"
                style={{ borderBottom: '1px solid hsl(0 0% 100% / 0.05)' }}
              >
                {/* Location */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted/50">
                    <MapPin className="w-3.5 h-3.5 text-muted/35 shrink-0" />
                    Location
                  </div>
                  <span className="text-sm font-medium text-primary/90">London, UK</span>
                </div>

                {/* Focus */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted/50">
                    <Cpu className="w-3.5 h-3.5 text-muted/35 shrink-0" />
                    Focus
                  </div>
                  <span className="text-sm font-medium text-primary/90">AI & Automation</span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted/50">
                    <Zap className="w-3.5 h-3.5 text-muted/35 shrink-0" />
                    Status
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-70" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: 'hsl(142 65% 52%)' }}
                    >
                      Accepting clients
                    </span>
                  </div>
                </div>
              </div>

              {/* ─ Live systems panel ─ */}
              <div className="relative px-6 py-5">

                {/* Panel header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-muted/45">
                    Live Systems
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted/35">
                    <TaskCounter />
                    <span>tasks / day</span>
                  </div>
                </div>

                {/* Frequency bars */}
                <div className="flex items-end justify-between mb-5">
                  <LiveBars />
                  <span className="text-[10px] text-muted/25 uppercase tracking-widest">
                    Active
                  </span>
                </div>

                {/* Thin divider */}
                <div
                  className="mb-4"
                  style={{
                    height: '1px',
                    background:
                      'linear-gradient(to right, transparent, hsl(0 0% 100% / 0.07), transparent)',
                  }}
                />

                {/* Activity feed */}
                <div className="space-y-3">
                  {ACTIVITY.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-[5px] h-[5px] rounded-full shrink-0"
                          style={{
                            background: item.color,
                            boxShadow: `0 0 6px ${item.color}55`,
                          }}
                        />
                        <span className="text-xs text-muted/65 font-light">{item.event}</span>
                      </div>
                      <span
                        className="text-[10px] text-muted/30 shrink-0 ml-3"
                        style={{ fontFamily: 'monospace' }}
                      >
                        {item.ago}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─ Card footer ─ */}
              <div
                className="flex items-center justify-between px-6 py-3.5"
                style={{ borderTop: '1px solid hsl(0 0% 100% / 0.04)' }}
              >
                <span
                  className="text-[10px] text-muted/28 uppercase tracking-widest"
                  style={{ fontFamily: 'monospace' }}
                >
                  SYS v2.4.1
                </span>
                <span className="text-[10px] text-accent-cyan/35 uppercase tracking-widest">
                  Weavy Automation Ltd.
                </span>
              </div>

            </div>
          </motion.div>

        </div>

        {/* ─── Service modules strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SERVICE_MODULES.map((svc, i) => (
            <motion.div
              key={svc.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: E }}
              className="group relative rounded-xl px-5 py-5 overflow-hidden cursor-pointer"
              style={{
                background: 'hsl(0 0% 100% / 0.018)',
                border: '1px solid hsl(0 0% 100% / 0.06)',
                transition: 'border-color 280ms, background-color 280ms',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'hsl(199 89% 60% / 0.22)'
                el.style.backgroundColor = 'hsl(0 0% 100% / 0.03)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'hsl(0 0% 100% / 0.06)'
                el.style.backgroundColor = 'hsl(0 0% 100% / 0.018)'
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100"
                style={{
                  background:
                    'linear-gradient(to right, transparent, hsl(199 89% 60% / 0.5), transparent)',
                  transition: 'opacity 280ms',
                }}
              />
              <div
                className="text-xs font-serif italic text-muted/35 mb-3 select-none"
              >
                {svc.num}
              </div>
              <div className="text-sm font-medium text-primary mb-1.5">{svc.label}</div>
              <div className="text-xs text-muted/55 font-light leading-snug">{svc.desc}</div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
