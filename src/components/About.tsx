import { motion, useReducedMotion } from 'framer-motion'
import AboutDashboardFx from './AboutDashboardFx'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

const TAGS = ['Lead Capture', 'Faster Replies', 'Smarter Follow-Ups', 'Smoother Bookings', 'Standout Visuals', 'Paid Growth']

const SERVICE_MODULES = [
  { num: '01', label: 'Automation & CRM',     desc: 'Enquiries, follow-ups and bookings connected.',            highlight: 'follow-ups and bookings' },
  { num: '02', label: 'Bespoke Websites',     desc: 'Distinctive, high-performance websites built to convert.', highlight: 'high-performance'        },
  { num: '03', label: 'Voice & Chat',         desc: 'Always-on conversations that capture and qualify leads.',  highlight: 'capture and qualify'     },
  { num: '04', label: 'Content & Creative',   desc: 'UGC, design, animation and video that builds trust.',      highlight: 'builds trust'             },
  { num: '05', label: 'Social & Paid Growth', desc: 'Campaigns that turn attention into action.',                highlight: 'attention into action'   },
]

export default function About() { // no diagonal lines bg
  const reduceMotion = useReducedMotion()
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-[72px] md:py-28 lg:py-36 px-6 relative overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 58% 32%, rgba(20, 83, 96, 0.058) 0%, rgba(5, 28, 34, 0.029) 42%, rgba(1, 7, 9, 0) 70%),' +
          'linear-gradient(to bottom, #010709 0%, #010709 48%, #010709 100%)',
        // Overlaps the Connected Systems section above by 1px so the two
        // sections' backgrounds always share a full pixel at the seam,
        // instead of each edge being anti-aliased independently against
        // the page's own (differently-toned, neutral grey) body background.
        marginTop: '-1px',
      }}
    >
      {/* Top fade — blends from the previous section (Connected Systems, #010709) into this section's own background (#010709) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '220px',
          background: 'linear-gradient(to bottom, #010709 0%, rgba(1,7,9,0.6) 45%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Top darkening — a dedicated black-tint layer, separate from the dot
          grid and the seam-blend fade above, so the dots stay completely
          untouched while only this wash is adjusted. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '400px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.065) 50%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Dot grid — masked to fade in gradually from the top instead of
          starting with a hard edge at the Connected Systems boundary.
          (Previously missing the -webkit- prefix used everywhere else in
          this codebase for masks, so the fade never applied in Safari,
          leaving a hard-edged rectangle right at the section boundary.) */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(hsl(0 0% 100% / 0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.35) 70px, #000 180px)',
          maskImage: 'linear-gradient(to bottom, transparent 0, rgba(0, 0, 0, 0.35) 70px, #000 180px)',
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/3 right-1/4 w-[520px] h-[520px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{ background: 'rgba(165,180,252,0.04)', filter: 'blur(110px)' }}
      />

      <div className="max-w-6xl mx-auto">

        {/* ─── Main editorial grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-12 xl:gap-16 items-center mb-14 lg:mb-20">

          {/* ── Left: headline + body + tags + accent line ── */}
          <div className="flex flex-col gap-7 lg:pt-2">

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: E }}
              className="section-label"
            >
              About Weavy
            </motion.p>

            <motion.h2
              id="about-heading"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.07, ease: E }}
              className="font-heading text-4xl md:text-5xl lg:text-[3.25rem] font-medium tracking-tight leading-[1.1] text-primary"
            >
              We make growing a business feel
              <br className="hidden sm:block" />
              {' '}
              <em
                className="font-serif italic weavy-shimmer-about"
                style={{
                  color: '#A5B4FC',
                }}
              >less complicated</em>.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.13, ease: E }}
              className="font-body space-y-4 font-medium leading-relaxed"
              style={{ fontSize: 'var(--dt-about-body, clamp(16px, 1vw, 17px))', color: 'var(--text-body)', lineHeight: 1.8 }}
            >
              <p>
                Weavy is a London-based automation and creative agency. We connect the systems behind
                your <span className="weavy-shimmer-text">enquiries, bookings and follow-ups</span> with
                the creative work that attracts attention and builds trust.
              </p>
              <p>
                You get less to manage and more time for your business, with{' '}
                <span className="weavy-shimmer-text">one team</span> looking after the customer journey
                from first impression to confirmed booking.
              </p>
            </motion.div>

            {/* Service tag chips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2, ease: E }}
              className="flex flex-wrap gap-2"
            >
              {TAGS.map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.22 + i * 0.055, ease: E }}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide rounded-full px-4 py-2 select-none"
                    style={{
                      color: 'rgba(165,180,252,0.82)',
                      border: '1px solid rgba(165,180,252,0.38)',
                      backgroundColor: 'rgba(6,17,20,0.50)',
                      boxShadow: 'none',
                      transition: 'border-color 200ms, color 200ms, background-color 200ms, box-shadow 200ms',
                    }}
                  >
                    <span
                      className="w-[5px] h-[5px] rounded-full shrink-0"
                      style={{ background: 'rgba(165,180,252,0.72)' }}
                    />
                    {tag}
                  </motion.span>
                ))}
            </motion.div>

            {/* Animated accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.55, ease: E }}
              className="h-px w-full max-w-[220px]"
              style={{
                transformOrigin: 'left center',
                background: 'linear-gradient(to right, rgba(165,180,252,0.6), transparent)',
              }}
            />

          </div>

          {/* ── Right: Dashboard image ── */}
          <motion.div
            className="w-full min-w-0"
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.965 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: E }}
          >
            {/* Float wrapper sits outside the sizing transform so the drift is
                true pixels, not multiplied by the 1.53× desktop scale. */}
            <div className="about-illus-float">
            <div
              className="about-illus relative w-full"
              style={{
                maskImage: 'radial-gradient(ellipse 88% 82% at 52% 50%, black 45%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 88% 82% at 52% 50%, black 45%, transparent 100%)',
              }}
            >
              <img
                src="/brand_assets/dashboard1-transparent.webp"
                alt="Illustrative automation dashboard with sample data"
                loading="lazy"
                decoding="async"
                width={1400}
                height={772}
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  objectPosition: 'center center',
                  filter: 'brightness(1.02) saturate(0.92) contrast(0.97) drop-shadow(0 24px 48px rgba(0,0,0,0.30))',
                }}
              />
              {/* Dark overlay to blend with site background */}
              <div aria-hidden="true" style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'rgba(2, 10, 14, 0.08)',
                borderRadius: 'inherit',
              }} />
              <AboutDashboardFx />
            </div>
            </div>
            <p className="font-body text-center text-xs mt-3" style={{ color: 'var(--text-description)' }}>
              Illustrative dashboard with sample data
            </p>
          </motion.div>

        </div>

        {/* ─── Service modules strip ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {SERVICE_MODULES.map((svc, i) => (
            <motion.div
              key={svc.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: E }}
              className="group relative rounded-xl overflow-hidden lg:min-h-[10.25rem] px-5 py-5 sm:px-6 sm:py-5"
              style={{
                background: 'hsl(0 0% 100% / 0.022)',
                border: '1px solid hsl(0 0% 100% / 0.07)',
                              }}
            >
              {/* Top-left violet accent line */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '14px',
                  width: '72px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(165,180,252,0.65), rgba(165,180,252,0.75), transparent)',
                  opacity: 0.9,
                  borderRadius: '0 0 2px 2px',
                  overflow: 'hidden',
                  boxShadow: '0 0 8px 1px rgba(165,180,252,0.35)',
                }}
              >
                <div className="gold-line-glint" />
              </div>
              <div
                className="font-label select-none mb-2.5 sm:mb-4"
                style={{ fontSize: '0.8rem', color: '#A5B4FC' }}
              >
                {svc.num}
              </div>
              <div className="font-heading font-medium mb-2" style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>{svc.label}</div>
              <div className="font-body font-medium leading-relaxed m-tx-secondary" style={{ fontSize: '0.94rem', color: 'var(--text-description)' }}>
                {(() => {
                  const parts = svc.desc.split(svc.highlight)
                  return (
                    <>
                      {parts[0]}
                      <span style={{ color: '#A5B4FC' }}>{svc.highlight}</span>
                      {parts[1]}
                    </>
                  )
                })()}
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Bottom blend — dissolves this section's background into Stats' #010709.
          Ends fully opaque so the last row matches Stats exactly (it stopped
          at 58%, leaving a visible step). The upper stops are unchanged, so
          nothing changes over the content. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(1,7,9,0.12) 35%, rgba(1,7,9,0.38) 65%, rgba(1,7,9,0.74) 84%, #010709 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </section>
  )
}
