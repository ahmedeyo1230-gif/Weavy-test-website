import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'

// ─── Module-level data (needed for animation indexing) ───────────────────────

const PAGE_DATA = [
  { name: 'Hero / Landing', score: 98, hsl: '160 65% 52%' },
  { name: 'Services',       score: 95, hsl: '160 65% 52%' },
  { name: 'Contact / CTA',  score: 91, hsl: '199 89% 55%' },
]

const BAR_HEIGHTS = [55, 72, 88, 65, 94, 78, 100]
const BAR_DAYS    = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const CREATOR_DATA = [
  { name: '@creator_a', pct: 82, val: '9.8K' },
  { name: '@creator_b', pct: 64, val: '7.6K' },
]

const FOOTER_METRICS = [
  { label: 'Uptime',    value: '99.9%',     color: 'hsl(160 65% 52%)' },
  { label: 'Leads',     value: '1,840',     color: 'hsl(199 89% 60%)' },
  { label: 'Responses', value: '< 2s',      color: 'hsl(199 89% 60%)' },
  { label: 'Creators',  value: '12 active', color: 'hsl(280 60% 65%)' },
]

// ─── Shared panel shell ───────────────────────────────────────────────────────

function PanelShell({ children, glowColor }: { children: ReactNode; glowColor?: string }) {
  return (
    <div
      className="sys-panel"
      style={{
        background: 'hsl(213 20% 6%)',
        border: `1px solid ${glowColor ? `hsl(${glowColor} / 0.14)` : 'hsl(0 0% 100% / 0.07)'}`,
        borderRadius: '1.1rem',
        overflow: 'hidden',
        boxShadow: [
          glowColor ? `0 0 0 1px hsl(${glowColor} / 0.05)` : '0 0 0 1px hsl(0 0% 100% / 0.03)',
          '0 20px 50px -12px hsl(0 0% 0% / 0.6)',
        ].join(', '),
        height: '100%',
      }}
    >
      {children}
    </div>
  )
}

function PanelHeader({ title, label, dotHsl }: { title: string; label: string; dotHsl: string }) {
  return (
    <div style={{
      padding: '12px 16px 10px',
      borderBottom: '1px solid hsl(0 0% 100% / 0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          className="sys-dot"
          style={{
            width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
            background: `hsl(${dotHsl})`,
            boxShadow: `0 0 7px hsl(${dotHsl} / 0.7)`,
            transformOrigin: 'center',
          }}
        />
        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: '0.7rem', color: 'hsl(0 0% 80%)', letterSpacing: '-0.01em' }}>
          {title}
        </span>
      </div>
      <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.55rem', color: 'hsl(0 0% 28%)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  )
}

// ─── Panel 1: Website Experience ─────────────────────────────────────────────

