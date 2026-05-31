import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/* ─── Pill data ─────────────────────────────────────────────── */
type DotColor = 'cyan' | 'green' | 'amber'
interface Pill { text: string; dot: DotColor }

const ROW1: Pill[] = [
  { text: 'AI Automation Active',         dot: 'cyan'  },
  { text: 'WhatsApp Flow Running',         dot: 'green' },
  { text: 'Instagram Campaign Live',       dot: 'cyan'  },
  { text: 'UGC Content Delivered',         dot: 'amber' },
  { text: 'Leads Captured',                dot: 'green' },
  { text: 'Website Launch Ready',          dot: 'cyan'  },
  { text: 'Messenger Workflow Active',     dot: 'green' },
  { text: 'Performance Tracking Enabled',  dot: 'cyan'  },
  { text: 'Booking Flow Running',          dot: 'amber' },
  { text: 'Brand System Live',             dot: 'green' },
]

const ROW2: Pill[] = [
  { text: 'Content Scheduled',            dot: 'amber' },
  { text: 'Client System Online',          dot: 'green' },
  { text: 'Chatbot Response Live',         dot: 'cyan'  },
  { text: 'Brand Assets Updated',          dot: 'amber' },
  { text: 'Social Queue Active',           dot: 'green' },
  { text: 'Analytics Running',             dot: 'cyan'  },
  { text: 'Email Sequence On',             dot: 'green' },
  { text: 'Lead Nurture Active',           dot: 'cyan'  },
  { text: 'Reply Automation Enabled',      dot: 'amber' },
  { text: 'New Enquiry Captured',          dot: 'green' },
]

const ROW3: Pill[] = [
  { text: 'Campaign Performance Up',       dot: 'green' },
  { text: 'Auto-Reply Enabled',            dot: 'cyan'  },
  { text: 'Creative Assets Live',          dot: 'amber' },
  { text: 'Instagram DM Active',           dot: 'cyan'  },
  { text: 'WhatsApp Broadcast Sent',       dot: 'green' },
  { text: 'Dashboard Updated',             dot: 'amber' },
  { text: 'CRM Integration Running',       dot: 'cyan'  },
  { text: 'Funnel Optimised',              dot: 'green' },
  { text: 'Audience Retargeting On',       dot: 'cyan'  },
  { text: 'Follow-Up Sequence Active',     dot: 'amber' },
]

/* ─── Colour map ─────────────────────────────────────────────── */
const DOTS: Record<DotColor, { bg: string; shadow: string }> = {
  cyan:  { bg: 'hsl(199 89% 60%)',  shadow: '0 0 6px hsl(199 89% 60% / 0.8)'  },
  green: { bg: 'hsl(142 68% 55%)',  shadow: '0 0 6px hsl(142 68% 55% / 0.8)'  },
  amber: { bg: 'hsl(38  95% 60%)',  shadow: '0 0 6px hsl(38 95% 60% / 0.8)'   },
}

/* ─── Single pill ─────────────────────────────────────────────── */
function SignalPill({ text, dot, delay = 0 }: Pill & { delay?: number }) {
  const { bg, shadow } = DOTS[dot]
  return (
    <div
      style={{
        display:         'inline-flex',
        alignItems:      'center',
        gap:             '0.55rem',
        padding:         '0.5rem 1.1rem',
        borderRadius:    '9999px',
        border:          '1px solid hsl(0 0% 100% / 0.09)',
        background:      'hsl(0 0% 100% / 0.04)',
        backdropFilter:  'blur(10px)',
        whiteSpace:      'nowrap',
        flexShrink:      0,
        marginRight:     '0.75rem',
      }}
    >
      {/* Pulse dot */}
      <span
        style={{
          display:        'inline-block',
          width:          '6px',
          height:         '6px',
          borderRadius:   '50%',
          background:     bg,
          boxShadow:      shadow,
          flexShrink:     0,
          animation:      'lbs-pulse 2.2s ease-in-out infinite',
          animationDelay: `${delay}s`,
        }}
      />
      {/* Label */}
      <span
        className="font-sans"
        style={{
          fontSize:      'clamp(0.7rem, 1.1vw, 0.8rem)',
          fontWeight:    300,
          letterSpacing: '0.02em',
          color:         'hsl(0 0% 68%)',
        }}
      >
        {text}
      </span>
    </div>
  )
}

