// Responsive audit: full-page screenshots + horizontal-overflow check for
// every page at every target width. Usage:
//   node scripts/responsive-audit.mjs [label] [baseUrl]
// Screenshots → responsive-screenshots/<label>/<page>-<width>.png
// Report      → responsive-screenshots/<label>/report.json
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const label = process.argv[2] ?? 'before'
const base = process.argv[3] ?? 'http://localhost:5199'
const PAGES = { home: '/', services: '/services', work: '/work', blog: '/blog', contact: '/contact' }
const WIDTHS = (process.env.WIDTHS ?? '360,375,390,430,768,1024,1280,1440').split(',').map(Number)
const ONLY = process.env.PAGES?.split(',')
const outDir = path.join('responsive-screenshots', label)
fs.mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const report = []

for (const [name, route] of Object.entries(PAGES)) {
  if (ONLY && !ONLY.includes(name)) continue
  for (const width of WIDTHS) {
   for (let attempt = 0; attempt < 3; attempt++) {
   try {
    const mobile = width < 768
    const ctx = await browser.newContext({
      viewport: { width, height: mobile ? 844 : width < 1024 ? 1024 : 900 },
      deviceScaleFactor: 1,
      isMobile: mobile,
      hasTouch: mobile,
    })
    const page = await ctx.newPage()
    await page.goto(base + route, { waitUntil: 'domcontentloaded' })
    // Wait out the LoadingScreen (it unmounts once the main content mounts).
    await page.waitForFunction(() => document.querySelector('nav, header, section'), null, { timeout: 20000 })
    await page.waitForTimeout(4500)

    // Scroll through the page so scroll-triggered + lazy content renders.
    for (let i = 0; i < 400; i++) {
      const done = await page.evaluate(() => {
        window.scrollBy(0, Math.round(window.innerHeight * 0.6))
        return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4
      })
      await page.waitForTimeout(120)
      if (done) break
    }
    await page.waitForTimeout(800)

    const result = await page.evaluate(() => {
      const vw = window.innerWidth
      const doc = document.documentElement
      const overflow = doc.scrollWidth > vw
      const culprits = []
      // An element "leaks" if its box extends past the viewport and no
      // ancestor clips it on the x axis.
      const clipped = (el) => {
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const cs = getComputedStyle(p)
          if (cs.overflowX !== 'visible' || cs.contain.includes('paint')) {
            const r = p.getBoundingClientRect()
            if (r.right <= vw + 1 && r.left >= -1) return true
          }
        }
        return false
      }
      const leaks = (el) => {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) return false
        const cs = getComputedStyle(el)
        if (cs.position === 'fixed') return false
        return (r.right > vw + 1 || r.left < -1) && !clipped(el)
      }
      const all = [...document.body.querySelectorAll('*')]
      const leakSet = new Set(all.filter(leaks))
      for (const el of leakSet) {
        // Report only the origin: an element whose parent doesn't itself leak.
        if (el.parentElement && leakSet.has(el.parentElement)) continue
        const r = el.getBoundingClientRect()
        const section = el.closest('section, footer, header, nav')
        culprits.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || undefined,
          cls: (el.getAttribute('class') || '').slice(0, 140),
          text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60),
          left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width),
          section: section ? `${section.tagName.toLowerCase()}${section.id ? '#' + section.id : ''}${section.getAttribute('aria-labelledby') ? '[' + section.getAttribute('aria-labelledby') + ']' : ''}` : null,
        })
      }
      return { scrollWidth: doc.scrollWidth, innerWidth: vw, overflow, culprits: culprits.slice(0, 25) }
    })

    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)
    const file = path.join(outDir, `${name}-${width}.png`)
    try {
      await page.screenshot({ path: file, fullPage: true, timeout: 60000 })
    } catch (e) {
      result.screenshotError = String(e).slice(0, 200)
    }
    // Also capture the first viewport (above-the-fold check).
    await page.screenshot({ path: path.join(outDir, `${name}-${width}-fold.png`) })
    report.push({ page: name, width, ...result })
    console.log(`${name.padEnd(9)} ${String(width).padStart(4)}  overflow=${result.overflow} sw=${result.scrollWidth}  culprits=${result.culprits.length}`)
    await ctx.close()
    break
   } catch (e) {
    console.log(`${name} ${width} attempt ${attempt + 1} failed: ${String(e).split("\n")[0]}`)
   }
   }
  }
}

fs.writeFileSync(path.join(outDir, `report${ONLY ? '-' + ONLY.join('_') : ''}.json`), JSON.stringify(report, null, 2))
await browser.close()
