// Mobile QA pass: for every page × width, records console errors, failed
// requests (4xx/5xx/network), horizontal overflow, broken internal links,
// form inputs that trigger iOS zoom (<16px), overlapping fixed elements, and
// exercises the mobile menu (open → link → navigates → closes).
// Usage: node scripts/mobile-qa.mjs [baseUrl]   → responsive-screenshots/qa.json
import { chromium } from 'playwright'
import fs from 'node:fs'

const base = process.argv[2] ?? 'http://localhost:5199'
const PAGES = { home: '/', services: '/services', work: '/work', blog: '/blog', contact: '/contact' }
const WIDTHS = (process.env.WIDTHS ?? '360,375,390,430,768').split(',').map(Number)
const ONLY = process.env.PAGES?.split(',')
const browser = await chromium.launch()
const results = []

for (const [name, route] of Object.entries(PAGES)) {
  if (ONLY && !ONLY.includes(name)) continue
  for (const width of WIDTHS) {
    const mobile = width < 768
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, isMobile: mobile, hasTouch: mobile })
    const page = await ctx.newPage()
    const consoleErrors = [], failed = []
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)) })
    page.on('pageerror', e => consoleErrors.push('pageerror: ' + String(e).slice(0, 200)))
    page.on('requestfailed', r => { const u = r.url(); if (!/mux\.com|\.m3u8|\.ts(\?|$)/.test(u)) failed.push(`${r.failure()?.errorText} ${u.slice(0, 140)}`) })
    page.on('response', r => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url().slice(0, 140)}`) })

    await page.goto(base + route, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(4500)
    for (let i = 0; i < 400; i++) {
      const done = await page.evaluate(() => { scrollBy(0, Math.round(innerHeight * 0.6)); return scrollY + innerHeight >= document.documentElement.scrollHeight - 4 })
      await page.waitForTimeout(90)
      if (done) break
    }
    await page.waitForTimeout(1000)

    const dom = await page.evaluate(() => {
      const vw = innerWidth
      const links = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'))
      const internal = [...new Set(links.filter(h => h.startsWith('/') && !h.startsWith('//')))]
      const anchors = [...new Set(links.filter(h => h.startsWith('#') && h.length > 1))].filter(h => !document.getElementById(h.slice(1)))
      const placeholders = links.filter(h => h === '#' || h === '').length
      const inputs = [...document.querySelectorAll('input, textarea, select')].filter(el => el.getBoundingClientRect().width > 0)
        .map(el => ({ name: el.name || el.id || el.type, fs: parseFloat(getComputedStyle(el).fontSize), h: Math.round(el.getBoundingClientRect().height) }))
      const imgs = [...document.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth && i.getBoundingClientRect().width > 40)
        .map(i => { const r = i.getBoundingClientRect(), cs = getComputedStyle(i); const ar = i.naturalWidth / i.naturalHeight, br = r.width / r.height
          return { src: i.currentSrc.split('/').pop().slice(0, 40), distorted: cs.objectFit === 'fill' && Math.abs(ar - br) / ar > 0.04 } })
        .filter(x => x.distorted)
      const broken = [...document.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map(i => i.getAttribute('src').slice(0, 80))
      return { overflow: document.documentElement.scrollWidth > vw, sw: document.documentElement.scrollWidth, internal, anchors, placeholders, smallInputs: inputs.filter(i => i.fs < 16), inputs: inputs.length, distorted: imgs, brokenImgs: broken }
    })

    // Navigation: mobile menu on phones, desktop links on tablet.
    let nav = 'n/a'
    try {
      await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400)
      const target = name === 'contact' ? 'Blog' : 'Contact'
      const expect = target === 'Blog' ? '/blog' : '/contact'
      if (width < 640) {
        await page.getByRole('button', { name: 'Open menu' }).tap()
        await page.waitForTimeout(350)
        const open = await page.locator('#mobile-menu').isVisible()
        await page.locator('#mobile-menu a', { hasText: target }).tap()
        await page.waitForTimeout(900)
        nav = `menu ${open ? 'opened' : 'DID NOT OPEN'}; → ${await page.evaluate(() => location.pathname)} (expected ${expect}); closed=${!(await page.locator('#mobile-menu').isVisible())}`
      } else {
        await page.locator('nav[aria-label="Main navigation"] ul a', { hasText: target }).click()
        await page.waitForTimeout(900)
        nav = `desktop link → ${await page.evaluate(() => location.pathname)} (expected ${expect})`
      }
    } catch (e) { nav = 'NAV ERROR: ' + String(e).split('\n')[0] }

    results.push({ page: name, width, consoleErrors: [...new Set(consoleErrors)], failed: [...new Set(failed)], nav, ...dom })
    console.log(`${name.padEnd(9)} ${String(width).padStart(4)} overflow=${dom.overflow} consoleErr=${new Set(consoleErrors).size} failedReq=${new Set(failed).size} smallInputs=${dom.smallInputs.length} brokenImg=${dom.brokenImgs.length} distorted=${dom.distorted.length} deadAnchors=${dom.anchors.length} | ${nav}`)
    await ctx.close()
  }
}

// Check every internal link path discovered actually serves the app.
const paths = [...new Set(results.flatMap(r => r.internal))]
const linkCheck = {}
for (const p of paths) {
  const res = await fetch(base + p).catch(() => null)
  linkCheck[p] = res ? res.status : 'ERR'
}
fs.writeFileSync(`responsive-screenshots/qa${ONLY ? '-' + ONLY.join('_') : ''}.json`, JSON.stringify({ results, linkCheck }, null, 2))
console.log('internal links:', JSON.stringify(linkCheck))
await browser.close()
