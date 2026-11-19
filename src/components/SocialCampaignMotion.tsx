import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/*
  "One idea. Every platform." — kinetic typography for the Social Campaigns
  section (Social Media Marketing page).

  "MAKE THEM" stays in place; only the last word changes through masks
  (STOP. → FEEL. → ACT.), so the loop runs continuously, with no reset.
  Each scene has its own accent: a violet highlight, a cyan rule, then gold.
  Only transform and opacity animate, so it stays light on older phones.
*/

const SCENES = [
  { name: 'Attention', label: 'Capture attention', word: 'Stop.' },
  { name: 'Engagement', label: 'Create connection', word: 'Feel.' },
  { name: 'Conversion', label: 'Inspire action', word: 'Act.' },
] as const

const HOLD = 1.05        // readable hold after each reveal: about 2.4s per scene, about 7.3s per loop
const MANUAL_HOLD = 4.5  // longer hold after a visitor picks a scene, then autoplay carries on

type Api = { goTo?: (n: number) => void }

export default function SocialCampaignMotion() {
  const rootRef = useRef<HTMLDivElement>(null)
  const api = useRef<Api>({})
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const q = (s: string) => Array.from(root.querySelectorAll<HTMLElement>(s))
    const words = q('.scm-word'), labels = q('.scm-label'), nums = q('.scm-num-d')
    const leads = q('.scm-lead'), glows = q('.scm-glow'), fills = q('.scm-fill'), hls = q('.scm-hl')
    const cyan = root.querySelector<HTMLElement>('.scm-rule-cyan')!
    const gold = root.querySelector<HTMLElement>('.scm-rule-gold')!
    const accentsFor = (n: number): HTMLElement[] => (n === 0 ? hls : n === 1 ? [cyan] : [gold])
    const allAccents = [...hls, cyan, gold]
    const leadOpacity = (n: number) => (n === 2 ? 0.5 : 1) // the lead-in steps back so gold ACT. leads
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let cur = 0
    let tl: gsap.core.Timeline | null = null
    let sched: gsap.core.Timeline | null = null
    let intro: gsap.core.Tween | null = null
    let started = false, visible = false

    const show = (n: number) => {
      cur = n; setActive(n)
      words.forEach((w, i) => gsap.set(w, { yPercent: i === n ? 0 : 105, scale: 1 }))
      ;[labels, nums].forEach(set => set.forEach((l, i) => gsap.set(l, { yPercent: i === n ? 0 : 100, opacity: i === n ? 1 : 0 })))
      gsap.set(allAccents, { scaleX: 0 }); gsap.set(accentsFor(n), { scaleX: 1 })
      gsap.set(leads, { yPercent: 0, opacity: leadOpacity(n) })
      glows.forEach((g, i) => gsap.set(g, { opacity: i === n ? 1 : 0 }))
      fills.forEach((f, i) => gsap.set(f, { scaleX: i === n ? 1 : 0 }))
    }

    if (reduced) {
      root.classList.add('is-static')
      show(0)
      api.current.goTo = show
      return () => { api.current.goTo = undefined }
    }

    // Hidden until the card is in view (set before paint, transforms only, so no layout shift).
    gsap.set([...words, ...leads], { yPercent: 105 })
    gsap.set([...labels, ...nums], { yPercent: 100, opacity: 0 })
    gsap.set([...allAccents, ...fills], { scaleX: 0 })
    gsap.set(glows, { opacity: 0 })

    const schedule = (hold: number) => {
      sched?.kill()
      sched = gsap.timeline()
      sched.fromTo(fills[cur], { scaleX: 0 }, { scaleX: 1, duration: hold, ease: 'none' }, 0)
      sched.call(() => go((cur + 1) % SCENES.length, false), [], hold)
      if (!visible) sched.pause()
    }

    // Swaps out whatever is on screen for scene n, starting from the current
    // positions, so a click in the middle of a transition never jumps.
    const swap = (set: HTMLElement[], n: number, t: gsap.core.Timeline, inAt: number, dist: number, fade: boolean) => {
      set.forEach((el, i) => {
        const y = gsap.getProperty(el, 'yPercent') as number
        if (i === n) {
          if (y <= -dist + 1) gsap.set(el, { yPercent: dist })
          t.to(el, { yPercent: 0, ...(fade ? { opacity: 1 } : {}), duration: 0.85, ease: 'expo.out' }, inAt)
        } else if (y < dist * 0.6) {
          t.to(el, { yPercent: -dist, ...(fade ? { opacity: 0 } : {}), duration: 0.45, ease: 'power3.in', onComplete: () => { gsap.set(el, { yPercent: dist }) } }, 0)
        }
      })
    }

    const go = (n: number, manual: boolean) => {
      sched?.kill(); tl?.kill()
      if (n === cur && tl === null) { schedule(manual ? MANUAL_HOLD : HOLD); return }
      cur = n; setActive(n)
      const t = gsap.timeline({ onComplete: () => { tl = null; schedule(manual ? MANUAL_HOLD : HOLD) } })
      tl = t
      swap(words, n, t, 0.32, 105, false)
      t.fromTo(words[n], { scale: 1.04 }, { scale: 1, duration: 1.1, ease: 'power3.out' }, 0.32)
      swap(labels, n, t, 0.3, 100, true)
      swap(nums, n, t, 0.3, 100, true)
      t.to(allAccents.filter(a => !accentsFor(n).includes(a)), { scaleX: 0, transformOrigin: '100% 50%', duration: 0.4, ease: 'power2.in' }, 0)
      t.to(accentsFor(n), { scaleX: 1, transformOrigin: '0% 50%', duration: 0.75, ease: 'expo.inOut', stagger: 0.08 }, 0.6)
      t.to(leads, { opacity: leadOpacity(n), duration: 0.8, ease: 'sine.inOut' }, 0.2)
      t.to(glows, { opacity: (i: number) => (i === n ? 1 : 0), duration: 1.2, ease: 'sine.inOut' }, 0)
      t.to(fills.filter((_, i) => i !== n), { scaleX: 0, duration: 0.3, ease: 'power2.out' }, 0)
      if (!visible) t.pause()
    }

    const start = () => {
      const t = gsap.timeline({ onComplete: () => { tl = null; schedule(HOLD) } })
      tl = t
      t.to(leads, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.1 }, 0)
      t.to(words[0], { yPercent: 0, duration: 1, ease: 'expo.out' }, 0.2)
      t.fromTo(words[0], { scale: 1.04 }, { scale: 1, duration: 1.2, ease: 'power3.out' }, 0.2)
      t.to([labels[0], nums[0]], { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.1)
      t.to(glows[0], { opacity: 1, duration: 1.4, ease: 'sine.out' }, 0)
      t.to(hls, { scaleX: 1, transformOrigin: '0% 50%', duration: 0.75, ease: 'expo.inOut', stagger: 0.1 }, 0.6)
      if (!visible) t.pause()
    }

    api.current.goTo = (n: number) => { if (started) go(n, true) }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !started) {
        started = true
        intro = gsap.delayedCall(0.45, start) // lets the card's own fade-in lead
      } else {
        if (visible) { intro?.resume(); tl?.resume(); sched?.resume() }
        else { intro?.pause(); tl?.pause(); sched?.pause() }
      }
    }, { threshold: 0.35 })
    io.observe(root)

    return () => {
      io.disconnect(); intro?.kill(); tl?.kill(); sched?.kill()
      api.current.goTo = undefined
    }
  }, [])

  return (
    <div ref={rootRef} className="scm">
      <p className="sr-only">One idea, every platform. Make them stop. Make them feel. Make them act.</p>

      <div className="scm-glow scm-glow-0" aria-hidden="true" />
      <div className="scm-glow scm-glow-1" aria-hidden="true" />
      <div className="scm-glow scm-glow-2" aria-hidden="true" />

      <div className="scm-top" aria-hidden="true">
        <span className="scm-title"><span>One idea.</span><span className="scm-title-dim">Every platform.</span></span>
        <span className="scm-count">
          <span className="scm-num">{SCENES.map((_, i) => <span key={i} className="scm-num-d">{String(i + 1).padStart(2, '0')}</span>)}</span>
          <span className="scm-count-of">/ 03</span>
        </span>
      </div>

      <div className="scm-stage" aria-hidden="true">
        <div className="scm-label-row">
          <span className="scm-labels">
            {SCENES.map((s, i) => <span key={i} className={`scm-label scm-label-${i}`}>{s.label}</span>)}
          </span>
        </div>
        <div className="scm-head">
          <span className="scm-line"><span className="scm-lead">Make</span></span>
          <span className="scm-line"><span className="scm-lead scm-them"><span className="scm-hl" />Them</span></span>
          <span className="scm-line scm-last">
            <span className="scm-word"><span className="scm-hl" />{SCENES[0].word}</span>
            <span className="scm-word">{SCENES[1].word}<span className="scm-rule scm-rule-cyan" /></span>
            <span className="scm-word scm-word-gold">{SCENES[2].word}<span className="scm-rule scm-rule-gold" /></span>
          </span>
        </div>
      </div>

      <div className="scm-nav" role="group" aria-label="Choose a scene">
        {SCENES.map((s, i) => (
          <button
            key={i}
            type="button"
            className="scm-dot"
            aria-label={`Scene ${i + 1}: ${s.name}, make them ${s.word.toLowerCase()}`}
            aria-pressed={active === i}
            onClick={() => api.current.goTo?.(i)}
          >
            <span className="scm-dot-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="scm-dot-name">{s.name}</span>
            <span className="scm-track"><span className={`scm-fill scm-fill-${i}`} /></span>
          </button>
        ))}
      </div>
    </div>
  )
}
