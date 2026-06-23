// ─── Video Showcase ───────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]
const videoSrc = "https://pub-731d5e7deddb4fce94cef7393920d429.r2.dev/Video2_weavy.mp4"

const PARTICLES = [
  { top: '14%', left: '7%',  delay: 0    },
  { top: '22%', left: '89%', delay: 1.4  },
  { top: '62%', left: '4%',  delay: 2.2  },
  { top: '72%', left: '93%', delay: 0.8  },
  { top: '38%', left: '11%', delay: 3.1  },
  { top: '78%', left: '79%', delay: 1.9  },
  { top: '18%', left: '74%', delay: 2.7  },
  { top: '52%', left: '86%', delay: 0.5  },
  { top: '88%', left: '32%', delay: 3.6  },
  { top: '10%', left: '52%', delay: 1.1  },
]

export default function VideoShowcase() {
  const videoRef   = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [srcReady, setSrcReady] = useState(false)

  // Defer setting the video src until the section is near the viewport
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

  // Pause when scrolled offscreen
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
      className="relative px-6 sm:px-10 pt-8 pb-36 md:pb-44 overflow-hidden"
      style={{ background: '#071011' }}
    >

      {/* ── Dot grid ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(125,220,255,0.055) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Large ambient glow centred on video ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '48%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '900px',
          height: '600px',
          background: 'radial-gradient(ellipse at center, rgba(43,168,217,0.09) 0%, rgba(43,168,217,0.04) 45%, transparent 70%)',
          filter: 'blur(48px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Ambient particles ── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="vs-particle"
          style={{ top: p.top, left: p.left, animationDelay: `${p.delay}s` }}
        />
      ))}

      {/* ── Heading ── */}
      <div className="max-w-2xl mx-auto text-center mb-14" style={{ position: 'relative', zIndex: 5 }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: E }}
          className="font-sans font-light uppercase mb-5"
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
          className="mt-5 font-sans"
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

      {/* ── Screen wrapper ── */}
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.95, delay: 0.22, ease: E }}
        className="relative max-w-3xl mx-auto"
        style={{ zIndex: 5 }}
      >

        {/* Tight teal glow directly behind video */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-50px',
            background: 'radial-gradient(ellipse 85% 80% at 50% 50%, rgba(125,220,255,0.10) 0%, rgba(43,168,217,0.05) 50%, transparent 72%)',
            filter: 'blur(24px)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Corner decorations + screen frame */}
        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Top-left */}
          <div aria-hidden="true" style={{ position: 'absolute', top: '-6px', left: '-6px', width: '20px', height: '20px', borderTop: '1px solid rgba(125,220,255,0.4)', borderLeft: '1px solid rgba(125,220,255,0.4)', pointerEvents: 'none', zIndex: 3 }} />
          {/* Top-right */}
          <div aria-hidden="true" style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderTop: '1px solid rgba(125,220,255,0.4)', borderRight: '1px solid rgba(125,220,255,0.4)', pointerEvents: 'none', zIndex: 3 }} />
          {/* Bottom-left */}
          <div aria-hidden="true" style={{ position: 'absolute', bottom: '-6px', left: '-6px', width: '20px', height: '20px', borderBottom: '1px solid rgba(125,220,255,0.4)', borderLeft: '1px solid rgba(125,220,255,0.4)', pointerEvents: 'none', zIndex: 3 }} />
          {/* Bottom-right */}
          <div aria-hidden="true" style={{ position: 'absolute', bottom: '-6px', right: '-6px', width: '20px', height: '20px', borderBottom: '1px solid rgba(125,220,255,0.4)', borderRight: '1px solid rgba(125,220,255,0.4)', pointerEvents: 'none', zIndex: 3 }} />

          {/* Screen frame */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              borderRadius: '1.25rem',
              overflow: 'hidden',
              backgroundColor: 'hsl(0 0% 4%)',
              border: '1px solid rgba(125,220,255,0.14)',
              boxShadow:
                '0 2px 4px rgba(0,0,0,0.6),' +
                '0 24px 64px rgba(0,0,0,0.7),' +
                '0 0 0 1px rgba(125,220,255,0.06),' +
                '0 0 48px rgba(43,168,217,0.10)',
            }}
          >
            {/* Scan line */}
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', overflow: 'hidden' }}>
              <div className="vs-scan-line" />
            </div>

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
          height: '480px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(11,17,20,0.2) 25%, rgba(11,17,20,0.55) 50%, rgba(11,17,20,0.85) 72%, #0B1114 88%)',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />

    </section>
  )
}
