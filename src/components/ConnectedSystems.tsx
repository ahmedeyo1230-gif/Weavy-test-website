import { motion } from 'framer-motion'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

const FLOW_STEPS = [
  { id: 'visit',    label: 'Website Visit',     icon: 'globe',   color: '#7DDCFF', delay: 0    },
  { id: 'chat',     label: 'Chatbot / WhatsApp', icon: 'chat',    color: '#34D399', delay: 0.08 },
  { id: 'lead',     label: 'Lead Captured',      icon: 'capture', color: '#7DDCFF', delay: 0.16 },
  { id: 'crm',      label: 'CRM Updated',        icon: 'crm',     color: '#A78BFA', delay: 0.24 },
  { id: 'followup', label: 'Follow-up Sent',      icon: 'mail',    color: '#34D399', delay: 0.32 },
  { id: 'booking',  label: 'Booking Confirmed',   icon: 'check',   color: '#F0C56A', delay: 0.40 },
]

const FLOAT_CARDS = [
  { label: 'New Lead',          sub: 'John Smith · just now',  color: '#7DDCFF', dot: '#22D3EE', top: '8%',  left: '-6%',  delay: 0    },
  { label: 'WhatsApp Reply',    sub: 'Auto-sent · 0s delay',   color: '#34D399', dot: '#34D399', top: '34%', left: '-10%', delay: 0.14 },
  { label: 'CRM Updated',       sub: 'HubSpot · synced',       color: '#A78BFA', dot: '#A78BFA', top: '63%', left: '-7%',  delay: 0.22 },
  { label: 'Follow-up Sent',    sub: 'Email #1 · delivered',   color: '#34D399', dot: '#34D399', top: '8%',  right: '-6%', delay: 0.1  },
  { label: 'Booking Confirmed', sub: 'Calendly · confirmed',   color: '#F0C56A', dot: '#F0C56A', top: '40%', right: '-10%',delay: 0.28 },
]

function Icon({ type, color }: { type: string; color: string }) {
  const s = { width: 20, height: 20, fill: 'none', stroke: color, strokeWidth: 1.55, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
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
  if (type === 'capture') return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )
  if (type === 'crm') return (
    <svg viewBox="0 0 24 24" style={s}>
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>
  )
  if (type === 'mail') return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  )
  if (type === 'check') return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
    </svg>
  )
  return null
}

