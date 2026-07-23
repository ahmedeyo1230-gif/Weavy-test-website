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

              <div className="wv-group">
                <div className="wv-label">Platform:</div>
                <p className="wv-items">
                  <span>AI Voice Receptionists</span>
                  <span>Voice Agents</span>
                  <span>Chatbots</span>
                  <span>WhatsApp</span>
                  <span>Instagram</span>
                  <span>Facebook</span>
                  <span>CRM</span>
                  <span>Bookings</span>
                  <span>Analytics</span>
                </p>
              </div>

              <div className="wv-group">
                <div className="wv-label">Services:</div>
                <p className="wv-items">
                  <span>Bespoke Websites</span>
                  <span>Social Media Marketing</span>
                  <span>Paid Ads</span>
                  <span>Creative Design &amp; Animation</span>
                  <span>UGC</span>
                  <span>Video Editing &amp; Reels</span>
                </p>
              </div>

              <p className="wv-closing">
                Everything your business needs to grow — all in one place.
              </p>
            </div>
          </div>

          <div className="wv-overlay wv-cta" ref={ctaRef}>
            <div className="wv-cta-block">
              <div className="wv-cap">
                Everything your business needs to grow — all in one place.
              </div>
              <div className="wv-cue">
                <span className="wv-cue-text">Scroll to explore the platform</span>
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
  background: radial-gradient(120% 90% at 50% 48%, #0c1a1b 0%, #071011 72%);
}
.wv-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }

.wv-scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(100deg, rgba(7,16,17,0.92) 0%, rgba(7,16,17,0.75) 34%, rgba(7,16,17,0) 62%);
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

.wv-eyebrow {
  font-size: clamp(1rem, 1.45vw, 1.32rem);
  letter-spacing: 0.34em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--wv-teal);
  opacity: 0.9;
  margin-bottom: 2.2rem;
}

.wv-group { margin-bottom: 2rem; }
.wv-group:last-of-type { margin-bottom: 2.4rem; }

.wv-label {
  font-size: 0.8rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  font-weight: 700;
  color: #A9B963;
  margin-bottom: 0.7rem;
}

.wv-items {
  font-weight: 400;
  font-size: clamp(1rem, 1.75vw, 1.32rem);
  line-height: 1.9;
  letter-spacing: 0.005em;
  color: rgba(234,241,240,0.77);
  text-align: center;
}
/* each service is an unbreakable unit; the bullet binds to the item before it,
   so a name never splits and no line ever begins with a bullet */
.wv-items span { white-space: nowrap; }
.wv-items span::after {
  content: ' \\2022 ';
  color: rgba(234,241,240,0.42);
  white-space: normal;
}
.wv-items span:last-child::after { content: ''; }

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
  padding-bottom: 1.6rem;
  border-bottom: 1px solid rgba(57,198,180,0.28);
  text-align: center;
}

.wv-cta { justify-content: flex-end; align-items: center; padding-bottom: 20vh; text-align: center; }
.wv-cta-block { max-width: 34rem; }
.wv-cap {
  font-size: clamp(1.15rem, 2.2vw, 1.7rem);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -0.005em;
  color: #C2D6D2;
  margin-bottom: 1.9rem;
}

.wv-cue { display: flex; flex-direction: column; align-items: center; gap: 0.9rem; color: var(--wv-gold); }
.wv-cue-text { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; }
.wv-cue-arrow { animation: wv-drift 2.4s ease-in-out infinite; }
@keyframes wv-drift {
  0%, 100% { transform: translateY(0); opacity: 0.75; }
  50%      { transform: translateY(6px); opacity: 1; }
}

@media (max-width: 700px) {
  .wv-items { line-height: 1.7; }
  .wv-group { margin-bottom: 1.5rem; }
  .wv-eyebrow { margin-bottom: 1.6rem; }
  .wv-scrim {
    background: linear-gradient(180deg, rgba(7,16,17,0.9) 0%, rgba(7,16,17,0.78) 60%, rgba(7,16,17,0.5) 100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .wv-cue-arrow { animation: none; }
}
`;
