import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { goToPath } from '../lib/navigation'

gsap.registerPlugin(MotionPathPlugin)

const CYAN = '#22D3EE'
const GREEN = '#1D9E75'

// ─── Icons — small stroke-only outlines, matching the site's icon style ──────

function Icon({ type, color }: { type: string; color: string }) {
  const s = { width: 22, height: 22, fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (type === 'inbox') return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M3 8.5 5.5 3h13L21 8.5" />
      <path d="M3 8.5v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5" />
      <path d="M3 8.5h5.2l1.4 3h4.8l1.4-3H21" />
    </svg>
  )
  if (type === 'bolt') return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M13 2 4.5 14h6l-1 8 9-12h-6z" />
    </svg>
  )
  if (type === 'filter') return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M4 4h16l-6.2 8.4V19l-3.6 2v-8.6z" />
    </svg>
  )
  if (type === 'crm') return (
    <svg viewBox="0 0 24 24" style={s}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
  )
  if (type === 'calendar') return (
    <svg viewBox="0 0 24 24" style={s}>
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M9 15.5l2 2 4-4.5" />
    </svg>
  )
  if (type === 'chart') return (
    <svg viewBox="0 0 24 24" style={s}><path d="M3 3v18h18" /><path d="M7 15l4-5 3 3 5-7" /></svg>
  )
  return null
}

// ─── Workflow data ────────────────────────────────────────────────────────────

const STAGES = [
  {
    key: 'enquiry', icon: 'inbox', label: 'Enquiry',
    desc: null as string | null,
    channels: ['Voice', 'WhatsApp', 'Instagram', 'Facebook', 'Web chat'],
  },
  { key: 'response', icon: 'bolt',     label: 'Response', desc: 'The system answers instantly, day or night' },
  { key: 'qualify',  icon: 'filter',   label: 'Qualify',  desc: 'Collects details, identifies intent, routes high-value leads' },
  { key: 'crm',      icon: 'crm',      label: 'CRM',      desc: 'Contact organised, follow-ups triggered automatically' },
  { key: 'booking',  icon: 'calendar', label: 'Booking',  desc: 'Customer books or is handed to a person', success: true },
  { key: 'insight',  icon: 'chart',    label: 'Insight',  desc: 'Analytics show source, response and outcome' },
]

const BOOKING_INDEX = STAGES.findIndex(s => s.success)

// Builds a straight-through path across the measured centre of each stage
// node, relative to the workflow container — works for both the horizontal
// (desktop) and vertical (mobile) layouts without any orientation-specific code.
function buildPathD(container: HTMLElement, nodes: HTMLElement[]) {
  const cRect = container.getBoundingClientRect()
  const points = nodes.map(n => {
    const r = n.getBoundingClientRect()
    return { x: r.left + r.width / 2 - cRect.left, y: r.top + r.height / 2 - cRect.top }
  })
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
}

