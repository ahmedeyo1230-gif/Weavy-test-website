import { useEffect, useState } from 'react'

// Live boolean for a CSS media query. Used where a mobile and a desktop
// variant are different elements (e.g. two <video>s) so only the active one
// mounts — CSS `hidden` alone would still let the hidden one download.
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    setMatches(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}