/* ─── One marquee row ─────────────────────────────────────────── */
function MarqueeRow({
  pills,
  direction,
  speed,
}: {
  pills: Pill[]
  direction: 'left' | 'right'
  speed: number
}) {
  const doubled = [...pills, ...pills]
  const animName = direction === 'left' ? 'lbs-scroll-left' : 'lbs-scroll-right'

  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div
        style={{
          display:   'flex',
          width:     'max-content',
          animation: `${animName} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((p, i) => (
          <SignalPill key={i} {...p} delay={(i % pills.length) * 0.22} />
        ))}
      </div>
    </div>
  )
}

/* ─── Main component ──────────────────────────────────────────── */
export default function LiveBrandSignals() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const headerEls = el.querySelectorAll('.lbs-header-el')
    gsap.set(headerEls, { opacity: 0, y: 28 })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      gsap.to(headerEls, {
        opacity: 1, y: 0,
        duration: 1.0,
        stagger: 0.12,
        ease: 'power3.out',
      })
      obs.disconnect()
    }, { threshold: 0.08 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* CSS keyframes */}
      <style>{`
        @keyframes lbs-scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes lbs-scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes lbs-pulse {
          0%, 100% { opacity: 1;   transform: scale(1);   }
          50%       { opacity: 0.2; transform: scale(0.55); }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden"
        style={{ background: '#010709', padding: 'clamp(5rem, 10vw, 8rem) 0' }}
      >
        {/* Grain */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" style={{ opacity: 0.018 }}>
          <filter id="lbs-gr">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="n"/>
            <feColorMatrix type="saturate" values="0" in="n"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#lbs-gr)" fill="white"/>
        </svg>

        {/* Central radial glow — behind marquees */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, hsl(199 89% 60% / 0.035) 0%, transparent 65%)',
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

        {/* ── Header ── */}
        <div
          className="relative z-10 max-w-[72rem] mx-auto px-6 sm:px-10"
          style={{ marginBottom: 'clamp(3.5rem, 6vw, 5rem)' }}
        >
          {/* Label */}
          <p
            className="lbs-header-el font-sans font-light uppercase mb-5"
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.34em',
              color: 'hsl(199 89% 60% / 0.65)',
            }}
          >
            Live Brand Signals
          </p>

          {/* Headline */}
          <h2
            className="lbs-header-el font-sans font-light mb-7"
            style={{
              fontSize: 'clamp(2rem, 4.2vw, 3.4rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              color: 'hsl(0 0% 96%)',
              maxWidth: '28rem',
            }}
          >
            Digital systems{' '}
            <em style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'hsl(0 0% 65%)',
            }}>
              constantly in motion.
            </em>
          </h2>

          {/* Paragraph */}
          <p
            className="lbs-header-el font-sans font-light"
            style={{
              fontSize: 'clamp(0.84rem, 1.3vw, 0.98rem)',
              lineHeight: 1.9,
              color: 'hsl(0 0% 36%)',
              maxWidth: '32rem',
            }}
          >
            From campaign launches and chatbot interactions to social content and lead capture,
            every system is designed to keep brands moving consistently.
          </p>
        </div>

        {/* ── Marquee rows ── */}
        <div
          className="relative z-10"
          style={{
            display:        'flex',
            flexDirection:  'column',
            gap:            '0.9rem',
            /* Edge fade masks */
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)',
            maskImage:       'linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)',
          }}
        >
          <MarqueeRow pills={ROW1} direction="left"  speed={55} />
          <MarqueeRow pills={ROW2} direction="right" speed={68} />
          <MarqueeRow pills={ROW3} direction="left"  speed={48} />
        </div>

        {/* Bottom ambient blur */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px',
            background: 'linear-gradient(to bottom, transparent, #010709)',
            pointerEvents: 'none',
          }}
        />
      </section>
    </>
  )
}
