import { useEffect, useRef, useState } from 'react'

const WA_HREF =
  'https://wa.me/447300795353?text=Hi%20Weavy%2C%20I%20saw%20your%20website%20and%20I%E2%80%99d%20like%20to%20ask%20about%20your%20automation%20and%20marketing%20services.'

// Content the button must not sit on top of: when any of it is under the
// button, the button fades out, and returns once the spot is clear.
//  • AVOID elements (media, headings, buttons…) block by their visible box.
//  • Body text blocks only where a rendered line actually reaches the button —
//    a paragraph's box spans the whole column even when its lines stop short.
// Canvases are left out: on this site they are decorative section backgrounds.
const AVOID = 'img, video, h1, h2, h3, h4, button, .gd-hero-frame, .footer-social-icon, [data-wa-avoid]'
const ZONE_PAD = 6      // px of clearance kept around the circle
const SHOW_DELAY = 300  // ms the spot must stay clear before fading back in —
                        // small gaps between paragraphs passing mid-scroll
                        // don't make it blink in and out
const CHECK_MS = 100    // scroll re-check throttle
const POLL_MS = 250     // while anything is near the button, re-check this often:
                        // content also moves without scrolling (reveal and
                        // scroll-scrubbed animations, counters, late images)

export default function WhatsAppFloatingButton() {
  const [hovered, setHovered] = useState(false)
  const [tucked, setTucked] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const ref = useRef<HTMLAnchorElement>(null)

  // One IntersectionObserver whose root is shrunk (negative rootMargin) to the
  // button's corner keeps a small candidate set — whatever is near the button
  // right now. Only those candidates are measured precisely, on IO changes and
  // (throttled) while scrolling.
  useEffect(() => {
    const btn = ref.current
    const circle = btn?.querySelector<HTMLElement>('.wa-floating-circle')
    if (!btn || !circle) return

    const near = new Set<Element>()
    const observed = new WeakSet<Element>()
    const range = document.createRange()
    let io: IntersectionObserver | null = null
    let zone = { left: 0, top: 0, right: 0, bottom: 0 }
    let showTimer = 0, resizeTimer = 0, trailTimer = 0, pollTimer = 0, lastCheck = 0

    const overlaps = (r: { left: number; top: number; right: number; bottom: number }) =>
      r.right > r.left && r.bottom > r.top &&
      r.left < zone.right && r.right > zone.left && r.top < zone.bottom && r.bottom > zone.top

    // Visible box: clipped by overflow ancestors (e.g. an oversized image inside
    // a cropping frame only counts where it is actually shown).
    const visibleBox = (el: Element) => {
      const b = el.getBoundingClientRect()
      let { left, top, right, bottom } = b
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const cs = getComputedStyle(p)
        if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
          const pr = p.getBoundingClientRect()
          left = Math.max(left, pr.left); top = Math.max(top, pr.top)
          right = Math.min(right, pr.right); bottom = Math.min(bottom, pr.bottom)
        }
      }
      return { left, top, right, bottom }
    }

    const excluded = (el: Element) => btn.contains(el) || !!el.closest('nav, header, #mobile-menu, script, style, noscript')

    const blocks = (el: Element) => {
      if (!el.isConnected || excluded(el)) return false
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none') return false
      if (el.matches(AVOID)) {
        // Screen-filling media (page hero videos/backgrounds) would hide the
        // button on landing.
        const b = el.getBoundingClientRect()
        const fills = /^(IMG|VIDEO)$/.test(el.tagName) && b.width >= window.innerWidth * 0.95 && b.height >= window.innerHeight * 0.6
        if (!fills && overlaps(visibleBox(el))) return true
      }
      for (const n of el.childNodes) {
        if (n.nodeType !== Node.TEXT_NODE || !n.textContent?.trim()) continue
        range.selectNodeContents(n)
        for (const r of range.getClientRects()) if (overlaps(r)) return true
      }
      return false
    }
    const blocked = () => { for (const el of near) if (blocks(el)) return true; return false }

    const update = () => {
      for (const el of near) if (!el.isConnected) near.delete(el)
      if (near.size && !pollTimer) pollTimer = window.setInterval(update, POLL_MS)
      else if (!near.size && pollTimer) { window.clearInterval(pollTimer); pollTimer = 0 }
      if (blocked()) {
        window.clearTimeout(showTimer); showTimer = 0
        setTucked(true)
      } else if (!showTimer) {
        // Re-verify at the moment of showing — content may have moved in since.
        showTimer = window.setTimeout(() => { showTimer = 0; if (blocked()) update(); else setTucked(false) }, SHOW_DELAY)
      }
    }

    // Candidates: AVOID elements plus every element that directly holds text.
    const observe = (el: Element) => { if (!observed.has(el) && !excluded(el)) { observed.add(el); io?.observe(el) } }
    const watch = (root: Node) => {
      if (root instanceof Element && root.matches(AVOID)) observe(root)
      if (root.nodeType === Node.TEXT_NODE) { if (root.parentElement && root.textContent?.trim()) observe(root.parentElement); return }
      if (!(root instanceof Element)) return
      root.querySelectorAll(AVOID).forEach(observe)
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      for (let n = w.nextNode(); n; n = w.nextNode()) if (n.textContent?.trim() && n.parentElement) observe(n.parentElement)
    }

    // The coarse IO root runs from just above-left of the circle to the
    // viewport's bottom-right corner. It is measured on screen — where the
    // browser draws the fixed button, which can differ from its layout offsets
    // while mobile toolbars collapse — with the tuck/hover transform cleared.
    // The transition is switched off while measuring: mid-transition the box
    // would still report the animated (tucked) position.
    const build = () => {
      io?.disconnect(); near.clear()
      const { transform, transition } = btn.style
      btn.style.transition = 'none'
      btn.style.transform = 'none'
      const r = circle.getBoundingClientRect()
      btn.style.transform = transform
      void btn.offsetWidth // apply the restored transform before transitions return
      btn.style.transition = transition
      zone = { left: r.left - ZONE_PAD, top: r.top - ZONE_PAD, right: r.right + ZONE_PAD, bottom: r.bottom + ZONE_PAD }
      io = new IntersectionObserver(entries => {
        for (const e of entries) e.isIntersecting ? near.add(e.target) : near.delete(e.target)
        update()
      }, { rootMargin: `${-zone.top}px 0px 0px ${-zone.left}px` })
      for (const el of [...document.querySelectorAll('*')]) if (observed.has(el)) io.observe(el)
      watch(document.body)
    }

    build()
    // Routes and lazy sections mount later — observe whatever they add.
    const mo = new MutationObserver(records => { for (const r of records) r.addedNodes.forEach(watch) })
    mo.observe(document.body, { childList: true, subtree: true })
    // Viewport changes (resizes, mobile toolbars collapsing, zoom) move the
    // corner. visualViewport "scroll" only fires when the visual viewport
    // shifts against the layout, not on ordinary page scrolling.
    const onResize = () => { window.clearTimeout(resizeTimer); resizeTimer = window.setTimeout(build, 200) }
    window.addEventListener('resize', onResize)
    window.visualViewport?.addEventListener('resize', onResize)
    window.visualViewport?.addEventListener('scroll', onResize)
    // Lines and boxes move under the button as the page scrolls.
    const onScroll = () => {
      const now = performance.now()
      if (now - lastCheck > CHECK_MS) { lastCheck = now; update() }
      window.clearTimeout(trailTimer); trailTimer = window.setTimeout(update, CHECK_MS + 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      io?.disconnect(); mo.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      window.visualViewport?.removeEventListener('resize', onResize)
      window.visualViewport?.removeEventListener('scroll', onResize)
      for (const t of [showTimer, resizeTimer, trailTimer]) window.clearTimeout(t)
      window.clearInterval(pollTimer)
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