function WebsitePanel() {
  return (
    <PanelShell glowColor="160 65% 52%">
      <PanelHeader title="Website Experience" label="Live" dotHsl="160 65% 52%" />
      <div style={{ padding: '14px 16px' }}>

        {/* Page performance rows — fills animated via .sys-page-bar */}
        {PAGE_DATA.map(({ name, score, hsl }) => (
          <div key={name} style={{ marginBottom: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.62rem', color: 'hsl(0 0% 50%)' }}>{name}</span>
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400, fontSize: '0.6rem', color: `hsl(${hsl})` }}>{score}</span>
            </div>
            <div style={{ height: '3px', background: 'hsl(0 0% 100% / 0.05)', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                className="sys-page-bar"
                style={{
                  height: '100%', width: `${score}%`,
                  background: `linear-gradient(to right, hsl(${hsl} / 0.5), hsl(${hsl}))`,
                  borderRadius: '2px',
                  transformOrigin: 'left center',
                }}
              />
            </div>
          </div>
        ))}

        {/* Score badge */}
        <div style={{
          marginTop: '13px', padding: '9px 12px',
          background: 'hsl(160 65% 52% / 0.06)', border: '1px solid hsl(160 65% 52% / 0.11)',
          borderRadius: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.59rem', color: 'hsl(0 0% 38%)' }}>Performance score</span>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: '0.82rem', color: 'hsl(160 65% 60%)', letterSpacing: '-0.02em' }}>98 / 100</span>
        </div>

        {/* Sparkline — path draws via stroke-dashoffset */}
        <div style={{ marginTop: '13px' }}>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.54rem', color: 'hsl(0 0% 28%)', letterSpacing: '0.02em', display: 'block', marginBottom: '6px' }}>
            Sessions this week
          </span>
          <svg viewBox="0 0 160 30" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }} aria-hidden="true">
            <defs>
              <linearGradient id="sys-g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(199 89% 60%)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="hsl(199 89% 60%)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              className="sys-sparkline-area"
              d="M0,26 C22,22 38,16 58,12 C78,8 88,14 106,8 C124,2 142,6 160,2 L160,30 L0,30 Z"
              fill="url(#sys-g1)"
            />
            <path
              className="sys-sparkline"
              d="M0,26 C22,22 38,16 58,12 C78,8 88,14 106,8 C124,2 142,6 160,2"
              fill="none" stroke="hsl(199 89% 60%)" strokeWidth="1.2" strokeLinecap="round"
            />
          </svg>
        </div>

      </div>
    </PanelShell>
  )
}

// ─── Panel 2: AI Automation ───────────────────────────────────────────────────

function AutomationPanel() {
  return (
    <PanelShell glowColor="199 89% 60%">
      <PanelHeader title="AI Automation" label="24 / 7" dotHsl="199 89% 60%" />
      <div style={{ padding: '14px 16px' }}>

        {/* Chat bubbles — each bubble has .sys-chat-bubble */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '13px' }}>
          <div className="sys-chat-bubble" style={{ display: 'flex' }}>
            <div style={{
              background: 'hsl(0 0% 100% / 0.05)', border: '1px solid hsl(0 0% 100% / 0.06)',
              borderRadius: '0 0.55rem 0.55rem 0.55rem', padding: '6px 10px', maxWidth: '82%',
            }}>
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.6rem', color: 'hsl(0 0% 55%)' }}>
                Hi, I'd like to know more about your services
              </span>
            </div>
          </div>

          <div className="sys-chat-bubble" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              background: 'hsl(199 89% 60% / 0.1)', border: '1px solid hsl(199 89% 60% / 0.15)',
              borderRadius: '0.55rem 0 0.55rem 0.55rem', padding: '6px 10px', maxWidth: '82%',
            }}>
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.6rem', color: 'hsl(199 89% 75%)' }}>
                Hi! I'd be happy to help. What are you looking for?
              </span>
            </div>
          </div>

          <div className="sys-chat-bubble" style={{ display: 'flex' }}>
            <div style={{
              background: 'hsl(0 0% 100% / 0.05)', border: '1px solid hsl(0 0% 100% / 0.06)',
              borderRadius: '0 0.55rem 0.55rem 0.55rem', padding: '6px 10px', maxWidth: '82%',
            }}>
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.6rem', color: 'hsl(0 0% 55%)' }}>
                Can you book a call for me?
              </span>
            </div>
          </div>
        </div>

        {/* Channel tags — each has .sys-channel-tag */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '13px' }}>
          {['Website', 'WhatsApp', 'Instagram DM', 'Messenger'].map(ch => (
            <span
              key={ch}
              className="sys-channel-tag"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.52rem',
                color: 'hsl(0 0% 38%)', background: 'hsl(0 0% 100% / 0.04)',
                border: '1px solid hsl(0 0% 100% / 0.07)', borderRadius: '0.3rem',
                padding: '2px 7px', letterSpacing: '0.01em',
              }}
            >{ch}</span>
          ))}
        </div>

        {/* Response time */}
        <div style={{
          padding: '9px 12px', background: 'hsl(199 89% 60% / 0.06)',
          border: '1px solid hsl(199 89% 60% / 0.12)', borderRadius: '0.6rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.59rem', color: 'hsl(0 0% 38%)' }}>Avg response time</span>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: '0.82rem', color: 'hsl(199 89% 65%)', letterSpacing: '-0.02em' }}>&lt; 2s</span>
        </div>

      </div>
    </PanelShell>
  )
}

