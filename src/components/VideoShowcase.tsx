// ─── Video Showcase — Matrix Sky full-screen scroll-scrub ───────────────────

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

const videoSrc = "/videos/matrix-sky-scroll.mp4"
const posterSrc = "/images/matrix-sky-poster.webp"

// Desktop/tablet get the pinned scroll-scrub; below this width, mobile uses
// the autoplay-on-view fallback instead — matches the project's existing
// mobile breakpoint.
const DESKTOP_MQ = '(min-width: 640px)'
const REDUCED_MOTION_MQ = '(prefers-reduced-motion: reduce)'

// Subtle cinematic corner brackets, inset from the viewport edges. Purely a
// decorative overlay on top of the full-screen video — not a frame/card.
function CornerMarkers() {
  const inset = 'clamp(16px, 3vw, 32px)'
  const size = 'clamp(22px, 2.6vw, 34px)'
  const border = '1.5px solid rgba(125,220,255,0.35)'
  const common: CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    pointerEvents: 'none',
    zIndex: 3,
  }
  return (
    <>
      <div aria-hidden="true" style={{ ...common, top: inset, left: inset, borderTop: border, borderLeft: border }} />
      <div aria-hidden="true" style={{ ...common, top: inset, right: inset, borderTop: border, borderRight: border }} />
      <div aria-hidden="true" style={{ ...common, bottom: inset, left: inset, borderBottom: border, borderLeft: border }} />
      <div aria-hidden="true" style={{ ...common, bottom: inset, right: inset, borderBottom: border, borderRight: border }} />
    </>
  )
}

// Hero's own bottom fade ends flush on an opaque #010709, but the video's
// actual first-frame content doesn't share that flat color — so the cut
// from Hero into the video reads as a hard seam even with zero gap/border
// between them. This re-introduces a short blend (same technique the old
// framed-card design used) so the video eases in instead of hard-cutting.
function SeamBlend() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '96px',
        background: 'linear-gradient(to bottom, #010709 0%, rgba(1,7,9,0.55) 45%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  )
}

const videoStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  objectFit: 'cover',
  objectPosition: 'center',
  pointerEvents: 'none',
  filter: 'brightness(0.86) contrast(1.06) saturate(0.94)',
}

