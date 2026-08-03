import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

const testimonials = [
  {
    name: 'Zakaria Dahir',
    role: 'Co-Founder, Champion Office for Scaling Up Nutrition',
    avatar: '/brand_assets/Dr.Zak.png',
    avatarFocalPoint: { top: '-35%', left: '-25%' },
    quote:
      'Weavy understood our mission from the first conversation. They built us a site that communicates trust and credibility — exactly what we needed to connect with partners and stakeholders. The process was smooth, the delivery was fast, and the result speaks for itself.',
  },
  {
    name: 'Lila Karim',
    role: 'Creative Director, Level UP',
    initials: 'LK',
    avatarGradient: 'linear-gradient(135deg, hsl(340 60% 26%), hsl(280 55% 16%))',
    quote:
      'Working with Weavy completely changed how we show up online. The social media strategy and content they delivered felt premium from day one — our engagement grew, our brand looked sharper, and clients started coming to us instead of the other way around.',
  },
]

function Avatar({
  name, initials, avatar, avatarGradient, avatarFocalPoint,
}: {
  name: string
  initials?: string
  avatar?: string
  avatarGradient?: string
  avatarFocalPoint?: { top: string; left: string }
}) {
  if (initials) {
    return (
      <div
        className="font-label w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium tracking-wide shrink-0 select-none"
        style={{
          background: avatarGradient ?? 'linear-gradient(135deg, hsl(199 70% 22%), hsl(230 60% 14%))',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'hsl(199 85% 84%)',
        }}
      >
        {initials}
      </div>
    )
  }

  return (
    <div className="relative w-9 h-9 rounded-full shrink-0 overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
      <img
        src={avatar}
        alt={name}
        style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          top: avatarFocalPoint?.top ?? '0',
          left: avatarFocalPoint?.left ?? '-25%',
          objectFit: 'cover',
        }}
      />
      {/* Soft inner vignette — blends any residual edge tone from the source photo into the dark card */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 6px 1px rgba(0,0,0,0.45)' }} />
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section
      className="py-32 px-6 relative"
      aria-label="Client Testimonials"
      style={{ background: '#06080A' }}
    >
      {/* Top blend — continues from WhyWeavyWorks boundary */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '300px',
          background: 'linear-gradient(to bottom, #010709 0%, rgba(1,7,9,0.78) 28%, rgba(6,8,10,0.32) 58%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: E }}
          className="text-center mb-20"
        >
          <p className="font-label font-medium text-xs uppercase tracking-widest text-accent-cyan/70 mb-4">Testimonials</p>
          <h2 className="font-heading text-3xl md:text-5xl font-medium tracking-tighter mb-4 text-primary">
            Don't just take our{' '}
            <span className="font-serif italic text-gold-shimmer">word</span>{' '}
            for it
          </h2>
          <p className="font-body max-w-lg mx-auto text-sm font-normal leading-relaxed" style={{ color: 'var(--text-body)', lineHeight: 1.75 }}>
            Real results from businesses we've helped grow — faster, smarter, and at scale.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.07, ease: E }}
              className="rounded-2xl p-7 flex flex-col gap-5"
              style={{
                background: '#0C0E10',
                border: '1px solid rgba(255,255,255,0.09)',
                transition: 'border-color 400ms, box-shadow 400ms',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'hsl(199 89% 60% / 0.18)'
                el.style.boxShadow = '0 0 30px rgba(58,179,232,0.04)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = ''
                el.style.boxShadow = ''
              }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-accent-cyan text-accent-cyan opacity-70" />
                ))}
              </div>

              {/* Quote */}
              <p className="font-body font-normal leading-relaxed flex-1" style={{ fontSize: '16px', color: 'var(--text-body)', lineHeight: 1.75 }}>
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <Avatar name={t.name} initials={t.initials} avatar={t.avatar} avatarGradient={t.avatarGradient} avatarFocalPoint={t.avatarFocalPoint} />
                <div>
                  <p className="font-body font-medium text-primary" style={{ fontSize: '15px' }}>{t.name}</p>
                  <p className="font-label mt-0.5 font-medium" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Bottom blend — dissolves into Footer boundary */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(6,8,10,0.5) 50%, #06080A 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </section>
  )
}
