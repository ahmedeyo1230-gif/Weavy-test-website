// Lightweight SPA path navigation, layered on top of the existing hash-anchor
// system. Real paths (e.g. "/services") live in history.pathname; in-page
// anchors (#work, #blog, #contact, #about) keep working exactly as before.
export function goToPath(path: string) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path)
  }
  // pushState doesn't fire popstate itself — dispatch it so listeners re-evaluate the route.
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function handleNavClick(path: string) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    goToPath(path)
  }
}
