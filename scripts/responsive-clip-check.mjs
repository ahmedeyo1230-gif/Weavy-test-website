// Companion to responsive-audit.mjs: finds problems the page-level overflow
// check can't see because a section's overflow:hidden masks them —
//   • text clipped by the viewport edge
//   • text rendered below 11px (unreadable on a phone)
//   • tap targets smaller than 44×44
//   • h1/h2 sizes
// Usage: node scripts/responsive-clip-check.mjs [label] [baseUrl]
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const label = process.argv[2] ?? 'before'
const base = process.argv[3] ?? 'http://localhost:5199'
const PAGES = { home: '/', services: '/services', work: '/work', blog: '/blog', contact: '/contact' }
const WIDTHS = (process.env.WIDTHS ?? '360,390,768').split(',').map(Number)
const ONLY = process.env.PAGES?.split(',')
const outDir = path.join('responsive-screenshots', label)
fs.mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const out = []
for (const [name, route] of Object.entries(PAGES)) {
  if (ONLY && !ONLY.includes(name)) continue
  for (const width of WIDTHS) {
    const mobile = width < 768
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, isMobile: mobile, hasTouch: mobile })
    const page = await ctx.newPage()
    await page.goto(base + route, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(4500)
    for (let i = 0; i < 400; i++) {
      const done = await page.evaluate(() => {
        window.scrollBy(0, Math.round(window.innerHeight * 0.6))
        return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4
      })
      await page.waitForTimeout(100)
      if (done) break
    }
    await page.waitForTimeout(800)
    const r = await page.evaluate(() => {
      const vw = window.innerWidth
      const visible = (el) => {
        const cs = getComputedStyle(el)
        if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) return false
        if (el.closest('[aria-hidden="true"]')) return false
        const rr = el.getBoundingClientRect()
        return rr.width > 0 && rr.height > 0
      }
      const ownText = (el) => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1)
      const sectionOf = (el) => {
        const s = el.closest('section, footer, header, main')
        return s ? (s.getAttribute('aria-label') || s.id || s.className.toString().slice(0, 40) || s.tagName) : null
      }
      const clipped = [], tiny = [], targets = [], headings = []
      for (const el of document.body.querySelectorAll('*')) {
        if (!ownText(el) || !visible(el)) continue
        const rr = el.getBoundingClientRect()
        const fs = parseFloat(getComputedStyle(el).fontSize)
        const t = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 50)
        if (rr.left < -2 || rr.right > vw + 2) clipped.push({ t, left: Math.round(rr.left), right: Math.round(rr.right), fs, sec: sectionOf(el) })
        if (fs < 11) tiny.push({ t, fs, sec: sectionOf(el) })
      }
      for (const el of document.querySelectorAll('a, button, [role=button]')) {
        if (!visible(el)) continue
        const rr = el.getBoundingClientRect()
        if (rr.width < 44 || rr.height < 44) targets.push({ t: (el.textContent.trim() || el.getAttribute('aria-label') || '').slice(0, 40), w: Math.round(rr.width), h: Math.round(rr.height), sec: sectionOf(el) })
      }
      for (const el of document.querySelectorAll('h1, h2')) {
        if (!visible(el)) continue
        const rr = el.getBoundingClientRect()
        const lh = parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.2
        headings.push({ tag: el.tagName, t: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 50), fs: parseFloat(getComputedStyle(el).fontSize), lines: Math.round(rr.height / lh), left: Math.round(rr.left) })
      }
      // Group tiny text by section so the report stays readable.
      const tinyBySec = {}
      for (const x of tiny) { tinyBySec[x.sec] = tinyBySec[x.sec] || { count: 0, min: 99, sample: x.t }; tinyBySec[x.sec].count++; tinyBySec[x.sec].min = Math.min(tinyBySec[x.sec].min, x.fs) }
      return { clipped: clipped.slice(0, 40), tinyBySec, targets: targets.slice(0, 60), headings, pageHeight: document.documentElement.scrollHeight }
    })
    out.push({ page: name, width, ...r })
    console.log(`${name} ${width}: clipped=${r.clipped.length} tinySections=${Object.keys(r.tinyBySec).length} smallTargets=${r.targets.length} height=${r.pageHeight}`)
    await ctx.close()
  }
}
fs.writeFileSync(path.join(outDir, `clip${ONLY ? '-' + ONLY.join('_') : ''}.json`), JSON.stringify(out, null, 2))
await browser.close()
