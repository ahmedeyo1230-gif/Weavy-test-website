/** The intro plays on every load of the homepage. Deep links and
 *  reduced-motion visitors go straight to the content. */
export function shouldPlayIntro(): boolean {
  if (window.location.pathname !== '/') return false
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