export default function VideoShowcase() {
  const sectionRef      = useRef<HTMLElement>(null)
  const scrollTrackRef  = useRef<HTMLDivElement>(null)
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef  = useRef<HTMLVideoElement>(null)
  const [srcReady, setSrcReady] = useState(false)
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_MQ).matches
  )

  // Lazy-mount the <source> once the section is getting close to the viewport.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSrcReady(true); observer.disconnect() } },
      { rootMargin: '400px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Desktop/tablet — pinned scroll-scrub: map the outer track's scroll
  // progress (0→1) onto video.currentTime, eased via rAF. Refs only — no
  // React state changes on scroll, so no extra re-renders.
  useEffect(() => {
    if (reducedMotion) return
    if (!window.matchMedia(DESKTOP_MQ).matches) return

    const video = desktopVideoRef.current
    const track = scrollTrackRef.current
    if (!video || !track) return

    let duration = 0
    let currentTime = 0
    let targetProgress = 0
    let rafId: number | null = null
    let lastWriteAt = 0

    // Safari's video decoder needs a real play() call at least once before
    // programmatic currentTime seeks reliably take effect — without this,
    // scroll-scrub can silently stall/freeze on Safari specifically. A
    // muted play immediately followed by pause "primes" it with no visible
    // flash, and is a no-op if the browser already handles seeks fine.
    let primed = false
    const primeSafari = () => {
      if (primed) return
      primed = true
      video.muted = true
      const p = video.play()
      if (p && typeof p.then === 'function') {
        p.then(() => video.pause()).catch(() => {})
      }
    }
    const onLoadedMetadata = () => { duration = video.duration || 0; primeSafari() }
    video.addEventListener('loadedmetadata', onLoadedMetadata)

    const computeProgress = () => {
      const rect = track.getBoundingClientRect()
      const scrollable = track.offsetHeight - window.innerHeight
      if (scrollable <= 0) return 0
      const rawProgress = Math.min(1, Math.max(0, -rect.top / scrollable))
      // Only the first ~90% of the scroll track drives the video; the final
      // 10% holds on the last frame so the eased value fully catches up
      // before the section releases — otherwise a fast scroll can outrun
      // the easing and the next section appears before playback finishes.
      return Math.min(1, rawProgress / 0.9)
    }

    const tick = (now: number) => {
      if (duration > 0) {
        const targetTime = targetProgress * duration
        currentTime += (targetTime - currentTime) * 0.12
        // Throttle actual seeks to ~30/s (well above the source's 24fps) —
        // writing on every rAF (~60/s) is what causes Safari to stutter or
        // momentarily freeze under fast/continuous scrolling.
        if (now - lastWriteAt >= 33 && Math.abs(video.currentTime - currentTime) > 0.03) {
          video.currentTime = currentTime
          lastWriteAt = now
        }
      }
      rafId = requestAnimationFrame(tick)
    }
    const startLoop = () => { if (rafId == null) rafId = requestAnimationFrame(tick) }
    const stopLoop  = () => { if (rafId != null) { cancelAnimationFrame(rafId); rafId = null } }

    const onScroll = () => { targetProgress = computeProgress() }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Only run the rAF loop while the track is near/in the viewport.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { onScroll(); startLoop() } else { stopLoop() }
    }, { rootMargin: '200px 0px' })
    io.observe(track)

    onScroll()
    if (track.getBoundingClientRect().top < window.innerHeight) startLoop()

    return () => {
      window.removeEventListener('scroll', onScroll)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      io.disconnect()
      stopLoop()
    }
  }, [reducedMotion, srcReady])

  // Mobile — autoplay-on-view fallback instead of scroll-scrub (no pinning,
  // no scroll hijacking).
  useEffect(() => {
    if (reducedMotion) return
    if (window.matchMedia(DESKTOP_MQ).matches) return

    const video = mobileVideoRef.current
    if (!video) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: [0, 0.35, 0.4, 1] }
    )
    io.observe(video)
    return () => io.disconnect()
  }, [reducedMotion, srcReady])

  return (
    <section
      ref={sectionRef}
      id="showcase"
      aria-label="Matrix Sky system visual"
      className="relative"
      style={{ background: '#010709' }}
    >
      {reducedMotion ? (
        /* ── Reduced motion: static full-bleed poster, no scrub, no autoplay ── */
        <div className="relative w-full" style={{ height: '100vh' }}>
          <img
            src={posterSrc}
            alt="Matrix Sky — system visual"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              display: 'block', objectFit: 'cover', objectPosition: 'center',
            }}
          />
          <SeamBlend />
          <CornerMarkers />
        </div>
      ) : (
        <>
          {/* ── Desktop / tablet — pinned full-screen scroll-scrub ── */}
          <div
            ref={scrollTrackRef}
            className="hidden sm:block relative min-h-[300vh] lg:min-h-[340vh]"
          >
            <div style={{ position: 'sticky', top: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
              <video
                ref={desktopVideoRef}
                muted
                playsInline
                preload={srcReady ? 'auto' : 'none'}
                poster={posterSrc}
                style={videoStyle}
              >
                {srcReady && <source src={videoSrc} type="video/mp4" />}
              </video>
              <SeamBlend />
              <CornerMarkers />
            </div>
          </div>

          {/* ── Mobile — full-bleed autoplay-on-view (no pinning) ── */}
          <div className="sm:hidden relative w-full" style={{ height: '100vh', overflow: 'hidden' }}>
            <video
              ref={mobileVideoRef}
              muted
              playsInline
              loop
              preload={srcReady ? 'auto' : 'none'}
              poster={posterSrc}
              style={videoStyle}
            >
              {srcReady && <source src={videoSrc} type="video/mp4" />}
            </video>
            <SeamBlend />
            <CornerMarkers />
          </div>
        </>
      )}
    </section>
  )
}