export default function PlatformSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const workflowRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const trackRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const stageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const el = sectionRef.current
    const container = workflowRef.current
    const path = pathRef.current
    const track = trackRef.current
    const dot = dotRef.current
    if (!el || !container || !path || !track) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stageEls = stageRefs.current.filter((n): n is HTMLDivElement => !!n)
    // The line must pass through each icon circle's centre, not the centre
    // of the whole stage block (which also includes the label/description
    // text stacked below it).
    const nodeCircles = stageEls
      .map(n => n.querySelector<HTMLElement>('.ocs-node-circle'))
      .filter((n): n is HTMLElement => !!n)
    const bookingNode = nodeCircles[BOOKING_INDEX]

    let loopTl: gsap.core.Timeline | null = null
    let ro: ResizeObserver | null = null
    let settled = false

    // Measures each stage's true resting position — must only run once the
    // entrance animation's y-offset has fully resolved back to 0, otherwise
    // the line is drawn through the mid-animation (shifted) positions.
    const recomputePath = () => {
      const d = buildPathD(container, nodeCircles)
      path.setAttribute('d', d)
      track.setAttribute('d', d)
      if (!prefersReduced) {
        const len = path.getTotalLength()
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: settled ? 0 : len })
      }
    }

    const headerEls = el.querySelectorAll('.ocs-header-el')
    gsap.set(headerEls, { opacity: 0, y: 22 })
    gsap.set(stageEls, { opacity: 0, y: 18 })
    gsap.set([path, track], { opacity: 0 })
    if (dot) gsap.set(dot, { opacity: 0 })

    const pulseBooking = () => {
      if (!bookingNode) return
      gsap.timeline()
        .to(bookingNode, { boxShadow: `0 0 0 9px ${GREEN}59, 0 0 28px ${GREEN}80`, duration: 0.32, ease: 'power2.out' })
        .to(bookingNode, { boxShadow: `0 0 0 0px ${GREEN}00, 0 0 16px ${GREEN}33`, duration: 0.95, ease: 'power2.in' }, 0.32)
    }

    const startLineAndDot = () => {
      recomputePath()
      gsap.set([path, track], { opacity: 1 })
      ro = new ResizeObserver(() => recomputePath())
      ro.observe(container)

      if (prefersReduced) return

      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.7,
        ease: 'power2.inOut',
        onComplete: () => {
          settled = true
          if (!dot) return
          gsap.set(dot, { opacity: 1 })
          loopTl = gsap.timeline({ repeat: -1 })
          loopTl.to(dot, {
            motionPath: { path, autoRotate: false, alignOrigin: [0.5, 0.5] },
            duration: 7,
            ease: 'none',
          }, 0)
          if (bookingNode) {
            loopTl.call(pulseBooking, [], 7 * (BOOKING_INDEX / (STAGES.length - 1)) - 0.15)
          }
        },
      })
    }

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(headerEls, { opacity: 1, y: 0, duration: 0.75, stagger: 0.1 }, 0)
      tl.to(stageEls,  { opacity: 1, y: 0, duration: 0.6, stagger: 0.09 }, 0.28)
      tl.call(startLineAndDot)

      obs.disconnect()
    }, { threshold: 0.2 })
    obs.observe(el)

    return () => {
      obs.disconnect()
      ro?.disconnect()
      loopTl?.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        background: [
          'radial-gradient(circle at 50% 18%, rgba(24, 105, 125, 0.034) 0%, rgba(5, 24, 29, 0.019) 36%, rgba(1, 7, 9, 0) 64%)',
          'linear-gradient(to bottom, #010709 0%, #010709 42%, #000506 100%)',
        ].join(', '),
        paddingTop: 'clamp(5rem, 9vw, 8rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6.5rem)',
      }}
      aria-label="One Connected System"
    >
      {/* Ambient glow + dot grid, consistent with other platform-style sections */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(125,220,255,0.038) 0%, transparent 65%)',
      }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'radial-gradient(rgba(125,220,255,0.05) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 100%)',
      }} />
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 right-0" style={{
        height: '400px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.225) 0%, transparent 100%)',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">

        {/* ── Header — its own display treatment, not the italic "Our Services" style ── */}
        <div className="text-center max-w-3xl mx-auto" style={{ marginBottom: 'clamp(4rem, 8vw, 6rem)' }}>
          <div className="ocs-header-el inline-flex items-center gap-3" style={{ marginBottom: '1.4rem' }}>
            <span aria-hidden="true" style={{ width: 28, height: 1, background: `${CYAN}80` }} />
            <span
              className="font-label font-semibold uppercase"
              style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', letterSpacing: '0.28em', color: CYAN }}
            >
              One Connected System
            </span>
            <span aria-hidden="true" style={{ width: 28, height: 1, background: `${CYAN}80` }} />
          </div>

          <h2
            className="ocs-header-el font-heading font-medium"
            style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)', lineHeight: 1.14, letterSpacing: '-0.032em', color: 'var(--text-primary)' }}
          >
            From first enquiry to booked customer—everything stays connected.
          </h2>

          <p
            className="ocs-header-el font-body font-normal"
            style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)', lineHeight: 1.8, color: 'var(--text-muted)', marginTop: '1.3rem' }}
          >
            Voice, messaging, CRM, follow-ups and bookings working as one managed flow.
          </p>
        </div>

        {/* ── The workflow — one continuous line through six stages ── */}
        <div
          ref={workflowRef}
          className="relative flex flex-col md:flex-row items-center md:items-start"
          style={{ gap: 'clamp(3.2rem, 6vw, 1.25rem)' }}
        >
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="ocs-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"  stopColor="#F0C56A" stopOpacity="0.5" />
                <stop offset="10%" stopColor="#34D399" stopOpacity="0.45" />
                <stop offset="20%" stopColor="#E879C9" stopOpacity="0.4" />
                <stop offset="30%" stopColor="#6BA9FF" stopOpacity="0.38" />
                <stop offset="45%" stopColor={CYAN} stopOpacity="0.65" />
                <stop offset="100%" stopColor={CYAN} stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {/* Track — faint permanent guide */}
            <path ref={trackRef} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={1.5} />
            {/* Animated fill — draws in on scroll */}
            <path ref={pathRef} fill="none" stroke="url(#ocs-line-grad)" strokeWidth={1.5} strokeLinecap="round" />
            {/* Live enquiry dot */}
            <circle ref={dotRef} r={5} fill={CYAN} style={{ filter: `drop-shadow(0 0 6px ${CYAN})` }} />
          </svg>

          {STAGES.map((stage, i) => (
            <div
              key={stage.key}
              ref={el => { stageRefs.current[i] = el }}
              className="relative z-10 flex flex-col items-center text-center"
              style={{ flex: '1 1 0', minWidth: 0, maxWidth: 220 }}
            >
              <div
                className="ocs-node-circle"
                style={{
                  width: stage.success ? 62 : 54,
                  height: stage.success ? 62 : 54,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: stage.success ? `${GREEN}1a` : `${CYAN}14`,
                  border: `1px solid ${stage.success ? GREEN : CYAN}59`,
                  boxShadow: `0 0 18px ${stage.success ? GREEN : CYAN}26`,
                  marginBottom: '1.1rem',
                  flexShrink: 0,
                  transition: 'box-shadow 300ms',
                }}
              >
                <Icon type={stage.icon} color={stage.success ? GREEN : CYAN} />
              </div>

              <h3 className="font-heading font-medium" style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '0.4rem', letterSpacing: '-0.01em' }}>
                {stage.label}
              </h3>

              {stage.desc && (
                <p className="font-body font-normal" style={{ fontSize: '15px', lineHeight: 1.65, color: 'var(--text-muted)' }}>
                  {stage.desc}
                </p>
              )}

              {stage.channels && (
                <p className="font-body font-normal" style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-muted)', opacity: 0.85 }}>
                  {stage.channels.join(' · ')}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="ocs-header-el flex justify-center" style={{ marginTop: 'clamp(3rem, 6vw, 4.5rem)' }}>
          <a
            href="/contact"
            onClick={(e) => { e.preventDefault(); goToPath('/contact') }}
            className="font-body btn-glow-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium bg-primary text-background hover:bg-white hover:shadow-[0_0_28px_rgba(245,245,245,0.28)] active:scale-[0.97]"
            style={{ transition: 'background-color 200ms, box-shadow 200ms, transform 100ms' }}
          >
            See how the system works →
          </a>
        </div>
      </div>
    </section>
  )
}
