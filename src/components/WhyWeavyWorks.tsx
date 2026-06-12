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
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
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
            className="mt-6 text-muted text-lg font-light max-w-md"
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
              className="feature-card group flex gap-5 p-6 rounded-2xl hover:bg-surface/60 border border-transparent hover:border-border"
              style={{ transition: 'background-color 250ms, border-color 250ms' }}
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-surface border border-border flex items-center justify-center text-muted group-hover:text-accent-cyan group-hover:border-accent-cyan/30" style={{ transition: 'color 250ms, border-color 250ms' }}>
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-medium tracking-tight mb-2 text-primary">
                  {feature.title}
                </h3>
                <p className="text-muted font-light leading-relaxed">
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
