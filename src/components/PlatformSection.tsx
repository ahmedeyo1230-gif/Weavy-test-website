import { motion } from 'framer-motion'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

function Icon({ type, color }: { type: string; color: string }) {
  const s = { width: 22, height: 22, fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (type === 'phone') return (
    <svg viewBox="0 0 24 24" style={s}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.98.36 1.94.68 2.86a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.22-1.25a2 2 0 012.11-.45c.92.32 1.88.55 2.86.68A2 2 0 0122 16.92z"/></svg>
  )
  if (type === 'waveform') return (
    <svg viewBox="0 0 24 24" style={s}><path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 12h2"/></svg>
  )
  if (type === 'chat') return (
    <svg viewBox="0 0 24 24" style={s}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
  )
  if (type === 'camera') return (
    <svg viewBox="0 0 24 24" style={s}><rect x="2" y="6" width="20" height="14" rx="3"/><circle cx="12" cy="13" r="3.6"/><path d="M8 6l1.4-2.4A1.6 1.6 0 0110.78 3h2.44a1.6 1.6 0 011.38.8L16 6"/></svg>
  )
  if (type === 'bubble2') return (
    <svg viewBox="0 0 24 24" style={s}><path d="M12 3C6.5 3 2 6.9 2 11.7c0 2.7 1.45 5.13 3.73 6.73L5 22l3.98-2.1c.94.25 1.95.39 3.02.39 5.5 0 10-3.9 10-8.6S17.5 3 12 3z"/><path d="M9 12.2l2.1-2.3 2 1.6 2.1-2.3"/></svg>
  )
  if (type === 'crm') return (
    <svg viewBox="0 0 24 24" style={s}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
  )
  if (type === 'calendar') return (
    <svg viewBox="0 0 24 24" style={s}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M9 16l2 2 4-4"/></svg>
  )
  if (type === 'chart') return (
    <svg viewBox="0 0 24 24" style={s}><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/></svg>
  )
  return null
}

const MODULES = [
  {
    title: 'AI Voice Receptionist',
    desc: 'Handles missed calls, FAQs, bookings, and customer enquiries.',
    icon: 'phone', color: '#F0C56A', titleColor: '#F7E1B4',
  },
  {
    title: 'AI Voice Agent',
    desc: 'Speaks with customers, qualifies enquiries and routes high-intent leads.',
    icon: 'waveform', color: '#7DDCFF', titleColor: '#BEEBFF',
  },
  {
    title: 'WhatsApp Agent',
    desc: 'Replies instantly, captures details, and moves customers to the next step.',
    icon: 'chat', color: '#34D399', titleColor: '#B4F0D2',
  },
  {
    title: 'Instagram DM',
    desc: 'Replies instantly, captures enquiries and guides prospects towards booking.',
    icon: 'camera', color: '#E879C9', titleColor: '#F5B4E1',
  },
  {
    title: 'Facebook Messenger',
    desc: 'Handles Messenger enquiries and keeps conversations organised.',
    icon: 'bubble2', color: '#6BA9FF', titleColor: '#B4D2FF',
  },
  {
    title: 'CRM & Lead Management',
    desc: 'Keeps every lead organised, tracks progress and prevents missed follow-ups.',
    icon: 'crm', color: '#A78BFA', titleColor: '#D2C3FC',
  },
  {
    title: 'Appointment Booking',
    desc: 'Automates bookings, reminders, and customer scheduling.',
    icon: 'calendar', color: '#F0C56A', titleColor: '#EED08C',
  },
  {
    title: 'Analytics Dashboard',
    desc: 'Shows where leads come from, what converts and where follow-up is needed.',
    icon: 'chart', color: '#7DDCFF', titleColor: '#B3E9EF',
  },
]

function ModuleCard({ mod, index }: { mod: typeof MODULES[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: E }}
      style={{
        position: 'relative',
        borderRadius: 18,
        background: 'rgba(255,255,255,0.035)',
        border: '1px solid rgba(255,255,255,0.11)',
        boxShadow: '0 10px 28px rgba(0,0,0,0.34)',
        padding: '1.5rem 1.4rem',
        overflow: 'hidden',
      }}
    >
      {/* Top accent line */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${mod.color}, transparent 75%)` }} />

      {/* Top accent shimmer — slow left-to-right sweep, staggered per card */}
      <div
        aria-hidden="true"
        className="platform-card-shimmer"
        style={{
          position: 'absolute',
          top: 0,
          left: '-45%',
          width: '40%',
          height: 2,
          background: `linear-gradient(to right, transparent, ${mod.color}, transparent)`,
          boxShadow: `0 0 8px ${mod.color}`,
          animationDelay: `${index * 0.15}s`,
        }}
      />
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${mod.color}14`,
        border: `1px solid ${mod.color}38`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 16px ${mod.color}1c`,
        marginBottom: '1.1rem',
      }}>
        <Icon type={mod.icon} color={mod.color} />
      </div>

      <h3 className="font-sans font-light" style={{ fontSize: '1rem', color: mod.titleColor, marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
        {mod.title}
      </h3>
      <p className="font-sans font-light" style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'rgba(220,230,235,0.80)', opacity: 1 }}>
        {mod.desc}
      </p>
    </motion.div>
  )
}

export default function PlatformSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: [
          'radial-gradient(circle at 50% 18%, rgba(24, 105, 125, 0.045) 0%, rgba(5, 24, 29, 0.025) 36%, rgba(1, 7, 9, 0) 64%)',
          'linear-gradient(to bottom, #01080B 0%, #010709 42%, #000506 100%)',
        ].join(', '),
        paddingTop: 'clamp(5rem, 9vw, 8rem)',
        // Connected Systems now sits directly underneath — tighten just this
        // shared edge to a clean ~80-120px (desktop) / 56-80px (tablet) /
        // 40-64px (mobile) combined gap instead of stacking two full
        // section paddings (which read as an oversized empty gap).
        paddingBottom: 'clamp(26px, 5vw, 50px)',
      }}
      aria-label="The Weavy Platform"
    >
      {/* Ambient glow + dot grid, consistent with other platform-style sections */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: [
          'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(125,220,255,0.05) 0%, transparent 65%)',
        ].join(', '),
      }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        backgroundImage: 'radial-gradient(rgba(125,220,255,0.05) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 100%)',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto" style={{ marginBottom: 'clamp(3rem, 6vw, 4.5rem)' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: E }}
            style={{ fontSize: 'clamp(12px, calc(11.3px + 0.19vw), 14px)', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(191, 239, 255, 0.72)', marginBottom: '1.3rem' }}
          >
            One Connected System
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.72, delay: 0.06, ease: E }}
            className="font-sans font-light"
            style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)', lineHeight: 1.14, letterSpacing: '-0.032em', color: '#F8FAFC' }}
          >
            Everything working together, so your business runs better.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.14, ease: E }}
            className="font-sans font-light"
            style={{ fontSize: 'clamp(0.92rem, 1.5vw, 1.05rem)', lineHeight: 1.8, color: 'rgba(220,230,235,0.82)', opacity: 1, marginTop: '1.3rem' }}
          >
            We connect your calls, messages, bookings, automations and CRM—helping you manage
            enquiries, follow up faster and turn more conversations into customers.
          </motion.p>
        </div>

        {/* Module grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {MODULES.map((mod, i) => (
            <ModuleCard key={mod.title} mod={mod} index={i} />
          ))}
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: E }}
          className="text-center"
          style={{ marginTop: 'clamp(2.5rem, 5vw, 3.5rem)' }}
        >
          <div aria-hidden="true" style={{ width: '2.5rem', height: 1, background: 'rgba(125,220,255,0.35)', margin: '0 auto 1.4rem' }} />
          <p className="font-sans font-light" style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)', color: 'rgba(235,245,255,0.82)', letterSpacing: '-0.01em' }}>
            We make everything work together, so running your business feels simpler.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
