import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * WeaveSection
 * Scroll-scrubbed "woven system" hero section.
 * Threads (one per service area) start loose and apart, then interlace
 * into a single system as the user scrolls.
 *
 * All styles are scoped under .wv-root — nothing leaks into the rest of the site.
 */

const STRANDS = 7;

type Strand = {
  spreadY: number;
  phase: number;
  hue: number;
  drift: number;
  dph: number;
};

export default function WeaveSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    const intro = introRef.current;
    const cta = ctaRef.current;
    if (!canvas || !track || !stage || !intro || !cta) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const phaseFn = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // fade in, HOLD at full opacity, then fade out
    const hold = (p: number, inA: number, inB: number, outA: number, outB: number) =>
      clamp(Math.min(phaseFn(p, inA, inB), 1 - phaseFn(p, outA, outB)), 0, 1);

    let W = 0;
    let H = 0;
    let strands: Strand[] = [];
    let currentP = 0;
    let rafId = 0;
    let visible = true;

    const buildStrands = () => {
      strands = [];
      for (let i = 0; i < STRANDS; i++) {
        const f = i / (STRANDS - 1);
        strands.push({
          spreadY: lerp(-0.34, 0.34, f),
          phase: f * Math.PI * 2,
          hue: lerp(172, 34, f), // teal -> gold
          drift: 0.5 + Math.random() * 0.7,
          dph: Math.random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStrands();
    };

    const draw = () => {
      const t = performance.now() / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';

      const cy = H * 0.47;
      const weave = smooth(currentP);
      const drawFront = smooth(phaseFn(currentP, 0.04, 0.9));
      const amp = lerp(H * 0.015, H * 0.11, weave);
      const period = lerp(W * 0.9, W * 0.26, weave);
      const step = 6;

      strands.forEach((s) => {
        const y0 = lerp(cy + s.spreadY * H, cy, weave);
        const driftAmp = (1 - weave) * H * 0.03;

        for (let pass = 0; pass < 2; pass++) {
          ctx.beginPath();
          const maxX = W * drawFront;
          for (let x = 0; x <= maxX; x += step) {
            const yWeave =
              Math.sin((x / period) * Math.PI * 2 + s.phase + weave * Math.PI) * amp;
            const yDrift = Math.sin(t * s.drift + s.dph + x * 0.004) * driftAmp;
            const y = y0 + yWeave + yDrift;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          const a = lerp(0.1, 0.9, weave);
          if (pass === 0) {
            ctx.strokeStyle = `hsla(${s.hue},70%,55%,${a * 0.28})`;
            ctx.lineWidth = 9;
          } else {
            ctx.strokeStyle = `hsla(${s.hue},85%,68%,${a})`;
            ctx.lineWidth = 2.1;
          }
          ctx.stroke();
        }

        if (drawFront > 0.001 && drawFront < 0.999) {
          const x = W * drawFront;
          const yWeave =
            Math.sin((x / period) * Math.PI * 2 + s.phase + weave * Math.PI) * amp;
          ctx.beginPath();
          ctx.fillStyle = `hsla(${s.hue},95%,80%,0.95)`;
          ctx.arc(x, y0 + yWeave, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      const done = phaseFn(currentP, 0.88, 1.0);
      if (done > 0.01) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.4);
        ctx.fillStyle = `hsla(168,60%,50%,${0.03 * done * (0.6 + pulse * 0.4)})`;
        ctx.fillRect(0, 0, W, H);
      }

      ctx.globalCompositeOperation = 'source-over';
      rafId = requestAnimationFrame(draw);
    };

    const setOverlays = (p: number) => {
      const introOpacity = hold(p, 0.0, 0.07, 0.52, 0.66);
      intro.style.opacity = String(introOpacity);
      intro.style.transform = `translateY(${(1 - introOpacity) * 14}px)`;
      cta.style.opacity = String(clamp(phaseFn(p, 0.8, 0.94), 0, 1));
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      pin: stage,
      scrub: reduce ? true : 1,
      onUpdate: (self) => {
        currentP = self.progress;
        setOverlays(currentP);
      },
    });

    // Pause the render loop when the section is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          visible = true;
          rafId = requestAnimationFrame(draw);
        } else if (!entry.isIntersecting && visible) {
          visible = false;
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0 }
    );
    observer.observe(track);

    window.addEventListener('resize', resize);
    resize();
    setOverlays(0);
    rafId = requestAnimationFrame(draw);

    // Recalculate once fonts have settled, or the pin start can be off
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      trigger.kill();
    };
  }, []);

  return (
    <div className="wv-root">
      <style>{CSS}</style>

      <div className="wv-track" ref={trackRef}>
        <div className="wv-stage" ref={stageRef}>
          <canvas className="wv-canvas" ref={canvasRef} />
          <div className="wv-scrim" />

          <div className="wv-overlay wv-intro" ref={introRef}>
            <div className="wv-block">
              <div className="wv-eyebrow">Weavy Automation</div>

              <div className="wv-columns">
                <div className="wv-col wv-col--platform">
                  <div className="wv-col-heading">Systems</div>
                  <ul className="wv-col-list">
                    {['Voice Receptionists', 'Voice Agents', 'Chatbots', 'Messaging', 'CRM & Bookings', 'Analytics'].map((item) => (
                      <li className="wv-col-item" key={item}>
                        <span className="wv-node" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="wv-col wv-col--services">
                  <div className="wv-col-heading">Services</div>
                  <ul className="wv-col-list">
                    {['Bespoke Websites', 'Social Media', 'Paid Advertising', 'Creative Design', 'UGC & Reels'].map((item) => (
                      <li className="wv-col-item" key={item}>
                        <span className="wv-node" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="wv-closing">
                Everything your business needs to grow — managed in one place.
              </p>
            </div>
          </div>

          <div className="wv-overlay wv-cta" ref={ctaRef}>
            <div className="wv-cta-block">
              <div className="wv-cap">
                Everything your business needs to grow — managed in one place.
              </div>
              <div className="wv-cue">
                <span className="wv-cue-text">Scroll to explore the systems</span>
                <svg
                  className="wv-cue-arrow"
                  width="26"
                  height="34"
                  viewBox="0 0 26 34"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M13 3 V27 M4 19 L13 28 L22 19"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Every rule is scoped under .wv-root so nothing affects the rest of the site. */
const CSS = `
.wv-root {
  --wv-bg: #071011;
  --wv-paper: #EAF1F0;
  --wv-gold: #E9963F;
  --wv-teal: #39C6B4;
  font-family: Inter, system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.wv-root *, .wv-root *::before, .wv-root *::after { box-sizing: border-box; }
.wv-root p, .wv-root div, .wv-root span { margin: 0; padding: 0; }

.wv-track { height: 560vh; background: var(--wv-bg); }

.wv-stage {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: var(--wv-bg);
}
.wv-stage::before {
  content: '';
  position: absolute;
  inset: 0;
  /* Outer stop matches Hero's own bottom-fade end colour (#010709) exactly,
     and the stop is pulled in from 72% to 45% so the gradient is fully
     resolved to that flat colour everywhere along the top edge (y=0) —
     at 72% it was still ~26-46% blended toward the lighter inner colour
     across the full width there, which is what read as a hard seam
     against Hero's own fade, which ends on a flat, fully-resolved colour. */
  background: radial-gradient(120% 90% at 50% 48%, #0c1a1b 0%, #010709 45%);
}
.wv-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }

.wv-scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(100deg, rgba(7,16,17,0.92) 0%, rgba(7,16,17,0.75) 34%, rgba(7,16,17,0) 62%);
  /* This overlay otherwise applies at full strength right up to y=0 — an
     abrupt "overlay edge" starting exactly at the Hero boundary, with
     nothing equivalent on Hero's side, which is what read as a seam even
     after the background gradient above was colour-matched. Fade it in
     over the first 48px instead of switching on instantly. */
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 48px);
  mask-image: linear-gradient(to bottom, transparent 0, #000 48px);
}

.wv-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 clamp(2rem, 8vw, 10rem);
  pointer-events: none;
  opacity: 0;
  will-change: opacity, transform;
}

/* Intro content (Platform/Services lists) — centred as a single controlled
   column rather than left-stretched across the full padded width. */
.wv-intro { align-items: center; text-align: center; }

/* Shared wrapper for the entire intro content group — eyebrow, Platform
   list, Services list, divider line and closing statement all live
   inside this one box and share its centre point, so shifting the
   whole group (see the desktop-only rule below) moves everything
   together instead of any piece independently. */
.wv-block { max-width: 46rem; }

@media (min-width: 1024px) {
  .wv-block { transform: translateX(-120px); }
}

/* div.wv-eyebrow / div.wv-group / div.wv-label (tag+class) — need to
   out-specificity the ".wv-root div" margin reset above (same issue as
   p.wv-closing), otherwise that rule silently cancels these margins and
   every vertical gap below collapses to 0. */
div.wv-eyebrow {
  font-size: clamp(1rem, 1.45vw, 1.32rem);
  letter-spacing: 0.34em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--wv-teal);
  opacity: 0.9;
  margin-bottom: 14px;
  transform: translateY(-18px);
}

/* Platform / Services — clean two-column list, replacing the old
   sentence-style bullet rows. Sits centred as a pair within .wv-block,
   each column left-aligned internally for a scan-friendly stacked list. */
div.wv-columns {
  display: flex;
  justify-content: center;
  gap: 56px;
  text-align: left;
  margin-bottom: 54px;
}

.wv-col { min-width: 200px; }

/* Platform drifts slightly left, Services slightly right, so the pair
   reads as two deliberately-separated columns rather than a tight
   centred block — tablet gets a smaller nudge, mobile (stacked) none. */
@media (min-width: 701px) and (max-width: 1023px) {
  .wv-col--platform { transform: translateX(-24px); }
  .wv-col--services { transform: translateX(16px); }
  div.wv-eyebrow { transform: translateX(-12px) translateY(-18px); }
}
@media (min-width: 1024px) {
  .wv-col--platform { transform: translateX(-45px); }
  .wv-col--services { transform: translateX(32px); }
  div.wv-eyebrow { transform: translateX(-54px) translateY(-34px); }
}

div.wv-col-heading {
  font-size: clamp(11px, calc(9.59px + 0.376vw), 15px);
  letter-spacing: 0.26em;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 16px;
}
.wv-col--platform div.wv-col-heading { color: #6F8CFF; }
.wv-col--services div.wv-col-heading { color: var(--wv-gold); }

ul.wv-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

li.wv-col-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 400;
  font-size: clamp(0.95rem, 1.3vw, 1.05rem);
  letter-spacing: 0.005em;
  color: rgba(234,241,240,0.82);
}

.wv-node {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.wv-col--platform .wv-node { background-color: #6F8CFF; box-shadow: 0 0 8px rgba(111, 140, 255, 0.55), 0 0 18px rgba(111, 140, 255, 0.20); }
.wv-col--services .wv-node { background: var(--wv-gold); box-shadow: 0 0 8px rgba(233,150,63,0.5); }

/* p.wv-closing (tag+class) — needs to out-specificity the ".wv-root p"
   margin reset above, otherwise that rule's higher specificity wins and
   silently cancels this margin, leaving the block stuck at the left edge
   instead of centred. */
p.wv-closing {
  font-weight: 500;
  font-size: clamp(1.25rem, 2.35vw, 1.85rem);
  line-height: 1.5;
  letter-spacing: -0.005em;
  color: #C2D6D2;
  max-width: 20ch;
  margin: 0 auto;
  padding-top: 40px;
  border-top: 1px solid rgba(57,198,180,0.28);
  text-align: center;
}

.wv-cta { justify-content: flex-end; align-items: center; padding-bottom: 20vh; text-align: center; }

/* Whole closing group (statement + scroll label + arrow) moves as one
   unit — mobile-first default, larger offset from 701px up. */
.wv-cta-block { max-width: 34rem; transform: translateY(-65px); }
@media (min-width: 701px) {
  .wv-cta-block { transform: translateY(-90px); }
}

/* div.wv-cap (tag+class) — needs to out-specificity the ".wv-root div"
   margin reset above, same issue as div.wv-eyebrow/div.wv-group/div.wv-label,
   otherwise this margin silently collapses to 0. */
div.wv-cap {
  font-size: clamp(1.15rem, 2.2vw, 1.7rem);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -0.005em;
  color: #C2D6D2;
  margin-bottom: 34px;
}

.wv-cue { display: flex; flex-direction: column; align-items: center; gap: 32px; color: var(--wv-gold); }
.wv-cue-text { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; }
.wv-cue-arrow { animation: wv-drift 2.4s ease-in-out infinite; }
@keyframes wv-drift {
  0%, 100% { transform: translateY(0); opacity: 0.75; }
  50%      { transform: translateY(6px); opacity: 1; }
}

@media (max-width: 700px) {
  div.wv-columns { flex-direction: column; align-items: center; gap: 22px; }
  div.wv-col-heading { margin-bottom: 12px; }
  div.wv-eyebrow { margin-bottom: 12px; }
  .wv-scrim {
    background: linear-gradient(180deg, rgba(7,16,17,0.9) 0%, rgba(7,16,17,0.78) 60%, rgba(7,16,17,0.5) 100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .wv-cue-arrow { animation: none; }
}
`;