/* ── Central dashboard mock ── */
function DashboardMock() {
  const bars = [42, 68, 55, 82, 61, 90, 74]
  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        maxWidth: 510,
        borderRadius: 24,
        background: 'linear-gradient(145deg, rgba(8,20,28,0.96) 0%, rgba(4,10,18,0.98) 100%)',
        border: '1px solid rgba(125,220,255,0.14)',
        boxShadow: '0 48px 120px -14px rgba(0,0,0,0.90), 0 0 0 1px rgba(125,220,255,0.07), 0 0 100px -20px rgba(125,220,255,0.26)',
        padding: '0 0 26px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top bar */}
      <div style={{ padding: '20px 26px 17px', borderBottom: '1px solid rgba(125,220,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', gap: 7 }}>
          {['rgba(255,90,90,0.7)','rgba(255,185,40,0.7)','rgba(50,215,100,0.7)'].map((c,i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 12.5, color: 'rgba(125,220,255,0.45)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Weavy · Automation Dashboard
        </div>
      </div>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, padding: '20px 20px 0' }}>
        {[
          { v: '247', l: 'Leads',      c: '#7DDCFF' },
          { v: '94%', l: 'Reply Rate', c: '#34D399' },
          { v: '38',  l: 'Bookings',   c: '#F0C56A' },
        ].map(({ v, l, c }) => (
          <div key={l} style={{ background: 'rgba(125,220,255,0.04)', border: `1px solid ${c}22`, borderRadius: 14, padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 25, fontWeight: 600, color: c, lineHeight: 1.1, fontFamily: 'monospace' }}>{v}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 5 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 11, color: 'rgba(125,220,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 11 }}>Weekly Enquiries</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7, height: 82 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
              <div style={{
                width: '100%',
                height: `${h}%`,
                borderRadius: '5px 5px 0 0',
                background: i === 5
                  ? 'linear-gradient(to top, rgba(125,220,255,0.72), rgba(125,220,255,0.32))'
                  : i === 3
                  ? 'linear-gradient(to top, rgba(52,211,153,0.65), rgba(52,211,153,0.28))'
                  : 'linear-gradient(to top, rgba(125,220,255,0.22), rgba(125,220,255,0.08))',
              }} />
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: 'rgba(125,220,255,0.08)', marginTop: 6 }} />
      </div>

      {/* Activity feed */}
      <div style={{ padding: '17px 20px 0' }}>
        <div style={{ fontSize: 11, color: 'rgba(125,220,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 11 }}>Live Activity</div>
        {[
          { label: 'New lead: Emma Wilson',  time: '2s ago',  dot: '#7DDCFF' },
          { label: 'CRM synced · HubSpot',   time: '14s ago', dot: '#A78BFA' },
          { label: 'Follow-up email sent',   time: '1m ago',  dot: '#34D399' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: r.dot, flexShrink: 0, boxShadow: `0 0 8px ${r.dot}88` }} />
            <div style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.62)' }}>{r.label}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>{r.time}</div>
          </div>
        ))}
      </div>

      {/* Ambient glow overlay */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(125,220,255,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />
    </div>
  )
}

/* ── Floating automation card ── */
function FloatCard({ label, sub, color, dot, style }: { label: string; sub: string; color: string; dot: string; style: React.CSSProperties }) {
  return (
    <div style={{
      position: 'absolute',
      ...style,
      background: 'rgba(6,14,20,0.92)',
      border: `1px solid ${color}28`,
      borderRadius: 15,
      padding: '13px 20px',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: `0 12px 44px rgba(0,0,0,0.62), 0 0 0 1px ${color}16`,
      minWidth: 210,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: dot, boxShadow: `0 0 10px ${dot}`, flexShrink: 0 }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: '#F1F5F9', letterSpacing: '0.01em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.38)', marginTop: 5, paddingLeft: 19 }}>{sub}</div>
    </div>
  )
}

export default function ConnectedSystems() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 9vw, 8rem) 0' }}
      aria-label="Connected Systems"
    >
      {/* Background glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: [
          'radial-gradient(ellipse 55% 60% at 68% 50%, rgba(125,220,255,0.055) 0%, transparent 65%)',
          'radial-gradient(ellipse 40% 40% at 20% 30%, rgba(52,211,153,0.025) 0%, transparent 60%)',
        ].join(', '),
      }} />

      {/* Dot grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'radial-gradient(rgba(125,220,255,0.06) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 60% 50%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 60% 50%, black 30%, transparent 100%)',
      }} />

      {/* Top / bottom fades */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, #010709, transparent)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to top, #010709, transparent)', pointerEvents: 'none' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.18fr] gap-14 lg:gap-16 items-center">

          {/* ── Left: text ── */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: E }}
              style={{ fontSize: '0.67rem', letterSpacing: '0.30em', textTransform: 'uppercase', color: 'rgba(125,220,255,0.65)', marginBottom: '1.4rem' }}
            >
              Connected Systems
            </motion.p>

            {/* Heading ~13% larger */}
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.72, delay: 0.07, ease: E }}
              className="font-sans font-light"
              style={{ fontSize: 'clamp(2.5rem, 5.6vw, 4.1rem)', lineHeight: 1.08, letterSpacing: '-0.038em', color: '#F8FAFC', marginBottom: '1.6rem' }}
            >
              From first click to{' '}
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: '#7DDCFF' }}>
                booked client.
              </em>
            </motion.h2>

            {/* Paragraph slightly larger */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.15, ease: E }}
              className="font-sans font-light"
              style={{ fontSize: 'clamp(1rem, 1.65vw, 1.15rem)', lineHeight: 1.82, color: '#94A3B8', maxWidth: '34rem', marginBottom: '2.8rem' }}
            >
              We connect your website, chatbot, CRM, and follow-up systems so every
              enquiry is captured, organised, and moved closer to conversion.
            </motion.p>

            {/* Flow steps — larger icons, bigger text, more breathing room */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {FLOW_STEPS.map((step, i) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.48, delay: 0.28 + step.delay, ease: E }}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: `${step.color}12`,
                      border: `1px solid ${step.color}38`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 0 14px ${step.color}20`,
                    }}>
                      <Icon type={step.icon} color={step.color} />
                    </div>
                    {i < FLOW_STEPS.length - 1 && (
                      <div style={{ width: 1, height: 16, background: `linear-gradient(to bottom, ${step.color}28, transparent)`, marginTop: 2 }} />
                    )}
                  </div>
                  <span style={{ fontSize: '0.97rem', color: i === 5 ? '#F0C56A' : 'rgba(248,250,252,0.76)', fontWeight: i === 5 ? 500 : 400 }}>
                    {step.label}
                    {i < FLOW_STEPS.length - 1 && (
                      <span style={{ color: 'rgba(125,220,255,0.28)', marginLeft: 10, fontSize: '0.82rem' }}>→</span>
                    )}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right: dashboard + floating cards ── */}
          <motion.div
            initial={{ opacity: 0, x: 28, scale: 0.90 }}
            whileInView={{ opacity: 1, x: 0, scale: 0.90 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.18, ease: E }}
            className="relative flex items-center justify-center"
            style={{ minHeight: 640, transformOrigin: 'right center' }}
          >
            {/* Floating cards — left side */}
            {FLOAT_CARDS.filter(c => c.left !== undefined).map(c => (
              <FloatCard
                key={c.label}
                label={c.label}
                sub={c.sub}
                color={c.color}
                dot={c.dot}
                style={{ top: c.top, left: c.left }}
              />
            ))}

            {/* Floating cards — right side */}
            {FLOAT_CARDS.filter(c => c.right !== undefined).map(c => (
              <FloatCard
                key={c.label}
                label={c.label}
                sub={c.sub}
                color={c.color}
                dot={c.dot}
                style={{ top: c.top, right: c.right }}
              />
            ))}

            {/* Connecting lines SVG */}
            <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
              <defs>
                <linearGradient id="cs-line-l" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(125,220,255,0)" />
                  <stop offset="100%" stopColor="rgba(125,220,255,0.22)" />
                </linearGradient>
                <linearGradient id="cs-line-r" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(125,220,255,0.22)" />
                  <stop offset="100%" stopColor="rgba(125,220,255,0)" />
                </linearGradient>
              </defs>
              <line x1="22%" y1="15%" x2="40%" y2="28%" stroke="url(#cs-line-l)" strokeWidth="0.9" strokeDasharray="3 6" />
              <line x1="18%" y1="40%" x2="40%" y2="48%" stroke="url(#cs-line-l)" strokeWidth="0.9" strokeDasharray="3 6" />
              <line x1="20%" y1="68%" x2="40%" y2="62%" stroke="url(#cs-line-l)" strokeWidth="0.9" strokeDasharray="3 6" />
              <line x1="60%" y1="28%" x2="80%" y2="18%" stroke="url(#cs-line-r)" strokeWidth="0.9" strokeDasharray="3 6" />
              <line x1="60%" y1="48%" x2="82%" y2="46%" stroke="url(#cs-line-r)" strokeWidth="0.9" strokeDasharray="3 6" />
            </svg>

            {/* Central dashboard */}
            <div style={{ position: 'relative', zIndex: 5 }}>
              <DashboardMock />
            </div>

            {/* Ambient glow behind dashboard */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: '-30px',
              background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(125,220,255,0.08) 0%, transparent 68%)',
              filter: 'blur(28px)',
              pointerEvents: 'none',
              zIndex: 0,
            }} />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
