import { motion } from 'framer-motion'

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-32 px-6 relative bg-background"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left: Animated spinning-border card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md mx-auto lg:mx-0"
        >
          <div className="relative rounded-3xl p-[1px] overflow-hidden group aspect-square">
            {/* Spinning conic gradient */}
            <div className="absolute inset-[-100%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_70%,#3ab3e8_80%,#2563eb_100%)] opacity-40 group-hover:opacity-80 transition-opacity duration-500 will-change-transform" />

            {/* Inner card */}
            <div className="relative bg-surface rounded-[calc(1.5rem-1px)] h-full w-full p-10 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                <span className="text-2xl font-light tracking-tighter text-primary">
                  Weavy<span className="font-serif italic text-accent-cyan">.</span>
                </span>
                <span className="text-xs uppercase tracking-widest text-muted border border-border rounded-full px-3 py-1">
                  Est. 2023
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted mb-1">Location</p>
                  <p className="text-lg font-medium text-primary">London, UK</p>
                </div>
                <div>
                  <p className="text-sm text-muted mb-1">Focus</p>
                  <p className="text-lg font-medium text-primary">AI & Automation Systems</p>
                </div>
                <div>
                  <p className="text-sm text-muted mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-cyan" />
                    </span>
                    <p className="text-base font-medium text-primary">Accepting new clients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Text content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <h2
            id="about-heading"
            className="text-4xl md:text-5xl font-light tracking-tighter leading-tight text-primary"
          >
            We are a{' '}
            <em className="font-serif italic">Triple&nbsp;X</em>{' '}
            automation agency
          </h2>

          <div className="space-y-5 text-muted text-lg leading-relaxed font-light">
            <p>
              We craft bespoke websites, deploy AI-powered chatbots, and build intelligent
              systems for digital marketing, social media automation, and UGC content — so
              your brand operates at scale without adding headcount.
            </p>
            <p>
              Operating out of London, we partner with high-growth brands to replace manual
              chaos with elegant, automated workflows. We also deliver high-quality video
              editing that enhances storytelling and drives engagement across platforms.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            {['Automation', 'Web Design', 'AI Chatbots', 'Content Systems', 'Video Editing'].map(tag => (
              <span
                key={tag}
                className="text-xs uppercase tracking-widest text-muted border border-border rounded-full px-4 py-1.5 hover:border-accent-cyan/40 hover:text-primary transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
