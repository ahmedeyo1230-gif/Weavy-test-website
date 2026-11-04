const SESSION_KEY = 'weavy-intro-seen'

/** The intro only runs on the first homepage visit of a session. Deep links,
 *  reloads and reduced-motion visitors go straight to the content. */
export function shouldPlayIntro(): boolean {
  if (window.location.pathname !== '/') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    if (window.sessionStorage.getItem(SESSION_KEY)) return false
    window.sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    return false
  }
  return true
}
