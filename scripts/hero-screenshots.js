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

async function screenshotHero(url, selector, path, viewport) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport(viewport)
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 })

  // wait for the hero container
  try {
    await page.waitForSelector(selector, { timeout: 8000 })
  } catch (e) {
    console.error('Selector not found:', selector)
  }

  const el = await page.$(selector)
  if (!el) {
    console.error('Hero element not found, taking full-page screenshot instead')
    await page.screenshot({ path, fullPage: true })
    await browser.close()
    return
  }

  const box = await el.boundingBox()
  if (box) {
    // expand a bit vertically to include spacing
    const padding = Math.min(60, Math.round(viewport.height * 0.06))
    const clip = {
      x: Math.max(0, box.x - 8),
      y: Math.max(0, box.y - padding),
      width: Math.min(viewport.width, box.width + 16),
      height: Math.min(viewport.height, box.height + padding * 1.2)
    }
    await page.screenshot({ path, clip })
  } else {
    await page.screenshot({ path, fullPage: true })
  }

  await browser.close()
}

;(async () => {
  const portsToTry = [5173, 5174, 5175, 5176]
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
    await screenshotHero(base, '#graphic-design-hero', `${outDir}/graphic-mobile.png`, { width: 390, height: 844 })
    console.log('Saved', `${outDir}/graphic-mobile.png`)
  } catch (e) {
    console.error('Mobile screenshot failed:', e.message)
  }

  try {
    await screenshotHero(base, '#graphic-design-hero', `${outDir}/graphic-tablet.png`, { width: 768, height: 1024 })
    console.log('Saved', `${outDir}/graphic-tablet.png`)
  } catch (e) {
    console.error('Tablet screenshot failed:', e.message)
  }

  process.exit(0)
})().catch(e => { console.error(e); process.exit(1) })