// ─── Panel 3: Growth Content ──────────────────────────────────────────────────

function GrowthPanel() {
  return (
    <PanelShell glowColor="280 60% 60%">
      <PanelHeader title="Growth Content" label="Running" dotHsl="280 60% 65%" />
      <div style={{ padding: '14px 16px' }}>

        {/* Bar chart — each bar has .sys-bar, grows via scaleY */}
        <div style={{ marginBottom: '13px' }}>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.54rem', color: 'hsl(0 0% 28%)', display: 'block', marginBottom: '7px', letterSpacing: '0.02em' }}>
            Campaign performance
          </span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '40px' }}>
            {BAR_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className="sys-bar"
                style={{
                  flex: 1, height: `${h}%`,
                  background: i === BAR_HEIGHTS.length - 1
                    ? 'linear-gradient(to top, hsl(280 65% 42%), hsl(280 60% 64%))'
                    : `hsl(280 55% 55% / ${0.14 + i * 0.05})`,
                  borderRadius: '2px 2px 1px 1px',
                  transformOrigin: 'bottom center',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', marginTop: '3px' }}>
            {BAR_DAYS.map((d, i) => (
              <span key={i} style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.47rem', color: 'hsl(0 0% 24%)', flex: 1, textAlign: 'center' }}>{d}</span>
            ))}
          </div>
        </div>

        {/* Creator rows — fills have .sys-creator-bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '13px' }}>
          {CREATOR_DATA.map(({ name, pct, val }) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.56rem', color: 'hsl(0 0% 36%)', width: '70px', flexShrink: 0 }}>{name}</span>
              <div style={{ flex: 1, height: '3px', background: 'hsl(0 0% 100% / 0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  className="sys-creator-bar"
                  style={{
                    height: '100%', width: `${pct}%`,
                    background: 'linear-gradient(to right, hsl(280 55% 40%), hsl(280 60% 60%))',
                    borderRadius: '2px',
                    transformOrigin: 'left center',
                  }}
                />
              </div>
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.52rem', color: 'hsl(0 0% 30%)', width: '32px', textAlign: 'right', flexShrink: 0 }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Total clicks */}
        <div style={{
          padding: '9px 12px', background: 'hsl(280 60% 60% / 0.06)',
          border: '1px solid hsl(280 60% 60% / 0.1)', borderRadius: '0.6rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.59rem', color: 'hsl(0 0% 38%)' }}>Total clicks this month</span>
          <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: '0.82rem', color: 'hsl(280 60% 68%)', letterSpacing: '-0.02em' }}>24.6K</span>
        </div>

      </div>
    </PanelShell>
  )
}

// ─── Connector between panels ─────────────────────────────────────────────────

