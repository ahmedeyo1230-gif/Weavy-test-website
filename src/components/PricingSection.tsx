import { motion } from 'framer-motion'
import { goToPath } from '../lib/navigation'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

const PLANS = [
  {
    name: 'Starter',
    price: 'From £299',
    period: '/month',
    blurb: 'Best for small businesses starting with one AI channel.',
    features: [
      'Website chatbot or WhatsApp AI',
      'Basic lead capture',
      'Simple FAQs',
      'Basic booking or enquiry flow',
      'Monthly support',
    ],
    featured: false,
  },
  {
    name: 'Growth',
    price: 'From £799',
    period: '/month',
    blurb: 'Best for businesses that need multiple channels and stronger automation.',
    features: [
      'AI Voice Receptionist',
      'WhatsApp AI',
      'Instagram or Facebook AI',
      'CRM & lead management',
      'Booking automation',
      'Monthly optimisation',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom pricing',
    period: '',
    blurb: 'Best for larger businesses, multi-location teams, and advanced workflows.',
    features: [
      'Full AI operating system',
      'Multiple channels',
      'Custom CRM workflows',
      'Analytics dashboard',
      'Human handover',
      'Priority support',
    ],
    featured: false,
  },
]

function PlanCard({ plan, index }: { plan: typeof PLANS[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: E }}
      style={{
        position: 'relative',
        borderRadius: 24,
        padding: '2rem 1.8rem',
        background: plan.featured ? 'rgba(125,220,255,0.045)' : 'rgba(255,255,255,0.02)',
        border: plan.featured ? '1px solid rgba(125,220,255,0.32)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: plan.featured
          ? '0 32px 80px -24px rgba(0,0,0,0.7), 0 0 60px -20px rgba(125,220,255,0.16)'
          : '0 24px 60px -24px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {plan.featured && (
        <span style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
          fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#010709', background: '#7DDCFF', padding: '0.32rem 0.9rem', borderRadius: 999,
          fontWeight: 600, whiteSpace: 'nowrap',
        }}>
          Most Popular
        </span>
      )}

      <h3 className="font-sans font-light" style={{ fontSize: '1.15rem', color: '#F8FAFC', marginBottom: '0.6rem' }}>
        {plan.name}
      </h3>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '0.7rem' }}>
        <span className="font-sans" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2rem)', fontWeight: 500, color: plan.featured ? '#7DDCFF' : '#F8FAFC', letterSpacing: '-0.02em' }}>
          {plan.price}
        </span>
        {plan.period && (
          <span style={{ fontSize: '0.85rem', color: 'rgba(210,224,232,0.5)' }}>{plan.period}</span>
        )}
      </div>

      <p className="font-sans font-light" style={{ fontSize: '0.85rem', lineHeight: 1.65, color: 'rgba(210,224,232,0.6)', marginBottom: '1.5rem' }}>
        {plan.blurb}
      </p>

      <div aria-hidden="true" style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: '1.4rem' }} />

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem', flex: 1 }}>
        {plan.features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.84rem', color: 'rgba(235,245,255,0.78)' }}>
            <span aria-hidden="true" style={{ flexShrink: 0, width: 5, height: 5, borderRadius: '50%', marginTop: '0.5rem', background: plan.featured ? '#7DDCFF' : 'rgba(125,220,255,0.45)' }} />
            {f}
          </li>
        ))}
      </ul>

      <a
        href="/contact"
        onClick={(e) => { e.preventDefault(); goToPath('/contact') }}
        style={{
          marginTop: '1.8rem',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.85rem 1.4rem',
          borderRadius: 999,
          fontSize: '0.86rem',
          fontWeight: 500,
          textDecoration: 'none',
          transition: 'transform 150ms ease, box-shadow 200ms ease',
          background: plan.featured ? '#7DDCFF' : 'rgba(255,255,255,0.04)',
          color: plan.featured ? '#010709' : '#F8FAFC',
          border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.14)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)' }}
      >
        Book a Platform Demo
      </a>
    </motion.div>
  )
}

export default function PricingSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: '#010709', padding: 'clamp(5rem, 9vw, 8rem) 0' }}
      aria-label="Monthly Platform Plans"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 55% 45% at 50% 0%, rgba(125,220,255,0.045) 0%, transparent 65%)',
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10">
        <div className="text-center max-w-2xl mx-auto" style={{ marginBottom: 'clamp(3rem, 6vw, 4rem)' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: E }}
            style={{ fontSize: '0.67rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(125,220,255,0.68)', marginBottom: '1.3rem' }}
          >
            Monthly Platform Plans
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.72, delay: 0.06, ease: E }}
            className="font-sans font-light"
            style={{ fontSize: 'clamp(2rem, 4.2vw, 3rem)', lineHeight: 1.14, letterSpacing: '-0.032em', color: '#F8FAFC' }}
          >
            Simple monthly plans for businesses{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: '#7DDCFF' }}>
              ready to automate.
            </em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.14, ease: E }}
            className="font-sans font-light"
            style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1rem)', lineHeight: 1.8, color: '#94A3B8', marginTop: '1.2rem' }}
          >
            Start with one channel, then expand into a full AI operating system as your business
            grows. Setup fees may apply depending on automation complexity.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: E }}
          className="font-sans font-light text-center"
          style={{ fontSize: '0.82rem', color: 'rgba(210,224,232,0.5)', marginTop: 'clamp(2rem, 4vw, 2.8rem)' }}
        >
          Setup starts from £750 depending on the number of channels, integrations, and workflow complexity.
        </motion.p>
      </div>
    </section>
  )
}
