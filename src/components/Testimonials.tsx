import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Briana Patton',
    role: 'Operations Manager',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    quote:
      'Weavy transformed our online presence entirely. The chatbot handles 80% of inquiries automatically — our team now focuses on closing deals instead of answering the same questions.',
  },
  {
    name: 'Farhan Siddiqui',
    role: 'Marketing Director',
    image: 'https://randomuser.me/api/portraits/men/7.jpg',
    quote:
      'The AI chatbot on our website has become our best sales tool. It qualifies leads and books appointments automatically — 24/7, without us lifting a finger.',
  },
  {
    name: 'Sana Sheikh',
    role: 'Sales Manager',
    image: 'https://randomuser.me/api/portraits/women/8.jpg',
    quote:
      'Onboarding was fast and the team genuinely understood our business. The results exceeded everything we expected. Measurable ROI from week one.',
  },
  {
    name: 'Bilal Ahmed',
    role: 'IT Manager',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    quote:
      'The automation systems they built save us hours every day. Implementation was smooth and the results were immediate. Best investment we made this year.',
  },
  {
    name: 'Zainab Hussain',
    role: 'Project Manager',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    quote:
      'Social media went from a burden to a growth engine. The content strategy and scheduling system is exceptional. Our engagement has tripled.',
  },
  {
    name: 'Omar Raza',
    role: 'CEO',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    quote:
      'The bespoke website they delivered is stunning. Clean, fast, and exactly on brand. Clients constantly compliment it — it sets us apart from the competition.',
  },
]

export default function TestimonialsSection() {
  return (
    <section
      className="py-32 px-6 bg-background"
      aria-label="Client Testimonials"
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <p className="text-xs uppercase tracking-widest text-accent-cyan/70 mb-4">Testimonials</p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tighter mb-4 text-primary">
            Don't just take our{' '}
            <span className="font-serif italic text-gold-shimmer">word</span>{' '}
            for it
          </h2>
          <p className="text-muted font-light max-w-lg mx-auto">
            Real results from businesses we've helped grow — faster, smarter, and at scale.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="bg-surface border border-border rounded-2xl p-7 flex flex-col gap-5 hover:border-accent-cyan/20 hover:shadow-[0_0_30px_rgba(58,179,232,0.04)] transition-all duration-500"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-accent-cyan text-accent-cyan opacity-80" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-primary/90 font-light leading-relaxed text-sm flex-1">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-1 border-t border-border/60">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover border border-border"
                />
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
