import { motion } from 'framer-motion'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

const TAGS = ['Digital Marketing', 'Business Process Automation', 'Lead Generation', 'CRM Automation', 'Graphic Design', 'Paid Social Media Advertising']

const SERVICE_MODULES = [
  { num: '01', label: 'Automation',      desc: 'End-to-end workflow systems',      highlight: 'workflow systems'  },
  { num: '02', label: 'Web Design',      desc: 'Bespoke, high-performance sites',  highlight: 'high-performance'  },
  { num: '03', label: 'Custom Chatbots', desc: 'Intelligent 24/7 engagement',      highlight: '24/7 engagement'   },
  { num: '04', label: 'Content Systems', desc: 'Scalable brand content at scale',  highlight: 'brand content'     },
  { num: '05', label: 'Video Editing',   desc: 'Storytelling that drives results', highlight: 'drives results'    },
]

export default function About() { // no diagonal lines bg
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-28 lg:py-36 px-6 relative overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(80,180,180,0.06), transparent 55%),' +
          '#0B1114',
      }}
    >
      {/* Top fade — blends from the previous section (Platform, #010709) into this section's own background (#0B1114) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '220px',
          background: 'linear-gradient(to bottom, #010709 0%, rgba(11,17,20,0.6) 45%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(hsl(0 0% 100% / 0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/3 right-1/4 w-[520px] h-[520px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{ background: 'hsl(199 89% 60% / 0.04)', filter: 'blur(110px)' }}
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
              className="text-xs uppercase tracking-widest text-accent-cyan/70"
            >
              About Weavy
            </motion.p>

            <motion.h2
              id="about-heading"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.07, ease: E }}
              className="text-4xl md:text-5xl lg:text-[3.25rem] font-light tracking-tighter leading-[1.1] text-primary"
            >
              We are a{' '}
              <em
                className="font-serif italic"
                style={{
                  background: 'linear-gradient(90deg, #ffffff 0%, #7DDCFF 40%, #2BA8D9 70%, #7DDCFF 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradientShift 4s linear infinite',
                }}
              >full-stack</em>
              <br className="hidden sm:block" />
              {' '}automation platform
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.13, ease: E }}
              className="space-y-4 font-medium leading-relaxed"
              style={{ fontSize: 'clamp(0.9rem, 1.15vw, 1.02rem)', color: '#CBD5E1', lineHeight: 1.8 }}
            >
              <p>
                We craft <span className="weavy-shimmer-text">bespoke websites</span>, deploy{' '}
                <span className="weavy-shimmer-text">smart chatbots</span>, and build
                intelligent systems for{' '}
                <span className="weavy-shimmer-text">digital marketing</span>,{' '}
                <span className="weavy-shimmer-text">social media automation</span>,{' '}
                <span className="weavy-shimmer-text">UGC content</span>,{' '}
                <span className="weavy-shimmer-text">graphic design & animation</span>, and{' '}
                <span className="weavy-shimmer-text">video editing</span>. So your business
                handles more customers without extra employees.
              </p>
              <p>
                Operating out of London, we partner with high-growth brands to replace manual
                chaos with elegant, automated workflows. We also deliver high-quality video
                editing that enhances storytelling and drives engagement across platforms.
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
                    className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest rounded-full px-4 py-2 cursor-pointer select-none"
                    style={{
                      color: 'rgba(191,239,255,0.82)',
                      border: '1px solid rgba(43,168,217,0.38)',
                      backgroundColor: 'rgba(6,17,20,0.50)',
                      boxShadow: 'none',
                      transition: 'border-color 200ms, color 200ms, background-color 200ms, box-shadow 200ms',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'rgba(125,220,255,0.70)'
                      el.style.color = '#ffffff'
                      el.style.backgroundColor = 'rgba(9,32,39,0.80)'
                      el.style.boxShadow = '0 0 22px rgba(125,220,255,0.18)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = 'rgba(43,168,217,0.38)'
                      el.style.color = 'rgba(191,239,255,0.82)'
                      el.style.backgroundColor = 'rgba(6,17,20,0.50)'
                      el.style.boxShadow = 'none'
                    }}
                  >
                    <span
                      className="w-[5px] h-[5px] rounded-full shrink-0"
                      style={{ background: 'rgba(43,168,217,0.72)' }}
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
                background: 'linear-gradient(to right, hsl(199 89% 60% / 0.6), transparent)',
              }}
            />

          </div>

          {/* ── Right: Dashboard image ── */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: E }}
          >
            <div
              className="relative w-full [transform:scale(1.19)] lg:[transform:scale(1.62)_translateX(10%)]"
              style={{
                maskImage: 'radial-gradient(ellipse 88% 82% at 52% 50%, black 45%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 88% 82% at 52% 50%, black 45%, transparent 100%)',
              }}
            >
              <img
                src="/brand_assets/dashboard1.webp"
                alt="Weavy automation dashboard"
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
                  filter: 'brightness(1.02) saturate(0.92) contrast(0.97)',
                }}
              />
              {/* Dark overlay to blend with site background */}
              <div aria-hidden="true" style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'rgba(2, 10, 14, 0.08)',
                borderRadius: 'inherit',
              }} />
            </div>
          </motion.div>

        </div>

        {/* ─── Service modules strip ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {SERVICE_MODULES.map((svc, i) => (
            <motion.div
              key={svc.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: E }}
              className="group relative rounded-xl overflow-hidden cursor-pointer"
              style={{
                padding: '2.1rem 1.9rem 2.4rem',
                minHeight: '13rem',
                background: 'hsl(0 0% 100% / 0.022)',
                border: '1px solid hsl(0 0% 100% / 0.07)',
                transition: 'border-color 280ms, background-color 280ms, box-shadow 280ms, transform 280ms cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'rgba(169,155,255,0.32)'
                el.style.backgroundColor = 'rgba(169,155,255,0.032)'
                el.style.boxShadow = '0 12px 40px rgba(169,155,255,0.12), 0 0 0 1px rgba(169,155,255,0.09)'
                el.style.transform = 'translateY(-9px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'hsl(0 0% 100% / 0.07)'
                el.style.backgroundColor = 'hsl(0 0% 100% / 0.022)'
                el.style.boxShadow = 'none'
                el.style.transform = 'translateY(0)'
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
                  background: 'linear-gradient(90deg, transparent, rgba(183,174,255,0.65), rgba(169,155,255,0.75), transparent)',
                  opacity: 0.9,
                  borderRadius: '0 0 2px 2px',
                  overflow: 'hidden',
                  boxShadow: '0 0 8px 1px rgba(183,174,255,0.35)',
                }}
              >
                <div className="gold-line-glint" />
              </div>
              <div
                className="font-mono select-none mb-5"
                style={{ fontSize: '0.8rem', color: '#A99BFF', opacity: 0.85 }}
              >
                {svc.num}
              </div>
              <div className="font-semibold mb-2" style={{ fontSize: '1.15rem', color: '#F8FAFC' }}>{svc.label}</div>
              <div className="font-medium leading-relaxed" style={{ fontSize: '0.94rem', color: '#B0BAC8' }}>
                {(() => {
                  const parts = svc.desc.split(svc.highlight)
                  return (
                    <>
                      {parts[0]}
                      <span style={{ color: '#A99BFF', opacity: 0.88 }}>{svc.highlight}</span>
                      {parts[1]}
                    </>
                  )
                })()}
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Bottom blend — dissolves #0B1114 into Stats' #071011 */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(7,16,17,0.12) 35%, rgba(7,16,17,0.38) 65%, rgba(7,16,17,0.58) 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </section>
  )
}
