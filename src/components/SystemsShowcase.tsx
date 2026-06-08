import { motion } from 'framer-motion'
import { Bot, Workflow, MessageSquare, LineChart, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: <Bot className="w-6 h-6" />,
    title: 'AI Content Automation',
    description:
      'Auto-generate branded content at scale. We build custom LLM pipelines that understand your brand voice and output ready-to-publish assets.',
  },
  {
    icon: <Workflow className="w-6 h-6" />,
    title: 'Growth Systems',
    description:
      'Automated funnels, lead generation, and CRM workflows. Never let a lead slip through the cracks again with intelligent routing and follow-up.',
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'Communication AI',
    description:
      'Intelligent chatbots, email automation, and social scheduling. Provide 24/7 support and engagement without expanding your team.',
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: 'Brand Intelligence',
    description:
      'Live monitoring, analytics, and automated reporting. Real-time insights delivered directly to your Slack or inbox — automatically.',
  },
]

export default function SystemsShowcase() {
  return (
    <section id="section-9" className="py-32 px-6 bg-background">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs uppercase tracking-widest text-accent-cyan/70 mb-4"
            >
              Systems in Motion
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-light tracking-tighter mb-6 text-primary"
            >
              Our{' '}
              <span className="font-serif italic text-accent-cyan">Systems</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-muted text-lg font-light"
            >
              We don't sell hours. We sell outcomes. Here are the core architectures
              we deploy to scale your operations.
            </motion.p>
          </div>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-surface border border-border rounded-2xl p-8 md:p-10 transition-all duration-500 hover:border-accent-cyan/30 hover:shadow-[0_0_40px_rgba(58,179,232,0.05)] overflow-hidden"
            >
              {/* Top glow line on hover */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-primary mb-8 group-hover:text-accent-cyan group-hover:border-accent-cyan/30 transition-colors duration-300">
                {service.icon}
              </div>

              <h3 className="text-2xl font-medium tracking-tight mb-4 text-primary">
                {service.title}
              </h3>
              <p className="text-muted font-light leading-relaxed mb-8">
                {service.description}
              </p>

              <div className="flex items-center text-sm font-medium text-primary group-hover:text-accent-cyan transition-colors duration-300 cursor-pointer w-fit">
                Explore{' '}
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
