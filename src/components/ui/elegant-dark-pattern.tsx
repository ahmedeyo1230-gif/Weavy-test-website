import type React from "react"
import { cn } from "@/lib/utils"

interface DarkGradientBgProps {
  children?: React.ReactNode
  className?: string
}

export function DarkGradientBg({ children, className }: DarkGradientBgProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>

      {/* Dark radial base + skewed cyan streaks */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-100"
          style={{
            background: 'radial-gradient(100% 100% at 0% 0%, rgb(46, 46, 46) 0%, rgb(0, 0, 0) 100%)',
            mask: 'radial-gradient(125% 100% at 0% 0%, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.224) 88.2883%, rgba(0, 0, 0, 0) 100%)'
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(rgb(0, 207, 255) 0%, rgba(0, 207, 255, 0) 100%)',
              mask: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 20%, rgba(0,0,0,0) 36%, rgb(0,0,0) 55%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 78%, rgba(0,0,0,0) 97%)',
              transform: 'skewX(45deg)'
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(rgb(0, 207, 255) 0%, rgba(0, 207, 255, 0) 100%)',
              mask: 'linear-gradient(90deg, rgba(0,0,0,0) 11%, rgb(0,0,0) 25%, rgba(0,0,0,0.55) 41%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 78%, rgba(0,0,0,0) 97%)',
              transform: 'skewX(45deg)'
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(rgb(0, 207, 255) 0%, rgba(0, 207, 255, 0) 100%)',
              mask: 'linear-gradient(90deg, rgba(0,0,0,0) 9%, rgb(0,0,0) 20%, rgba(0,0,0,0.55) 28%, rgba(0,0,0,0.424) 40%, rgb(0,0,0) 48%, rgba(0,0,0,0.267) 54%, rgba(0,0,0,0.13) 78%, rgb(0,0,0) 88%, rgba(0,0,0,0) 97%)',
              transform: 'skewX(45deg)'
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(rgb(0, 207, 255) 0%, rgba(0, 207, 255, 0) 100%)',
              mask: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 17%, rgba(0,0,0,0.55) 26%, rgb(0,0,0) 35%, rgba(0,0,0,0) 47%, rgba(0,0,0,0.13) 69%, rgb(0,0,0) 79%, rgba(0,0,0,0) 97%)',
              transform: 'skewX(45deg)'
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(rgb(0, 207, 255) 0%, rgba(0, 207, 255, 0) 100%)',
              mask: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 20%, rgba(0,0,0,0.55) 27%, rgb(0,0,0) 42%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.13) 67%, rgb(0,0,0) 74%, rgb(0,0,0) 82%, rgba(0,0,0,0.47) 88%, rgba(0,0,0,0) 97%)',
              transform: 'skewX(45deg)'
            }}
          />
        </div>
      </div>

      {/* SVG noise grain (replaces external texture URL) */}
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.045 }}>
        <filter id="edp-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#edp-noise)" fill="white"/>
      </svg>

      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />

      {children}
    </div>
  )
}
