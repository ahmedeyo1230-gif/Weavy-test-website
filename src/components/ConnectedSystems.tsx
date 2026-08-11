import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]
const GOLD = '#E8C97A'

const FLOAT_CARDS = [
  { label: 'New Lead',          sub: 'John Smith · just now', color: '#7DDCFF', dot: '#22D3EE', pos: { top: '-22px', left: '-18px' } },
  { label: 'CRM Updated',       sub: 'HubSpot · synced',      color: '#A78BFA', dot: '#A78BFA', pos: { bottom: '-22px', left: '-18px' } },
  { label: 'Booking Confirmed', sub: 'Calendly · confirmed',  color: GOLD,      dot: GOLD,       pos: { bottom: '-22px', right: '-18px' }, gold: true },
]

/* ── Hooks ── */

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

function useCountUp(target: number, duration: number, active: boolean, reduced: boolean): number {
  const [val, setVal] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    if (!active) return
    if (started.current) return
    started.current = true
    if (reduced) { setVal(target); return }
    let startTs: number | null = null
    let rafId: number
    const tick = (ts: number) => {
      if (!startTs) startTs = ts
      const p = Math.min((ts - startTs) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * target))
      if (p < 1) rafId = requestAnimationFrame(tick)
      else setVal(target)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps
  return val
}

/* ── Icon ── */

function Icon({ type, color, size = 20 }: { type: string; color: string; size?: number }) {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth: 1.55, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (type === 'globe') return (
    <svg viewBox="0 0 24 24" style={s}>
      <circle cx="12" cy="12" r="9"/><path d="M12 3a14 14 0 010 18M12 3a14 14 0 000 18M3 12h18"/>
    </svg>
  )
  if (type === 'chat') return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  )
  if (type === 'crm') return (
    <svg viewBox="0 0 24 24" style={s}>
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>
  )
  if (type === 'phone') return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.98.36 1.94.68 2.86a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.22-1.25a2 2 0 012.11-.45c.92.32 1.88.55 2.86.68A2 2 0 0122 16.92z"/>
    </svg>
  )
  if (type === 'camera') return (
    <svg viewBox="0 0 24 24" style={s}>
      <rect x="2" y="6" width="20" height="14" rx="3"/><circle cx="12" cy="13" r="3.6"/><path d="M8 6l1.4-2.4A1.6 1.6 0 0110.78 3h2.44a1.6 1.6 0 011.38.8L16 6"/>
    </svg>
  )
  if (type === 'bubble2') return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M12 3C6.5 3 2 6.9 2 11.7c0 2.7 1.45 5.13 3.73 6.73L5 22l3.98-2.1c.94.25 1.95.39 3.02.39 5.5 0 10-3.9 10-8.6S17.5 3 12 3z"/><path d="M9 12.2l2.1-2.3 2 1.6 2.1-2.3"/>
    </svg>
  )
  return null
}

const CHANNELS = [
  { label: 'Voice Agent',          icon: 'phone',   color: '#F0C56A' },
  { label: 'WhatsApp',             icon: 'chat',    color: '#34D399' },
  { label: 'Instagram DM',         icon: 'camera',  color: '#E879C9' },
  { label: 'Facebook Messenger',   icon: 'bubble2', color: '#6BA9FF' },
  { label: 'Website Chat',         icon: 'globe',   color: '#7DDCFF' },
  { label: 'CRM Sync',             icon: 'crm',     color: '#A78BFA' },
]

