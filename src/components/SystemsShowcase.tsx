import { motion } from 'framer-motion'
import { Bot, Workflow, MessageSquare, LineChart, ArrowRight } from 'lucide-react'

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

const services = [
  {
    num: '01',
    icon: <Bot className="w-5 h-5" />,
    title: 'AI Content Automation',
    description:
      'Auto-generate branded content at scale. We build custom LLM pipelines that understand your brand voice and output ready-to-publish assets.',
  },
  {
    num: '02',
    icon: <Workflow className="w-5 h-5" />,
    title: 'Growth Systems',
    description:
      'Automated funnels, lead generation, and CRM workflows. Never let a lead slip through the cracks again with intelligent routing and follow-up.',
  },
  {
    num: '03',
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'Communication AI',
    description:
      'Intelligent chatbots, email automation, and social scheduling. Provide 24/7 support and engagement without expanding your team.',
  },
  {
    num: '04',
    icon: <LineChart className="w-5 h-5" />,
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
              transition={{ duration: 0.6, ease: E }}
              className="text-xs uppercase tracking-widest text-accent-cyan/70 mb-4"
            >
              Systems in Motion
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.08, ease: E }}
              className="text-4xl md:text-5xl font-light tracking-tighter mb-6 text-primary"
            >
              Four core{' '}
              <span className="font-serif italic text-accent-cyan">architectures</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.16, ease: E }}
              className="text-muted text-lg font-light"
            >
              We don't sell hours. We sell outcomes. Here are the core architectures
              we deploy to scale your operations.
            </motion.p>
          </div>

          <motion.a
            href="#contact"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: E }}
            className="hidden md:inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors duration-200 shrink-0 group cursor-pointer"
          >
            All services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.a>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: E }}
              className="group relative bg-surface border border-border rounded-2xl p-8 md:p-10 overflow-hidden cursor-pointer"
              style={{ transition: 'border-color 400ms, box-shadow 400ms' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'hsl(199 89% 60% / 0.3)'
                el.style.boxShadow = '0 0 40px rgba(58,179,232,0.05)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = ''
                el.style.boxShadow = ''
              }}
            >
              {/* Top glow line on hover */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Number + icon row */}
              <div className="flex items-center justify-between mb-8">
                <span className="font-serif italic text-muted/40 text-4xl leading-none select-none">
                  {service.num}
                </span>
                <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-primary group-hover:text-accent-cyan group-hover:border-accent-cyan/30 transition-colors duration-300">
                  {service.icon}
                </div>
              </div>

              <h3 className="text-xl font-medium tracking-tight mb-4 text-primary">
                {service.title}
              </h3>
              <p className="text-muted font-light leading-relaxed mb-8 text-sm">
                {service.description}
              </p>

              <div className="flex items-center text-sm font-medium text-muted group-hover:text-accent-cyan transition-colors duration-300 w-fit">
                Learn more
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
