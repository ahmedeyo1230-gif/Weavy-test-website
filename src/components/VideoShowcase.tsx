// ─── Video Showcase ───────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]
const videoSrc = "https://pub-731d5e7deddb4fce94cef7393920d429.r2.dev/Video2_weavy.mp4"

const PARTICLES = [
  { top: '12%', left: '6%',  delay: 0    },
  { top: '20%', left: '88%', delay: 1.4  },
  { top: '60%', left: '3%',  delay: 2.2  },
  { top: '70%', left: '94%', delay: 0.8  },
  { top: '36%', left: '10%', delay: 3.1  },
  { top: '76%', left: '80%', delay: 1.9  },
  { top: '16%', left: '75%', delay: 2.7  },
  { top: '50%', left: '87%', delay: 0.5  },
  { top: '85%', left: '30%', delay: 3.6  },
  { top: '8%',  left: '50%', delay: 1.1  },
  { top: '44%', left: '2%',  delay: 2.9  },
  { top: '28%', left: '96%', delay: 0.3  },
]

export default function VideoShowcase() {
  const videoRef   = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [srcReady, setSrcReady] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSrcReady(true); observer.disconnect() } },
      { rootMargin: '300px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.4) {
          if (!video.paused) video.pause()
        }
      },
      { threshold: [0, 0.4] }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="showcase"
      aria-label="Video showcase"
      className="relative px-4 sm:px-8 lg:px-12 pt-10 pb-28 md:pb-36 overflow-hidden"
      style={{ background: '#010709' }}
    >

      {/* Top fade — blends from Hero */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '240px',
          background: 'linear-gradient(to bottom, #010709 0%, rgba(1,7,9,0.75) 30%, rgba(1,7,9,0.22) 62%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      {/* ── Primary dot grid ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(125,220,255,0.09) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Secondary coarser dot grid for layered depth ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(125,220,255,0.04) 1.5px, transparent 1.5px)',
          backgroundSize: '80px 80px',
          backgroundPosition: '14px 14px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Wide outer glow ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1100px',
          height: '700px',
          background: 'radial-gradient(ellipse at center, rgba(43,168,217,0.13) 0%, rgba(43,168,217,0.06) 40%, transparent 68%)',
          filter: 'blur(56px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Particles ── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="vs-particle"
          style={{ top: p.top, left: p.left, animationDelay: `${p.delay}s` }}
        />
      ))}

      {/* ── Heading ── */}
      <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-10" style={{ position: 'relative', zIndex: 5 }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: E }}
          className="font-sans font-light uppercase mb-4"
          style={{ fontSize: '0.65rem', letterSpacing: '0.32em', color: '#94A3B8' }}
        >
          Live systems
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08, ease: E }}
          className="font-sans font-light"
          style={{
            fontSize: 'clamp(1.85rem, 4vw, 3rem)',
            lineHeight: 1.12,
            letterSpacing: '-0.035em',
          }}
        >
          <span className="shimmer-ice">
            Watch the{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
              system
            </em>{' '}
            work
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.16, ease: E }}
          className="mt-4 font-sans"
          style={{
            fontSize: 'clamp(0.85rem, 1.4vw, 0.95rem)',
            lineHeight: 1.8,
            color: '#CBD5E1',
            fontWeight: 500,
          }}
        >
          Built to run without you. Automated end-to-end, at scale.
        </motion.p>
      </div>

      {/* ── Screen wrapper — wider on desktop ── */}
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.95, delay: 0.22, ease: E }}
        className="relative w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto"
        style={{ zIndex: 5 }}
      >

        {/* Strong close glow behind video */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-60px',
            background:
              'radial-gradient(ellipse 80% 75% at 50% 50%, rgba(125,220,255,0.16) 0%, rgba(43,168,217,0.08) 45%, transparent 68%)',
            filter: 'blur(32px)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Outer ring glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-120px',
            background:
              'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(43,168,217,0.06) 0%, transparent 60%)',
            filter: 'blur(50px)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Side accent lines — hidden on small screens */}
        <div
          aria-hidden="true"
          className="hidden lg:block"
          style={{ position: 'absolute', right: 'calc(100% + 12px)', top: '50%', width: '72px', height: '1px', background: 'linear-gradient(to left, rgba(125,220,255,0.35), transparent)', zIndex: 3, pointerEvents: 'none' }}
        />
        <div
          aria-hidden="true"
          className="hidden lg:block"
          style={{ position: 'absolute', left: 'calc(100% + 12px)', top: '50%', width: '72px', height: '1px', background: 'linear-gradient(to right, rgba(125,220,255,0.35), transparent)', zIndex: 3, pointerEvents: 'none' }}
        />

        {/* Corner decorations + screen frame */}
        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Top-left */}
          <div aria-hidden="true" style={{ position: 'absolute', top: '-7px', left: '-7px', width: '28px', height: '28px', borderTop: '1.5px solid rgba(125,220,255,0.5)', borderLeft: '1.5px solid rgba(125,220,255,0.5)', pointerEvents: 'none', zIndex: 3 }} />
          {/* Top-right */}
          <div aria-hidden="true" style={{ position: 'absolute', top: '-7px', right: '-7px', width: '28px', height: '28px', borderTop: '1.5px solid rgba(125,220,255,0.5)', borderRight: '1.5px solid rgba(125,220,255,0.5)', pointerEvents: 'none', zIndex: 3 }} />
          {/* Bottom-left */}
          <div aria-hidden="true" style={{ position: 'absolute', bottom: '-7px', left: '-7px', width: '28px', height: '28px', borderBottom: '1.5px solid rgba(125,220,255,0.5)', borderLeft: '1.5px solid rgba(125,220,255,0.5)', pointerEvents: 'none', zIndex: 3 }} />
          {/* Bottom-right */}
          <div aria-hidden="true" style={{ position: 'absolute', bottom: '-7px', right: '-7px', width: '28px', height: '28px', borderBottom: '1.5px solid rgba(125,220,255,0.5)', borderRight: '1.5px solid rgba(125,220,255,0.5)', pointerEvents: 'none', zIndex: 3 }} />

          {/* Screen frame */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              borderRadius: '1.25rem',
              overflow: 'hidden',
              backgroundColor: 'hsl(0 0% 4%)',
              border: '1px solid rgba(125,220,255,0.18)',
              boxShadow:
                '0 2px 4px rgba(0,0,0,0.6),' +
                '0 32px 80px rgba(0,0,0,0.75),' +
                '0 0 0 1px rgba(125,220,255,0.08),' +
                '0 0 70px rgba(43,168,217,0.14)',
            }}
          >
            {/* Top accent line */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '1px',
                background: 'linear-gradient(to right, transparent 5%, rgba(125,220,255,0.6) 30%, rgba(125,220,255,0.8) 50%, rgba(125,220,255,0.6) 70%, transparent 95%)',
                zIndex: 6,
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
              <video
                ref={videoRef}
                controls
                loop
                playsInline
                preload={srcReady ? 'metadata' : 'none'}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  objectFit: 'cover',
                  filter: 'brightness(0.85) contrast(1.08) saturate(0.95)',
                }}
              >
                {srcReady && <source src={videoSrc} type="video/mp4" />}
              </video>
            </div>
          </div>
        </div>

      </motion.div>

      {/* Seamless blend into next section */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '320px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(11,17,20,0.12) 30%, rgba(11,17,20,0.35) 58%, rgba(11,17,20,0.62) 80%, rgba(11,17,20,0.78) 100%)',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />

    </section>
  )
}
