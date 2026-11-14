import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(MotionPathPlugin)

// ─── One Connected System — animated lead journey ────────────────────────────
// A lead leaves one of the channels, flows into Enquiry and travels node to
// node; each node reacts as it arrives. Leads rotate through the channels.
// Hovering a node pauses the flow; hovering a channel sends a lead from it.

const ICE = '#BFEFFF'
const CYAN = '#22D3EE'
const LINE = 'rgba(125, 211, 252, 0.5)'
const GREEN_HI = '#3DDC97'

const CHANNELS = [
  { key: 'voice', label: 'Voice' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
] as const

const STEPS = [
  { key: 'enquiry', no: '01', label: 'Enquiry', desc: 'Every call, message and chat captured in one place', status: 'New lead' },
  { key: 'respond', no: '02', label: 'Respond & Qualify', desc: 'Answers instantly, day or night, and qualifies intent', status: 'Qualified' },
  { key: 'crm', no: '03', label: 'CRM & Follow-up', desc: 'Contact organised, follow-ups triggered automatically', status: 'In CRM' },
  { key: 'booking', no: '04', label: 'Booking Confirmed', desc: 'Customer books or is handed to your team', status: 'Booked', success: true },
  { key: 'insight', no: '05', label: 'Insight', desc: 'Source, response and outcome tracked for every lead', status: 'Tracked' },
] as const

// Rising line beside Insight (desktop), in chart-local units.
const CHART_PTS: [number, number][] = [[0, 86], [18, 70], [32, 75], [50, 56], [66, 61], [84, 38], [100, 31], [118, 8]]

function ChannelIcon({ k }: { k: string }) {
  const p = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  if (k === 'voice') return <svg {...p}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
  if (k === 'whatsapp') return <svg {...p}><path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.3z" /><path d="M9.2 8.6c.2 2.9 2.4 5.3 5.4 5.9l1-1.2-1.7-.9-.8.7a4.4 4.4 0 0 1-2.4-2.4l.7-.8-.9-1.7z" /></svg>
  if (k === 'instagram') return <svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" /></svg>
  return <svg {...p}><path d="M14 8h2.5V4.5H14A3.5 3.5 0 0 0 10.5 8v2.5H8V14h2.5v6.5H14V14h2.5l.5-3.5h-3V8.5a.5.5 0 0 1 .5-.5z" /></svg>
}

function StepIcon({ k }: { k: string }) {
  const p = { className: 'cf-icon', viewBox: '0 0 24 24', fill: 'none', stroke: ICE, strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  if (k === 'enquiry') return (
    <svg {...p}>
      <path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5v-3.5H4A1.5 1.5 0 0 1 2.5 16V7A1.5 1.5 0 0 1 4 5.5z" />
      {[8, 12, 16].map(x => <circle key={x} className="cf-typing" cx={x} cy={11.5} r={1.1} fill={ICE} stroke="none" />)}
    </svg>
  )
  if (k === 'respond') return (
    <svg {...p}>
      {[[4.5, 4], [8.25, 9], [12, 14], [15.75, 9], [19.5, 4]].map(([x, h]) => <line key={x} className="cf-bar" x1={x} y1={12 - h / 2} x2={x} y2={12 + h / 2} />)}
    </svg>
  )
  if (k === 'crm') return (
    <svg {...p}>
      <circle cx="11" cy="8.5" r="3.5" />
      <path d="M4 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
      <path className="cf-crm-check" pathLength={1} d="M15.8 9.2l1.6 1.6 3.4-3.6" stroke={CYAN} strokeWidth={1.8} />
    </svg>
  )
  if (k === 'booking') return (
    <svg {...p} stroke={GREEN_HI}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" />
      <path className="cf-cal-check" pathLength={1} d="M9 15.2l2.2 2.2 4.3-4.6" />
    </svg>
  )
  return (
    <svg {...p}>
      <path d="M4 4v16h16" />
      <path className="cf-ins-line" pathLength={1} d="M7 15l3.5-4 3 2.5L19 7" />
      <path d="M15.5 7H19v3.5" />
    </svg>
  )
}

type Pt = { x: number; y: number }
type Geo = { w: number; h: number; vertical: boolean; nodes: (Pt & { r: number })[]; pills: Pt[] }

function offsetIn(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0, y = 0
  let n: HTMLElement | null = el
  while (n && n !== ancestor) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null }
  return { x, y }
}

function connectorD(g: Geo, i: number) {
  const p = g.pills[i], n = g.nodes[0]
  if (g.vertical) {
    const ty = n.y - n.r, dy = (ty - p.y) * 0.55
    return `M ${p.x} ${p.y} C ${p.x} ${p.y + dy} ${n.x} ${ty - dy} ${n.x} ${ty}`
  }
  const tx = n.x - n.r, dx = (tx - p.x) * 0.55
  return `M ${p.x} ${p.y} C ${p.x + dx} ${p.y} ${tx - dx} ${n.y} ${tx} ${n.y}`
}

// Length of a cubic bezier, by sampling.
function cubicLen(d: string) {
  const v = d.match(/-?[\d.]+/g)!.map(Number)
  const [x0, y0, x1, y1, x2, y2, x3, y3] = v
  let len = 0, px = x0, py = y0
  for (let i = 1; i <= 48; i++) {
    const t = i / 48, u = 1 - t
    const x = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3
    const y = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3
    len += Math.hypot(x - px, y - py); px = x; py = y
  }
  return len
}

export default function ConnectedFlow() {
  const rootRef = useRef<HTMLDivElement>(null)
  const riderRef = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLSpanElement>(null)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [geo, setGeo] = useState<Geo | null>(null)
  const geoRef = useRef<Geo | null>(null)
  const leadRef = useRef<{ tl: gsap.core.Timeline | null; next: gsap.core.Tween | null; ch: number; started: boolean; visible: boolean; hover: boolean }>({ tl: null, next: null, ch: 1, started: false, visible: false, hover: false })

  // ── Measure node and channel positions (ignores transforms) ──
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const measure = () => {
      const vertical = window.matchMedia('(max-width: 1023px)').matches
      const nodes = nodeRefs.current.filter((n): n is HTMLDivElement => !!n).map(n => {
        const o = offsetIn(n, root); const r = n.offsetWidth / 2
        return { x: o.x + r, y: o.y + r, r }
      })
      const pills = pillRefs.current.filter((n): n is HTMLButtonElement => !!n).map(n => {
        const o = offsetIn(n, root)
        return vertical ? { x: o.x + n.offsetWidth / 2, y: o.y + n.offsetHeight } : { x: o.x + n.offsetWidth, y: o.y + n.offsetHeight / 2 }
      })
      const g = { w: root.offsetWidth, h: root.offsetHeight, vertical, nodes, pills }
      geoRef.current = g
      setGeo(g)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    return () => ro.disconnect()
  }, [])

  // ── Lead animation ──
  useEffect(() => {
    const root = rootRef.current, rider = riderRef.current, tag = tagRef.current
    if (!root || !rider || !tag || !geo) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const L = leadRef.current
    if (reduced) { root.classList.add('is-static'); return }

    const pulse = (i: number) => {
      const node = nodeRefs.current[i]; if (!node) return
      const core = node.querySelector('.cf-core'), burst = node.querySelector('.cf-burst')
      gsap.fromTo(burst, { scale: 1, opacity: 0.6 }, { scale: 1.6, opacity: 0, duration: 0.95, ease: 'power2.out' })
      gsap.timeline().to(core, { scale: 1.07, duration: 0.22, ease: 'power2.out' }).to(core, { scale: 1, duration: 0.5, ease: 'power2.inOut' })
      node.classList.add('is-hit'); gsap.delayedCall(0.75, () => node.classList.remove('is-hit'))
      const k = STEPS[i].key
      if (k === 'enquiry') gsap.fromTo(node.querySelectorAll('.cf-typing'), { y: 0 }, { y: -2.4, duration: 0.18, yoyo: true, repeat: 3, stagger: 0.1, ease: 'sine.inOut' })
      if (k === 'respond') gsap.to(node.querySelectorAll('.cf-bar'), { scaleY: () => gsap.utils.random(0.35, 1.7), transformOrigin: '50% 50%', duration: 0.11, yoyo: true, repeat: 5, stagger: 0.03, onComplete() { gsap.set(node.querySelectorAll('.cf-bar'), { scaleY: 1 }) } })
      if (k === 'crm') gsap.timeline().fromTo(node.querySelector('.cf-crm-check'), { strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }).to(node.querySelector('.cf-crm-check'), { opacity: 0, duration: 0.4, delay: 0.8 })
      if (k === 'booking') {
        gsap.fromTo(node.querySelector('.cf-cal-check'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' })
        gsap.fromTo(node.querySelector('.cf-badge'), { scale: 0.4 }, { scale: 1, duration: 0.55, ease: 'back.out(3)' })
      }
      if (k === 'insight') {
        gsap.fromTo(node.querySelector('.cf-ins-line'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' })
        const chart = root.querySelector('.cf-chart-hi'), end = root.querySelector('.cf-chart-end')
        if (chart) gsap.fromTo(chart, { strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', onComplete() { gsap.to(chart, { opacity: 0.35, duration: 1.2, delay: 0.6 }) } })
        if (end) gsap.fromTo(end, { scale: 0.6, opacity: 0.4 }, { scale: 1.6, opacity: 1, duration: 0.5, yoyo: true, repeat: 1, transformOrigin: '50% 50%', delay: 0.9 })
      }
    }

    const runLead = (ch: number) => {
      const g = geoRef.current; if (!g || g.nodes.length < 5 || g.pills.length < 4) return
      L.tl?.kill(); L.next?.kill(); L.ch = ch
      pillRefs.current.forEach(p => p?.classList.remove('is-live'))
      const conn = connectorD(g, ch)
      const pts = g.nodes.map(n => `L ${n.x.toFixed(1)} ${n.y.toFixed(1)}`).slice(1).join(' ')
      const path = `${conn} ${pts}`
      const lens = [cubicLen(conn)]
      for (let i = 1; i < g.nodes.length; i++) lens.push(Math.hypot(g.nodes[i].x - g.nodes[i - 1].x, g.nodes[i].y - g.nodes[i - 1].y))
      const total = lens.reduce((a, b) => a + b, 0)
      const fr: number[] = []; let acc = 0
      for (const l of lens) { acc += l; fr.push(acc / total) }
      const pill = pillRefs.current[ch]

      const tl = gsap.timeline({ onComplete: () => { L.next = gsap.delayedCall(0.45, () => runLead((ch + 1) % CHANNELS.length)) } })
      L.tl = tl
      tl.call(() => { pill?.classList.add('is-live') })
      tl.set(tag, { opacity: 0 })
      tl.set(rider, { motionPath: { path, start: 0, end: 0 } })
      tl.to(rider, { opacity: 1, duration: 0.25 }, '<')
      tl.to(rider, { motionPath: { path, start: 0, end: fr[0] }, duration: 1.0, ease: 'power1.inOut' }, '<')
      tl.call(() => { pill?.classList.remove('is-live'); pulse(0) })
      for (let i = 1; i < g.nodes.length; i++) {
        const s = STEPS[i - 1], a = g.nodes[i - 1], b = g.nodes[i]
        tl.call(() => {
          tag.textContent = s.status
          tag.classList.toggle('is-success', !!(s as { success?: boolean }).success)
          gsap.set(tag, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 + 16, xPercent: -50 })
        }, [], '+=0.45')
        tl.to(rider, { motionPath: { path, start: fr[i - 1], end: fr[i] }, duration: 0.85, ease: 'power1.inOut' })
        tl.to(tag, { opacity: 1, duration: 0.18 }, '<0.12')
        tl.to(tag, { opacity: 0, duration: 0.15 }, '<0.5')
        tl.call(() => pulse(i))
      }
      tl.to(rider, { opacity: 0, duration: 0.3 }, '+=0.15')
      if (!L.visible || L.hover) tl.pause()
    }

    // Exposed for channel hover
    ;(root as HTMLDivElement & { runLead?: (c: number) => void }).runLead = (c: number) => { if (L.started) runLead(c) }

    const io = new IntersectionObserver(([e]) => {
      L.visible = e.isIntersecting
      root.classList.toggle('is-paused', !e.isIntersecting)
      if (e.isIntersecting && !L.started) {
        L.started = true
        root.classList.add('is-in')
        L.next = gsap.delayedCall(1.3, () => runLead(L.ch))
      } else if (L.tl) {
        if (e.isIntersecting && !L.hover) L.tl.resume(); else L.tl.pause()
      }
    }, { threshold: 0.25 })
    io.observe(root)

    // Restart the current lead on the new geometry after a resize.
    if (L.started && L.tl) runLead(L.ch)

    return () => { io.disconnect(); L.tl?.kill(); L.next?.kill() }
  }, [geo])

  const onNodeEnter = (i: number) => {
    const L = leadRef.current; L.hover = true; L.tl?.pause()
    nodeRefs.current[i]?.classList.add('is-focus')
  }
  const onNodeLeave = (i: number) => {
    const L = leadRef.current; L.hover = false
    if (L.visible) L.tl?.resume()
    nodeRefs.current[i]?.classList.remove('is-focus')
  }
  const sendFrom = (c: number) => {
    const L = leadRef.current
    if (L.ch === c && L.tl && L.tl.progress() < 0.3) return
    ;(rootRef.current as (HTMLDivElement & { runLead?: (c: number) => void }) | null)?.runLead?.(c)
  }

  const ins = geo?.nodes[4]
  // The chart scales with the circles (designed at a 44px radius).
  const ck = ins ? ins.r / 44 : 1
  const showChart = !!(geo && ins && !geo.vertical && geo.w - (ins.x + ins.r) >= 164 * ck)
  const cx0 = ins ? ins.x + ins.r + 34 * ck : 0, cy0 = ins ? ins.y - 52 * ck : 0
  const CP = CHART_PTS.map(([x, y]) => [x * ck, y * ck] as const)
  const chartPts = CP.map(([x, y]) => `${(cx0 + x).toFixed(1)},${(cy0 + y).toFixed(1)}`).join(' ')

  return (
    <div ref={rootRef} className="cf">
      {/* Lines, connectors and the chart */}
      {geo && (
        <svg className="cf-svg" width={geo.w} height={geo.h} aria-hidden="true" focusable="false">
          <defs>
            <pattern id="cf-dots" width="11" height="11" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.9" fill="rgba(125,211,252,0.22)" />
            </pattern>
            <radialGradient id="cf-chart-fade">
              <stop offset="40%" stopColor="white" stopOpacity="1" /><stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="cf-chart-mask"><rect x={cx0 - 30 * ck} y={cy0 - 30 * ck} width={180 * ck} height={150 * ck} fill="url(#cf-chart-fade)" /></mask>
          </defs>
          {geo.pills.map((_, i) => (
            <g key={i}>
              <path className="cf-draw" pathLength={1} d={connectorD(geo, i)} fill="none" stroke={LINE} strokeWidth={1.3} />
              <path className="cf-flowline" d={connectorD(geo, i)} fill="none" stroke={CYAN} strokeWidth={1.3} />
              <circle className="cf-pop" cx={geo.pills[i].x} cy={geo.pills[i].y} r={3.2} fill="#9FE7FA" />
            </g>
          ))}
          {geo.nodes.slice(1).map((n, i) => {
            const a = geo.nodes[i], ux = (n.x - a.x), uy = (n.y - a.y), d = Math.hypot(ux, uy) || 1
            const gap = a.r + 12
            const p1 = { x: a.x + ux / d * gap, y: a.y + uy / d * gap }, p2 = { x: n.x - ux / d * (n.r + 12), y: n.y - uy / d * (n.r + 12) }
            return (
              <g key={i}>
                <line className="cf-draw" pathLength={1} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={LINE} strokeWidth={1.5} />
                <line className="cf-flowline" x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={CYAN} strokeWidth={1.5} />
                <circle className="cf-pop" cx={p1.x} cy={p1.y} r={3.6} fill="#9FE7FA" />
                <circle className="cf-pop" cx={p2.x} cy={p2.y} r={3.6} fill="#9FE7FA" />
              </g>
            )
          })}
          {showChart && (
            <g className="cf-chart">
              <rect x={cx0 - 30 * ck} y={cy0 - 30 * ck} width={180 * ck} height={150 * ck} fill="url(#cf-dots)" mask="url(#cf-chart-mask)" />
              <polyline points={chartPts} fill="none" stroke="rgba(125,211,252,0.45)" strokeWidth={1.5} strokeLinejoin="round" />
              <polyline className="cf-chart-hi" pathLength={1} points={chartPts} fill="none" stroke="#9FE7FA" strokeWidth={2} strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(34,211,238,0.8))' }} />
              {CP.slice(1, -1).map(([x, y], i) => <circle key={i} cx={cx0 + x} cy={cy0 + y} r={2.1 * ck} fill="#9FE7FA" opacity={0.8} />)}
              <circle className="cf-chart-end" cx={cx0 + CP[CP.length - 1][0]} cy={cy0 + CP[CP.length - 1][1]} r={4 * ck} fill="#E6FBFF" style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.9))' }} />
            </g>
          )}
        </svg>
      )}

      {/* The travelling lead */}
      <div ref={riderRef} className="cf-rider" aria-hidden="true">
        <span className="cf-dot" />
      </div>
      {/* Status tag: shown centred in the gap the lead is crossing */}
      <span ref={tagRef} className="cf-tag" aria-hidden="true" />

      <div className="cf-grid">
        <div className="cf-channels" role="group" aria-label="Channels">
          {CHANNELS.map((c, i) => (
            <button
              key={c.key}
              type="button"
              ref={el => { pillRefs.current[i] = el }}
              className="cf-pill"
              onPointerEnter={() => sendFrom(i)}
              onFocus={() => sendFrom(i)}
              onClick={() => sendFrom(i)}
              aria-label={`Show a ${c.label} enquiry moving through the system`}
            >
              <ChannelIcon k={c.key} />
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {STEPS.map((s, i) => (
          <div key={s.key} className={`cf-step${'success' in s && s.success ? ' is-success' : ''}`} onPointerEnter={() => onNodeEnter(i)} onPointerLeave={() => onNodeLeave(i)}>
            <h3 className="cf-head">
              <span className="cf-no">{s.no}</span>
              {/* Words never break inside (keeps "Follow-up" whole) */}
              <span className="cf-label">{s.label.split(' ').flatMap((word, wi) => [wi > 0 ? ' ' : null, <span key={wi} className="cf-word">{word}</span>])}</span>
            </h3>
            <div className="cf-node" ref={el => { nodeRefs.current[i] = el }}>
              <span className="cf-halo" aria-hidden="true" />
              <span className="cf-burst" aria-hidden="true" />
              <span className="cf-core"><StepIcon k={s.key} /></span>
              {'success' in s && s.success && (
                <span className="cf-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#04140D" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.2 4.2L19 7" /></svg>
                </span>
              )}
            </div>
            <p className="cf-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
