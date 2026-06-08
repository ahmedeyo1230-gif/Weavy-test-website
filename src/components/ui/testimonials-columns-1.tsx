import React from 'react'
import { motion } from 'motion/react'

export type Testimonial = {
  text: string
  image: string
  name: string
  role: string
}

export const TestimonialsColumn = (props: {
  className?: string
  testimonials: Testimonial[]
  duration?: number
}) => {
  return (
    <div className={props.className} style={{ overflow: 'hidden' }}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '1.25rem' }}
      >
        {[...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={i}
                style={{
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  border: '1px solid hsl(0 0% 100% / 0.08)',
                  background: 'hsl(215 20% 7% / 0.65)',
                  backdropFilter: 'blur(12px)',
                  maxWidth: '18rem',
                  width: '100%',
                  boxShadow: '0 8px 32px -8px hsl(0 0% 0% / 0.5)',
                }}
              >
                <p
                  className="font-sans font-light"
                  style={{ fontSize: '0.85rem', lineHeight: 1.75, color: 'hsl(0 0% 68%)' }}
                >
                  {text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '1.1rem' }}>
                  <img
                    loading="lazy"
                    decoding="async"
                    src={image}
                    alt={name}
                    width={36}
                    height={36}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div>
                    <div
                      className="font-sans"
                      style={{ fontSize: '0.8rem', fontWeight: 400, color: 'hsl(0 0% 88%)', letterSpacing: '-0.01em' }}
                    >
                      {name}
                    </div>
                    <div
                      className="font-sans font-light"
                      style={{ fontSize: '0.72rem', color: 'hsl(0 0% 42%)' }}
                    >
                      {role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))]}
      </motion.div>
    </div>
  )
}