function PanelConnector() {
  return (
    <div className="hidden lg:flex items-center justify-center" style={{ paddingBottom: '20px' }}>
      <div style={{ position: 'relative', width: '44px', display: 'flex', alignItems: 'center' }}>
        <div
          className="sys-connector-line"
          style={{
            width: '100%', height: '1px',
            background: 'linear-gradient(to right, hsl(199 89% 60% / 0.1), hsl(199 89% 60% / 0.4), hsl(199 89% 60% / 0.1))',
            transformOrigin: 'left center',
          }}
        />
        <div
          style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 5, height: 5, borderRadius: '50%',
            background: 'hsl(199 89% 60% / 0.5)',
            boxShadow: '0 0 6px hsl(199 89% 60% / 0.4)',
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function SystemsShowcase() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    // ── Outer elements ──
    const textEls    = el.querySelectorAll('.sys-text')
    const dashEl     = el.querySelector('.sys-dash')
    const panelEls   = el.querySelectorAll('.sys-panel')
    const dotEls     = el.querySelectorAll<HTMLElement>('.sys-dot')
    const connectors = el.querySelectorAll<HTMLElement>('.sys-connector-line')

    // ── Inner panel elements ──
    const pageBars    = el.querySelectorAll<HTMLElement>('.sys-page-bar')
    const sparkPath   = el.querySelector<SVGPathElement>('.sys-sparkline')
    const sparkArea   = el.querySelector<SVGPathElement>('.sys-sparkline-area')
    const chatBubbles = el.querySelectorAll<HTMLElement>('.sys-chat-bubble')
    const channelTags = el.querySelectorAll<HTMLElement>('.sys-channel-tag')
    const chartBars   = el.querySelectorAll<HTMLElement>('.sys-bar')
    const creatorBars = el.querySelectorAll<HTMLElement>('.sys-creator-bar')
    const footerItems = el.querySelectorAll<HTMLElement>('.sys-footer-metric')

    // ── Set initial states ──
    gsap.set(textEls,    { opacity: 0, y: 32 })
    gsap.set(dashEl,     { opacity: 0, y: 26 })
    gsap.set(panelEls,   { opacity: 0, y: 22 })
    gsap.set(connectors, { scaleX: 0, transformOrigin: 'left center' })

    gsap.set(pageBars,    { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(chatBubbles, { opacity: 0, y: 10 })
    gsap.set(channelTags, { opacity: 0, y: 6 })
    gsap.set(chartBars,   { scaleY: 0, transformOrigin: 'bottom center' })
    gsap.set(creatorBars, { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(footerItems, { opacity: 0, y: 8 })

    if (sparkPath) {
      const len = sparkPath.getTotalLength()
      gsap.set(sparkPath, { strokeDasharray: len, strokeDashoffset: len })
    }
    if (sparkArea) gsap.set(sparkArea, { opacity: 0 })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // ── 1. Outer section entry ──
      tl.to(textEls,  { opacity: 1, y: 0, duration: 1.0, stagger: 0.13 }, 0)
      tl.to(dashEl,   { opacity: 1, y: 0, duration: 1.1 }, 0.18)
      tl.to(panelEls, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, 0.42)

      // ── 2. Connector lines draw ──
      tl.to(connectors, { scaleX: 1, duration: 0.75, stagger: 0.22, ease: 'power2.inOut' }, 0.88)

      // ── 3. Panel 1: progress bars fill left→right ──
      tl.to(pageBars, { scaleX: 1, duration: 1.0, stagger: 0.14, ease: 'power2.out' }, 0.9)

      // ── 4. Panel 1: sparkline draws ──
      if (sparkPath) tl.to(sparkPath, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 1.05)
      if (sparkArea) tl.to(sparkArea, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 1.25)

      // ── 5. Panel 2: chat bubbles stagger in ──
      tl.to(chatBubbles, { opacity: 1, y: 0, duration: 0.5, stagger: 0.2, ease: 'power2.out' }, 0.95)

      // ── 6. Panel 2: channel tags fade up ──
      tl.to(channelTags, { opacity: 1, y: 0, duration: 0.4, stagger: 0.09, ease: 'power2.out' }, 1.35)

      // ── 7. Panel 3: bar chart grows from bottom ──
      tl.to(chartBars, { scaleY: 1, duration: 0.65, stagger: 0.07, ease: 'power3.out' }, 0.9)

      // ── 8. Panel 3: creator fills grow ──
      tl.to(creatorBars, { scaleX: 1, duration: 1.1, stagger: 0.18, ease: 'power2.out' }, 1.1)

      // ── 9. Footer metrics stagger in ──
      tl.to(footerItems, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, 1.4)

      // ── 10. Status dots — continuous pulse ──
      dotEls.forEach((dot, i) => {
        gsap.to(dot, {
          scale: 1.65, opacity: 0.35,
          duration: 0.9 + i * 0.12,
          repeat: -1, yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.28,
          transformOrigin: 'center',
        })
      })

      obs.disconnect()
    }, { threshold: 0.08 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 9rem) 0' }}
    >
      {/* Grain */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.02 }}>
        <filter id="sys-gr">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#sys-gr)" fill="white"/>
      </svg>

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 65% 45% at 50% 0%, hsl(199 89% 60% / 0.04) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 35% at 20% 80%, hsl(280 65% 55% / 0.025) 0%, transparent 60%)',
          ].join(', '),
        }}
      />

      {/* Top hairline */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(to right, transparent, hsl(0 0% 100% / 0.07) 30%, hsl(0 0% 100% / 0.07) 70%, transparent)',
        }}
      />

      <div className="relative z-10 max-w-[72rem] mx-auto px-6 sm:px-10">

        {/* ── Top text ── */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-18">
          <p className="sys-text font-sans font-light uppercase mb-5" style={{ fontSize: '0.62rem', letterSpacing: '0.32em', color: 'hsl(199 89% 60% / 0.7)' }}>
            Systems in Motion
          </p>
          <h2
            className="sys-text font-sans font-light text-text mb-6"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3.2rem)', lineHeight: 1.08, letterSpacing: '-0.038em', maxWidth: '52rem' }}
          >
            Websites, automations, and content systems{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(0 0% 72%)' }}>
              working as one.
            </em>
          </h2>
          <div className="sys-text" aria-hidden="true" style={{ width: '2rem', height: '1px', background: 'hsl(199 89% 60% / 0.35)', marginBottom: '1.6rem' }} />
          <p
            className="sys-text font-sans font-light"
            style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1.02rem)', lineHeight: 1.9, color: 'hsl(0 0% 40%)', maxWidth: '42rem' }}
          >
            We connect design, AI workflows, customer messaging, and growth tools into one
            polished digital experience built to attract, respond, and convert.
          </p>
        </div>

        {/* ── Dashboard ── */}
        <div className="sys-dash">
          <div
            style={{
              background: 'hsl(213 22% 5%)',
              border: '1px solid hsl(0 0% 100% / 0.07)',
              borderRadius: '1.5rem',
              padding: 'clamp(16px, 2.5vw, 28px)',
              boxShadow: [
                '0 0 0 1px hsl(0 0% 100% / 0.03)',
                '0 40px 100px -24px hsl(0 0% 0% / 0.7)',
                '0 0 80px -30px hsl(199 89% 60% / 0.06)',
              ].join(', '),
            }}
          >

            {/* Dashboard top bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '20px', paddingBottom: '14px',
              borderBottom: '1px solid hsl(0 0% 100% / 0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  className="sys-dot"
                  style={{ width: 7, height: 7, borderRadius: '50%', background: 'hsl(199 89% 55%)', boxShadow: '0 0 7px hsl(199 89% 55% / 0.7)', transformOrigin: 'center' }}
                />
                <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500, fontSize: '0.7rem', color: 'hsl(0 0% 70%)', letterSpacing: '-0.01em' }}>
                  Weavy System Dashboard
                </span>
              </div>
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.56rem', color: 'hsl(0 0% 26%)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                All systems active
              </span>
            </div>

            {/* Three-panel grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_44px_1fr_44px_1fr] gap-4 lg:gap-0">
              <WebsitePanel />
              <PanelConnector />
              <AutomationPanel />
              <PanelConnector />
              <GrowthPanel />
            </div>

            {/* Bottom metrics bar — items have .sys-footer-metric */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: '20px', paddingTop: '14px',
              borderTop: '1px solid hsl(0 0% 100% / 0.05)',
              flexWrap: 'wrap', gap: '8px',
            }}>
              {FOOTER_METRICS.map(({ label, value, color }) => (
                <div key={label} className="sys-footer-metric" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300, fontSize: '0.56rem', color: 'hsl(0 0% 30%)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400, fontSize: '0.66rem', color, letterSpacing: '-0.01em' }}>{value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to bottom, transparent, #010709)',
          pointerEvents: 'none',
        }}
      />
    </section>
  )
}
