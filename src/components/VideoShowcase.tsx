// ─── Video Showcase ───────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'

const videoSrc = "https://pub-731d5e7deddb4fce94cef7393920d429.r2.dev/Video2_weavy.mp4"


export default function VideoShowcase() {
  const videoRef     = useRef<HTMLVideoElement>(null)
  const sectionRef   = useRef<HTMLElement>(null)
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
      style={{ background: '#02080A' }}
    >

      {/* Top fade removed — Hero's bottom fade now targets #02080A directly,
           so no hard line at the join. A redundant opaque band here would
           re-introduce the color step we just eliminated. */}

      {/* ── Heading ── */}
      <div className="max-w-2xl mx-auto text-center mb-14">
        <p
          className="font-sans font-light uppercase mb-5"
          style={{ fontSize: '0.65rem', letterSpacing: '0.32em', color: 'hsl(0 0% 36%)' }}
        >
          Live systems
        </p>
        <h2
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
        </h2>
        <p
          className="mt-5 font-sans font-light"
          style={{
            fontSize: 'clamp(0.85rem, 1.4vw, 0.95rem)',
            lineHeight: 1.8,
            color: 'hsl(0 0% 44%)',
          }}
        >
          Built to run without you. Automated end-to-end, at scale.
        </p>
      </div>

      {/* ── Screen wrapper ── */}
      <div className="relative max-w-2xl mx-auto">

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
      </div>

      {/* Seamless blend into next section — covers any glow edge */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '240px',
          background: 'linear-gradient(to bottom, rgba(2,8,10,0), #0a0a0a 60%)',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />

    </section>
  )
}
