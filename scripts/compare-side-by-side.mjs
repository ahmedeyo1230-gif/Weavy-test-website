// Side-by-side before/after image:
//   node scripts/compare-side-by-side.mjs <labelA> <labelB> <file.png> [y] [h] [out-name]
// Crops both screenshots to [y, y+h) (default: whole image) and writes
// responsive-screenshots/compare/<out-name>.png with captions.
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const [A, B, file, y = '0', h = '0', outName] = process.argv.slice(2)
const img = l => 'data:image/png;base64,' + fs.readFileSync(path.join('responsive-screenshots', l, file)).toString('base64')
const outDir = path.join('responsive-screenshots', 'compare')
fs.mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent(`<html><body style="margin:0;background:#1a1a1a;font:600 14px system-ui;color:#eee">
  <div id="w" style="display:flex;gap:16px;padding:12px;align-items:flex-start"></div></body></html>`)
const dims = await page.evaluate(async ([a, b, y, h, A, B]) => {
  const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s })
  const [ia, ib] = await Promise.all([load(a), load(b)])
  const H = h > 0 ? h : Math.max(ia.height, ib.height) - y
  for (const [im, label] of [[ia, A], [ib, B]]) {
    const col = document.createElement('div')
    col.innerHTML = `<div style="padding:4px 0 8px">${label}</div>`
    const box = document.createElement('div')
    box.style.cssText = `width:${im.width}px;height:${Math.min(H, im.height - y)}px;overflow:hidden;outline:1px solid #444`
    im.style.cssText = `display:block;margin-top:${-y}px`
    box.appendChild(im); col.appendChild(box); document.getElementById('w').appendChild(col)
  }
  const r = document.getElementById('w').getBoundingClientRect()
  return { w: Math.ceil(r.width), h: Math.ceil(r.height) }
}, [img(A), img(B), +y, +h, A, B])
await page.setViewportSize({ width: dims.w, height: Math.min(dims.h, 16000) })
const out = path.join(outDir, `${outName ?? file.replace('.png', '')}.png`)
await page.screenshot({ path: out, fullPage: true })
console.log(out)
await browser.close()
