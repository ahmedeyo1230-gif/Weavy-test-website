import fs from 'fs'
import puppeteer from 'puppeteer'

async function findRunningPort(ports) {
  for (const port of ports) {
    try {
      const browser = await puppeteer.launch({ headless: true })
      const page = await browser.newPage()
      const url = `http://localhost:${port}/`
      const res = await page.goto(url, { timeout: 5000, waitUntil: 'domcontentloaded' }).catch(() => null)
      if (res && res.status && res.status() < 400) {
        await browser.close()
        return port
      }
      await browser.close()
    } catch (e) {
      // continue
    }
  }
  return null
}

async function screenshotAt(url, selector, path, viewport) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport(viewport)
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 })

  // wait for heading text to appear
  try {
    await page.waitForFunction((txt) => {
      return !![...document.querySelectorAll('h1,h2,h3')].find(n => n.innerText && n.innerText.includes(txt))
    }, { timeout: 7000 }, 'Creators chosen by')
  } catch (e) {
    // continue even if not found
  }

  // find the element that contains the heading text
  const handle = await page.evaluateHandle(() => {
    const nodes = [...document.querySelectorAll('h1,h2,h3')]
    const el = nodes.find(n => n.innerText && n.innerText.includes('Creators chosen by'))
    if (el) return el
    // fallback to body
    return document.body
  })

  const box = await handle.asElement().boundingBox()
  if (box) {
    // take a screenshot of a region around the element and below (heading + content)
    const clip = {
      x: Math.max(0, box.x - 16),
      y: Math.max(0, box.y - 16),
      width: Math.min(viewport.width, box.width + 32),
      height: Math.min(viewport.height, viewport.height - box.y + 16)
    }
    await page.screenshot({ path, clip })
  } else {
    await page.screenshot({ path, fullPage: true })
  }

  await browser.close()
}

;(async () => {
  const portsToTry = [5173, 5174, 5175]
  const port = await findRunningPort(portsToTry)
  if (!port) {
    console.error('No running dev server found on', portsToTry)
    process.exit(1)
  }
  const base = `http://localhost:${port}`
  console.log('Using', base)

  const outDir = './screenshots'
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

  try {
    await screenshotAt(base, null, `${outDir}/ugc-mobile.png`, { width: 390, height: 844 })
    console.log('Saved', `${outDir}/ugc-mobile.png`)
  } catch (e) {
    console.error('Mobile screenshot failed:', e.message)
  }

  try {
    await screenshotAt(base, null, `${outDir}/ugc-tablet.png`, { width: 768, height: 1024 })
    console.log('Saved', `${outDir}/ugc-tablet.png`)
  } catch (e) {
    console.error('Tablet screenshot failed:', e.message)
  }

  process.exit(0)
})().catch(e => { console.error(e); process.exit(1) })
