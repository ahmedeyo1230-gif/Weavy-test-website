import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Scaling, Target } from 'lucide-react'

const features = [
  {
    icon: <CheckCircle2 className="w-5 h-5" />,
    title: 'End-to-end ownership',
    description:
      'We handle the strategy, the code, the integrations, and the maintenance. You just get the results.',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Async-first delivery',
    description:
      'No unnecessary meetings. We communicate via Slack and Loom, delivering updates while you sleep.',
  },
  {
    icon: <Scaling className="w-5 h-5" />,
    title: 'Built for scale from day one',
    description:
      'Our architectures are designed to handle 10× your current volume without breaking a sweat.',
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Results-obsessed',
    description:
      "We tie our success to your metrics. If a system isn't saving you time or making you money, we rebuild it.",
  },
]

export default function WhyWeavyWorks() {
  return (
    <section
      className="py-32 px-6 relative overflow-hidden bg-background"
      aria-label="Why Weavy Works"
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(0 0% 100% / 0.045) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      {/* Cyan/teal radial glow — upper left */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-15%',
          left: '-8%',
          width: '60%',
          height: '72%',
          background:
            'radial-gradient(ellipse at center, hsl(199 89% 58% / 0.07) 0%, hsl(210 80% 35% / 0.04) 40%, transparent 68%)',
        }}
        aria-hidden="true"
      />

      {/* Blue-green glow — lower right */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-10%',
          right: '-5%',
          width: '50%',
          height: '60%',
          background:
            'radial-gradient(ellipse at center, hsl(180 55% 28% / 0.055) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      {/* Dark charcoal gradient depth layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(148deg, hsl(210 35% 7% / 0.38) 0%, transparent 45%, hsl(180 30% 5% / 0.22) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Cinematic noise texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.022,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)'/%3E%3C/svg%3E\")",
          backgroundSize: '256px 256px',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

        {/* Left: sticky heading */}
        <div className="lg:sticky lg:top-32">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs uppercase tracking-widest text-accent-cyan/70 mb-5"
          >
            Why Weavy Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tighter text-primary"
          >
            Built with{' '}
            <span className="font-serif italic text-accent-cyan">strategy</span>,
            powered by automation.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg font-medium max-w-md"
          style={{ color: '#CBD5E1', lineHeight: 1.75 }}
          >
            We operate differently than traditional agencies. We are an extension
            of your team, focused purely on leverage.
          </motion.p>
        </div>

        {/* Right: feature rows */}
        <div className="flex flex-col gap-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="feature-card group flex gap-5 p-6 rounded-2xl border border-transparent"
              style={{
                transition: 'background-color 250ms, border-color 250ms',
                background: 'transparent',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(16,24,32,0.7)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
              }}
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center group-hover:text-accent-cyan group-hover:border-accent-cyan/30" style={{ background: '#101820', border: '1px solid rgba(255,255,255,0.10)', color: '#94A3B8', transition: 'color 250ms, border-color 250ms' }}>
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-medium tracking-tight mb-2 text-primary">
                  {feature.title}
                </h3>
                <p className="font-medium leading-relaxed" style={{ color: '#CBD5E1', lineHeight: 1.75 }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
