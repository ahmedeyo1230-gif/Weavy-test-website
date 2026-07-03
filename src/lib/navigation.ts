// Every top-level page now lives at a real path (/, /about, /services, /work,
// /blog, /contact). goToPath pushes the new URL and notifies listeners so the
// route can be re-evaluated — works identically from any page, in both directions.
export function goToPath(path: string) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path)
  }
  // pushState doesn't fire popstate itself — dispatch it so listeners re-evaluate the route.
  window.dispatchEvent(new PopStateEvent('popstate'))
}