function ChannelBadges() {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: 11, color: 'rgba(125,220,255,0.46)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 11 }}>
        Connected Channels
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {CHANNELS.map(ch => (
          <div
            key={ch.label}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 10px 6px 8px',
              borderRadius: 999,
              background: `${ch.color}0F`,
              border: `1px solid ${ch.color}30`,
            }}
          >
            <span style={{ display: 'inline-flex' }}>
              <Icon type={ch.icon} color={ch.color} size={14} />
            </span>
            <span style={{ fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: 11.5, color: 'rgba(255,255,255,0.74)', whiteSpace: 'nowrap' }}>{ch.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Central dashboard mock — wide "hero" format ── */

function DashboardMock({ leads, reply, bookings, inView, reduced }: { leads: number; reply: number; bookings: number; inView: boolean; reduced: boolean }) {
  const bars = [42, 68, 55, 82, 61, 90, 74]
  const barsUp = reduced || inView
  return (
    <div
      aria-hidden="true"
      className="w-full"
      style={{
        borderRadius: 24,
        background: 'linear-gradient(145deg, rgba(9,22,30,0.97) 0%, rgba(4,10,18,0.985) 100%)',
        border: '1px solid rgba(125,220,255,0.20)',
        boxShadow: '0 56px 140px -20px rgba(0,0,0,0.90), 0 0 0 1px rgba(125,220,255,0.09), 0 0 120px -24px rgba(125,220,255,0.24)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top bar */}
      <div style={{ padding: '22px 28px 18px', borderBottom: '1px solid rgba(125,220,255,0.10)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', gap: 7 }}>
          {['rgba(255,90,90,0.7)','rgba(255,185,40,0.7)','rgba(50,215,100,0.7)'].map((c,i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ fontFamily: 'var(--font-label)', fontWeight: 500, flex: 1, textAlign: 'center', fontSize: 'clamp(10.5px, 3vw, 12.5px)', lineHeight: 1.5, color: 'rgba(125,220,255,0.52)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Connected Workflow
        </div>
      </div>

      {/* Channels + stats (left) / chart (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-10" style={{ padding: '26px 28px 0' }}>
        <div>
          <ChannelBadges />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 22 }}>
            {[
              { v: String(leads),     l: 'Leads',      c: '#7DDCFF' },
              { v: `${reply}%`,       l: 'Reply Rate',  c: '#34D399' },
              { v: String(bookings),  l: 'Bookings',    c: GOLD },
            ].map(({ v, l, c }) => (
              <div key={l} style={{ background: 'rgba(125,220,255,0.05)', border: `1px solid ${c}28`, borderRadius: 14, padding: '16px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 25, fontWeight: 600, color: c, lineHeight: 1.1, fontFamily: 'monospace' }}>{v}</div>
                <div style={{ fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: 11, color: 'rgba(255,255,255,0.46)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 5 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: 11, color: 'rgba(125,220,255,0.46)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 11 }}>Weekly Enquiries</div>
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7, height: 92 }}>
              {bars.map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  <div style={{
                    width: '100%',
                    height: barsUp ? `${h}%` : '0%',
                    transition: reduced ? 'none' : `height 650ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 60}ms`,
                    borderRadius: '5px 5px 0 0',
                    background: i === 5
                      ? 'linear-gradient(to top, rgba(125,220,255,0.72), rgba(125,220,255,0.32))'
                      : i === 3
                      ? 'linear-gradient(to top, rgba(52,211,153,0.65), rgba(52,211,153,0.28))'
                      : 'linear-gradient(to top, rgba(125,220,255,0.24), rgba(125,220,255,0.09))',
                  }} />
                </div>
              ))}
            </div>
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}>
              <div
                className="cs-chart-shimmer"
                style={{
                  position: 'absolute', top: 0, bottom: 0, left: 0, width: '45%',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(125,220,255,0.11) 50%, transparent 100%)',
                }}
              />
            </div>
          </div>
          <div style={{ height: 1, background: 'rgba(125,220,255,0.10)', marginTop: 6 }} />
        </div>
      </div>

      {/* Activity feed — full-width row on wide dashboard */}
      <div className="pb-9 min-[640px]:pb-20" style={{ paddingTop: 24, paddingLeft: 28, paddingRight: 28 }}>
        <div style={{ fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: 11, color: 'rgba(125,220,255,0.46)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Live Activity</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'New lead: Emma Wilson',  time: '2s ago',  dot: '#7DDCFF' },
            { label: 'CRM synced · HubSpot',   time: '14s ago', dot: '#A78BFA' },
            { label: 'Follow-up email sent',   time: '1m ago',  dot: '#34D399' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 12, background: 'rgba(125,220,255,0.035)', border: '1px solid rgba(125,220,255,0.09)' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: r.dot, flexShrink: 0, boxShadow: `0 0 8px ${r.dot}88` }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: 12.5, color: 'rgba(255,255,255,0.72)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.label}</div>
                <div style={{ fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: 10.5, color: 'rgba(255,255,255,0.32)', marginTop: 2 }}>{r.time}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Sample-data disclaimer — the figures above are illustrative, not
            verified client results, since Weavy connects/manages third-party
            systems rather than owning this dashboard software itself. */}
        <div style={{ fontFamily: 'var(--font-label)', fontWeight: 500, marginTop: 14, fontSize: 10.5, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.02em', textAlign: 'center' }}>
          Illustrative workflow and sample data
        </div>
      </div>

      {/* Ambient glow overlay */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(125,220,255,0.045) 0%, transparent 60%)', pointerEvents: 'none' }} />
    </div>
  )
}

/* ── Floating notification badge — one-time settle-in, no continuous motion ── */

function FloatCard({
  label, sub, color, dot, gold, style, reduced, delay,
}: {
  label: string; sub: string; color: string; dot: string; gold?: boolean
  style: React.CSSProperties; reduced: boolean; delay: number
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8, scale: 0.96 }}
      whileInView={
        gold
          ? { opacity: 1, y: 0, scale: 1, boxShadow: '0 0 24px rgba(232, 201, 122, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.03)' }
          : { opacity: 1, y: 0, scale: 1 }
      }
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: E }}
      className="hidden min-[640px]:block"
      style={{
        position: 'absolute',
        ...style,
        background: 'rgba(6,14,20,0.94)',
        border: `1px solid ${color}30`,
        borderRadius: 14,
        padding: '12px 18px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: `0 12px 40px rgba(0,0,0,0.60), 0 0 0 1px ${color}14`,
        minWidth: 196,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot, boxShadow: `0 0 9px ${dot}` }} />
        <span style={{ fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: 13.5, color: '#F1F5F9', letterSpacing: '0.01em' }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-label)', fontWeight: 500, fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 4, paddingLeft: 17 }}>{sub}</div>
    </motion.div>
  )
}

/* ── Main export ── */

export default function ConnectedSystems() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.18 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const leads    = useCountUp(247, 3800, inView, reduced)
  const reply    = useCountUp(94,  3400, inView, reduced)
  const bookings = useCountUp(38,  3000, inView, reduced)

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        background: '#000506',
        paddingTop: 'clamp(96px, 15vw, 200px)',
        paddingBottom: 'clamp(96px, 15vw, 200px)',
      }}
      aria-label="Connected Systems"
    >
      {/* Thin glowing connection line continuing down from the Weavy Platform
          section above — fades in from transparent so it reads as a
          continuation rather than a hard-edged line starting mid-air. */}
      <motion.div
        aria-hidden="true"
        className="connected-system-line pointer-events-none absolute left-1/2 top-0"
        initial={reduced ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: E }}
        style={{
          width: 1,
          height: 'clamp(120px, 16vw, 200px)',
          transform: 'translateX(-50%)',
          transformOrigin: 'top',
          background: 'linear-gradient(to bottom, rgba(125, 220, 255, 0), rgba(125, 220, 255, 0.42), rgba(125, 220, 255, 0.10))',
          boxShadow: '0 0 18px rgba(125, 220, 255, 0.18)',
          zIndex: 1,
        }}
      />

      {/* Ambient glow behind the dashboard — kept below the Platform section's
          brightness, per the "not brighter than Platform" requirement. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(circle at 50% 48%, rgba(24, 105, 125, 0.11) 0%, rgba(5, 26, 32, 0.05) 42%, rgba(1, 7, 9, 0) 72%)',
      }} />

      {/* Very faint dotted texture */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'radial-gradient(rgba(125,220,255,0.045) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 25%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 25%, transparent 100%)',
      }} />

      {/* Top / bottom fades */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, #000506, transparent)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to top, #000506, transparent)', pointerEvents: 'none' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">

        {/* ── Editorial header ── */}
        <div
          className="grid grid-cols-1 min-[900px]:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)] min-[900px]:items-end"
          style={{ columnGap: 80 }}
        >
          <div>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12, ease: E }}
              className="font-label"
              style={{ fontSize: '0.85rem', letterSpacing: '0.30em', textTransform: 'uppercase', color: 'rgba(174,235,255,0.94)', marginBottom: '1.4rem' }}
            >
              Connected Systems
            </motion.p>

            <motion.h2
              initial={reduced ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.18, ease: E }}
              className="font-heading font-medium"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 6rem)', lineHeight: 0.98, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}
            >
              From first click to{' '}
              <em style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 400, color: '#7DDCFF' }}>
                booked client.
              </em>
            </motion.h2>
          </div>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.24, ease: E }}
            className="font-body font-normal"
            style={{ fontSize: 'clamp(17px, 1.2vw, 18px)', lineHeight: 1.7, color: 'var(--text-body)', maxWidth: 430, marginTop: '1.6rem' }}
          >
            Designed to capture, qualify and follow up enquiries—moving more
            conversations towards booking.
          </motion.p>
        </div>

        {/* ── Dashboard hero ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.38, ease: E }}
          className="relative mx-auto"
          style={{ width: 'min(86vw, 1240px)', marginTop: 'clamp(56px, 9vw, 100px)' }}
        >
          {/* Soft ambient glow behind the dashboard only — gives it a
              slightly elevated feel without a hard shape or new panel. */}
          <div aria-hidden="true" className="pointer-events-none absolute" style={{
            inset: '-9%',
            background: 'radial-gradient(ellipse 60% 56% at 50% 50%, rgba(24,105,125,0.16) 0%, rgba(5,26,32,0.07) 45%, rgba(1,7,9,0) 78%)',
            filter: 'blur(44px)',
          }} />

          {FLOAT_CARDS.map((c, i) => (
            <FloatCard
              key={c.label}
              label={c.label}
              sub={c.sub}
              color={c.color}
              dot={c.dot}
              gold={c.gold}
              style={c.pos}
              reduced={reduced}
              delay={0.5 + i * 0.08}
            />
          ))}

          <DashboardMock leads={leads} reply={reply} bookings={bookings} inView={inView} reduced={reduced} />
        </motion.div>

      </div>
    </section>
  )
}
