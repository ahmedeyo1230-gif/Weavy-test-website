import { ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'

/**
 * Reusable Lenis smooth-scroll wrapper.
 *
 * There is only ever one of these mounted in the app (currently inside
 * SystemsServicesScroll, the only section that needs eased scroll physics
 * for its sticky-panel effect). `root` tells Lenis to manage the window's
 * own scroll rather than a local container, so mounting this a second time
 * anywhere else would create a competing scroll instance — reuse this one
 * instead of adding another `<ReactLenis root>`.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
