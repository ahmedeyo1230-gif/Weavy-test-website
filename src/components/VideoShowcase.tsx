// ─── Video Showcase ───────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]
const videoSrc = "https://pub-731d5e7deddb4fce94cef7393920d429.r2.dev/Video2_weavy.mp4"

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

      {/* ── Heading ── */}
      <div className="max-w-2xl mx-auto text-center mb-14">
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
          className="font-sans font-light text-text"
          style={{
            fontSize: 'clamp(1.85rem, 4vw, 3rem)',
            lineHeight: 1.12,
            letterSpacing: '-0.035em',
          }}
        >
          <span className="shimmer-gold">
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
      >

        {/* Backlight — outer halo */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-80px',
            zIndex: 0,
            background:
              'radial-gradient(ellipse 90% 75% at 50% 50%, hsl(215 85% 58% / 0.22), hsl(225 60% 40% / 0.08) 55%, transparent 72%)',
            filter: 'blur(56px)',
          }}
        />

        {/* Backlight — tight bright core */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-24px',
            zIndex: 0,
            background:
              'radial-gradient(ellipse 85% 70% at 50% 50%, hsl(210 100% 78% / 0.18), hsl(218 80% 62% / 0.10) 50%, transparent 72%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Floor reflection */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-64px',
            left: '15%',
            right: '15%',
            height: '64px',
            zIndex: 0,
            background:
              'radial-gradient(ellipse 85% 100% at 50% 0%, hsl(212 80% 60% / 0.12), transparent 70%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Screen frame */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            borderRadius: '1.25rem',
            overflow: 'hidden',
            backgroundColor: 'hsl(0 0% 4%)',
            border: '1px solid hsl(0 0% 100% / 0.10)',
            boxShadow: '0 2px 4px hsl(0 0% 0% / 0.5), 0 24px 64px hsl(0 0% 0% / 0.65)',
          }}
        >
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
