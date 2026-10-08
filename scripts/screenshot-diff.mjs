// Pixel-diff two screenshot sets: node scripts/screenshot-diff.mjs <labelA> <labelB> [pattern]
// For each matching PNG present in both, reports height change + % of pixels
// that differ (per-channel delta > 24), and the vertical bands where the
// difference is concentrated. Writes a red diff mask next to labelB's file.
// Animated content (video, marquee, count-ups) always produces some noise —
// read the bands, not just the total.
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const [A, B, pattern = '-(1280|1440)\\.png$'] = process.argv.slice(2)
const dirA = path.join('responsive-screenshots', A), dirB = path.join('responsive-screenshots', B)
const files = fs.readdirSync(dirA).filter(f => new RegExp(pattern).test(f) && fs.existsSync(path.join(dirB, f)))

const browser = await chromium.launch()
const page = await browser.newPage()
for (const f of files) {
  const a = fs.readFileSync(path.join(dirA, f)).toString('base64')
  const b = fs.readFileSync(path.join(dirB, f)).toString('base64')
  const r = await page.evaluate(async ([a, b]) => {
    const load = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + src })
    const [ia, ib] = await Promise.all([load(a), load(b)])
    const w = Math.min(ia.width, ib.width), h = Math.min(ia.height, ib.height)
    const ctx = (img) => { const c = new OffscreenCanvas(w, h); const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, w, h).data }
    const da = ctx(ia), db = ctx(ib)
    const mask = new OffscreenCanvas(w, h), mx = mask.getContext('2d'), out = mx.createImageData(w, h)
    let diff = 0; const BAND = 200; const bands = new Array(Math.ceil(h / BAND)).fill(0)
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]))
      if (d > 24) { diff++; bands[Math.floor(y / BAND)]++; out.data[i] = 255; out.data[i + 3] = 255 }
      else { out.data[i] = out.data[i + 1] = out.data[i + 2] = db[i] * 0.25; out.data[i + 3] = 255 }
    }
    mx.putImageData(out, 0, 0)
    const blob = await mask.convertToBlob({ type: 'image/png' })
    const buf = new Uint8Array(await blob.arrayBuffer()); let s = ''; for (const c of buf) s += String.fromCharCode(c)
    const hot = bands.map((n, i) => ({ y: i * BAND, pct: n / (w * BAND) * 100 })).filter(x => x.pct > 1).map(x => `${x.y}px:${x.pct.toFixed(1)}%`)
    return { hA: ia.height, hB: ib.height, pct: diff / (w * h) * 100, hot, mask: btoa(s) }
  }, [a, b])
  fs.writeFileSync(path.join(dirB, f.replace('.png', '.diff.png')), Buffer.from(r.mask, 'base64'))
  console.log(`${f.padEnd(22)} height ${r.hA}→${r.hB}${r.hA === r.hB ? ' (same)' : ' (CHANGED)'}  diff ${r.pct.toFixed(2)}%  ${r.hot.length ? 'bands>1%: ' + r.hot.join(' ') : 'no band >1%'}`)
}
await browser.close()
