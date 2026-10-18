import { useEffect, useRef, useState } from 'react'

const WA_HREF =
  'https://wa.me/447300795353?text=Hi%20Weavy%2C%20I%20saw%20your%20website%20and%20I%E2%80%99d%20like%20to%20ask%20about%20your%20automation%20and%20marketing%20services.'

// Content the button must not sit on top of. When any of it passes under the
// button's corner the button fades out, and returns once the corner is clear.
// Body text is left out on purpose — on a phone every line runs under the
// corner, so including it would keep the button permanently hidden. Canvases
// are left out too: on this site they are decorative section backgrounds.
const AVOID = 'img, video, h1, h2, h3, h4, button, .gd-hero-frame, .footer-social-icon, [data-wa-avoid]'
const ZONE_PAD = 8      // px of clearance kept around the circle
const SHOW_DELAY = 150  // ms the corner must stay clear before fading back in

export default function WhatsAppFloatingButton() {
  const [hovered, setHovered] = useState(false)
  const [tucked, setTucked] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const ref = useRef<HTMLAnchorElement>(null)

  // Collision awareness without scroll listeners: one IntersectionObserver
  // whose root is shrunk (via negative rootMargin) to the button's own corner,
  // so "intersecting" means "under the button".
  useEffect(() => {
    const btn = ref.current
    const circle = btn?.querySelector<HTMLElement>('.wa-floating-circle')
    if (!btn || !circle) return

    const hits = new Set<Element>()
    let io: IntersectionObserver | null = null
    let showTimer = 0
    let resizeTimer = 0

    const update = () => {
      for (const el of hits) if (!el.isConnected) hits.delete(el)
      if (hits.size) {
        window.clearTimeout(showTimer); showTimer = 0
        setTucked(true)
      } else if (!showTimer) {
        showTimer = window.setTimeout(() => { showTimer = 0; setTucked(false) }, SHOW_DELAY)
      }
    }
    // Screen-filling media (page hero videos/backgrounds) would hide the button
    // on landing, and the fixed navbar never reaches the bottom corner. Wide but
    // short media (e.g. an oversized image cropped by its frame) still counts.
    const counts = (el: Element) => {
      if (el.closest('nav, header, #mobile-menu')) return false
      if (!/^(IMG|VIDEO)$/.test(el.tagName)) return true
      const r = el.getBoundingClientRect()
      return !(r.width >= window.innerWidth * 0.95 && r.height >= window.innerHeight * 0.6)
    }

    const watch = (root: ParentNode) => {
      if (root instanceof Element && root.matches(AVOID) && !btn.contains(root)) io?.observe(root)
      root.querySelectorAll(AVOID).forEach(el => { if (!btn.contains(el)) io?.observe(el) })
    }
    // The zone runs from just above-left of the circle to the viewport's
    // bottom-right corner (covering the gutter and safe area too). It is
    // measured on screen — where the browser actually draws the fixed button,
    // which can differ from its layout offsets while mobile toolbars collapse —
    // with the tuck/hover transform briefly cleared so it doesn't skew the box.
    const build = () => {
      io?.disconnect(); hits.clear()
      const prev = btn.style.transform
      btn.style.transform = 'none'
      const r = circle.getBoundingClientRect()
      btn.style.transform = prev
      const top = r.top - ZONE_PAD
      const left = r.left - ZONE_PAD
      io = new IntersectionObserver(entries => {
        for (const e of entries) {
          // Real overlap only — zero-size elements (e.g. unloaded lazy images)
          // count as "intersecting" when they merely touch the zone.
          const area = e.intersectionRect.width * e.intersectionRect.height
          if (e.isIntersecting && area > 0 && counts(e.target)) hits.add(e.target)
          else hits.delete(e.target)
        }
        update()
      }, { rootMargin: `${-top}px 0px 0px ${-left}px` })
      watch(document.body)
    }

    build()
    // Routes and lazy sections mount later — observe whatever they add.
    const mo = new MutationObserver(records => {
      for (const r of records) r.addedNodes.forEach(n => { if (n instanceof Element) watch(n) })
    })
    mo.observe(document.body, { childList: true, subtree: true })
    // Viewport changes (resizes, mobile toolbars collapsing, zoom) move the
    // corner. visualViewport "scroll" only fires when the visual viewport
    // shifts against the layout, not on ordinary page scrolling.
    const onResize = () => { window.clearTimeout(resizeTimer); resizeTimer = window.setTimeout(build, 200) }
    window.addEventListener('resize', onResize)
    window.visualViewport?.addEventListener('resize', onResize)
    window.visualViewport?.addEventListener('scroll', onResize)

    return () => {
      io?.disconnect(); mo.disconnect()
      window.removeEventListener('resize', onResize)
      window.visualViewport?.removeEventListener('resize', onResize)
      window.visualViewport?.removeEventListener('scroll', onResize)
      window.clearTimeout(showTimer); window.clearTimeout(resizeTimer)
    }
  }, [])

  // Keyboard focus always wins, so the link is never invisible while focused.
  const hidden = tucked && !focused
  const transformEase = hovered ? 'cubic-bezier(0.34,1.56,0.64,1)' : 'cubic-bezier(0.22,1,0.36,1)'

  return (
    <a
      ref={ref}
      href={WA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Weavy on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="wa-floating-btn"
      style={{
        position: 'fixed',
        bottom: 'calc(clamp(16px, 3vw, 24px) + env(safe-area-inset-bottom, 0px))',
        right:  'calc(clamp(16px, 3vw, 24px) + env(safe-area-inset-right, 0px))',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        transition: reduceMotion ? 'none' : `transform 0.25s ${transformEase}, box-shadow 0.25s ease, opacity 0.22s ease`,
        transform: hidden ? 'translateY(8px) scale(0.94)' : hovered ? 'translateY(-4px) scale(1.06)' : 'translateY(0) scale(1)',
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'auto',
      }}
    >
      {/* Tooltip label */}
      <span
        aria-hidden="true"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(6px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          pointerEvents: 'none',
          background: 'hsl(0 0% 6% / 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid hsl(0 0% 100% / 0.08)',
          color: '#fff',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-sans, sans-serif)',
          fontWeight: 400,
          letterSpacing: '0.03em',
          padding: '6px 12px',
          borderRadius: '8px',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 16px hsl(0 0% 0% / 0.4)',
        }}
      >
        Chat on WhatsApp
      </span>

      {/* Button circle */}
      <div
        className="wa-floating-circle"
        style={{
          width: 54,
          height: 54,
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #2ee86b 0%, #25D366 55%, #1ebe5a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: hovered
            ? '0 0 0 4px hsl(142 72% 50% / 0.22), 0 8px 32px hsl(142 72% 45% / 0.55), 0 2px 8px hsl(0 0% 0% / 0.35)'
            : '0 0 0 3px hsl(142 72% 50% / 0.14), 0 4px 18px hsl(142 72% 45% / 0.38), 0 2px 6px hsl(0 0% 0% / 0.3)',
          transition: 'box-shadow 0.25s ease',
        }}
      >
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="28"
          height="28"
          fill="white"
          aria-hidden="true"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.651 4.823 1.789 6.845L2 30l7.355-1.778A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.53 11.53 0 0 1-5.882-1.607l-.422-.25-4.363 1.055 1.083-4.25-.275-.435A11.566 11.566 0 0 1 4.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.342-8.67c-.348-.174-2.059-1.015-2.378-1.13-.32-.116-.552-.174-.784.174-.232.347-.9 1.13-1.103 1.363-.203.232-.406.26-.754.087-.348-.174-1.47-.541-2.8-1.724-1.034-.921-1.732-2.059-1.935-2.407-.203-.347-.022-.535.153-.708.157-.155.348-.406.522-.609.174-.203.232-.348.348-.58.116-.232.058-.435-.029-.609-.087-.174-.784-1.888-1.074-2.587-.283-.68-.57-.587-.784-.598l-.668-.012c-.232 0-.609.087-.928.435-.318.347-1.218 1.19-1.218 2.904s1.247 3.369 1.42 3.601c.174.232 2.452 3.744 5.943 5.25.831.358 1.48.572 1.986.732.834.265 1.594.228 2.194.138.669-.1 2.059-.842 2.35-1.655.29-.813.29-1.51.203-1.655-.087-.145-.319-.232-.667-.406z" />
        </svg>
      </div>
    </a>
  )
}
