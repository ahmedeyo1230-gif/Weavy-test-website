import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

const testimonials = [
  {
    name: 'Briana Patton',
    role: 'Operations Manager',
    initials: 'BP',
    hue: 199,
    quote:
      'Weavy transformed our online presence entirely. The chatbot handles 80% of inquiries automatically — our team now focuses on closing deals instead of answering the same questions.',
  },
  {
    name: 'Farhan Siddiqui',
    role: 'Marketing Director',
    initials: 'FS',
    hue: 260,
    quote:
      'The AI chatbot on our website has become our best sales tool. It qualifies leads and books appointments automatically — 24/7, without us lifting a finger.',
  },
  {
    name: 'Sana Sheikh',
    role: 'Sales Manager',
    initials: 'SS',
    hue: 150,
    quote:
      'Onboarding was fast and the team genuinely understood our business. The results exceeded everything we expected. Measurable ROI from week one.',
  },
  {
    name: 'Bilal Ahmed',
    role: 'IT Manager',
    initials: 'BA',
    hue: 210,
    quote:
      'The automation systems they built save us hours every day. Implementation was smooth and the results were immediate. Best investment we made this year.',
  },
  {
    name: 'Zainab Hussain',
    role: 'Project Manager',
    initials: 'ZH',
    hue: 30,
    quote:
      'Social media went from a burden to a growth engine. The content strategy and scheduling system is exceptional. Our engagement has tripled.',
  },
  {
    name: 'Omar Raza',
    role: 'CEO',
    initials: 'OR',
    hue: 340,
    quote:
      'The bespoke website they delivered is stunning. Clean, fast, and exactly on brand. Clients constantly compliment it — it sets us apart from the competition.',
  },
]

function Avatar({ initials, hue }: { initials: string; hue: number }) {
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium tracking-wide shrink-0 select-none"
      style={{
        background: `hsl(${hue} 55% 18%)`,
        border: `1px solid hsl(${hue} 55% 30% / 0.5)`,
        color: `hsl(${hue} 70% 70%)`,
      }}
    >
      {initials}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section
      className="py-32 px-6 bg-background"
      aria-label="Client Testimonials"
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: E }}
          className="text-center mb-20"
        >
          <p className="text-xs uppercase tracking-widest text-accent-cyan/70 mb-4">Testimonials</p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tighter mb-4 text-primary">
            Don't just take our{' '}
            <span className="font-serif italic text-gold-shimmer">word</span>{' '}
            for it
          </h2>
          <p className="text-muted font-light max-w-lg mx-auto text-sm leading-relaxed">
            Real results from businesses we've helped grow — faster, smarter, and at scale.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.07, ease: E }}
              className="bg-surface border border-border rounded-2xl p-7 flex flex-col gap-5"
              style={{ transition: 'border-color 400ms, box-shadow 400ms' }}
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
              <p className="text-primary/80 font-light leading-relaxed text-sm flex-1">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <Avatar initials={t.initials} hue={t.hue} />
                <div>
                  <p className="font-medium text-sm text-primary">{t.name}</p>
                  <p className="text-xs text-muted mt-0.5">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
