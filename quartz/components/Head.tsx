import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"
export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    // Url of current page
    const socialUrl =
      fileData.slug === "404" ? url.toString() : joinSegments(url.toString(), fileData.slug!)

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={description} />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta
              property="og:image:type"
              content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`}
            />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
          </>
        )}

        <link rel="icon" href={iconPath} />
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
        <script dangerouslySetInnerHTML={{__html: `
const LUNAR_CYCLE = 29.530588853;
const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z').getTime();
function getLunarPhase() {
  const elapsed = (Date.now() - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
  return (elapsed % LUNAR_CYCLE) / LUNAR_CYCLE;
}
function getMoonSigil(phase) {
  const silver = 'rgba(220,215,255,0.95)';
  const glow = 'drop-shadow(0 0 3px rgba(200,200,255,0.9)) drop-shadow(0 0 8px rgba(180,180,255,0.4))';
  
  const sigils = {
    new: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="10" stroke="rgba(220,215,255,0.4)" stroke-width="1"/>
      <line x1="14" y1="4" x2="14" y2="24" stroke="rgba(220,215,255,0.3)" stroke-width="0.5"/>
      <line x1="4" y1="14" x2="24" y2="14" stroke="rgba(220,215,255,0.3)" stroke-width="0.5"/>
      <circle cx="14" cy="14" r="2" fill="rgba(220,215,255,0.2)"/>
    </svg>`,
    
    waxingCrescent: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4 C8 4 4 8.5 4 14 C4 19.5 8 24 14 24 C10 20 10 8 14 4Z" fill="${silver}" opacity="0.9"/>
      <line x1="14" y1="2" x2="14" y2="6" stroke="${silver}" stroke-width="1"/>
      <line x1="14" y1="22" x2="14" y2="26" stroke="${silver}" stroke-width="1"/>
      <line x1="4" y1="10" x2="7" y2="11.5" stroke="${silver}" stroke-width="0.8"/>
      <line x1="4" y1="18" x2="7" y2="16.5" stroke="${silver}" stroke-width="0.8"/>
    </svg>`,
    
    firstQuarter: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4 A10 10 0 0 1 14 24 Z" fill="${silver}" opacity="0.9"/>
      <line x1="14" y1="2" x2="14" y2="26" stroke="${silver}" stroke-width="1"/>
      <line x1="9" y1="5" x2="6" y2="3" stroke="${silver}" stroke-width="0.8"/>
      <line x1="9" y1="23" x2="6" y2="25" stroke="${silver}" stroke-width="0.8"/>
      <circle cx="14" cy="14" r="2" fill="none" stroke="${silver}" stroke-width="0.8"/>
    </svg>`,
    
    waxingGibbous: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4 A10 10 0 1 1 14 24 C18 20 20 8 14 4Z" fill="${silver}" opacity="0.9"/>
      <line x1="14" y1="2" x2="14" y2="6" stroke="${silver}" stroke-width="1"/>
      <line x1="14" y1="22" x2="14" y2="26" stroke="${silver}" stroke-width="1"/>
      <line x1="24" y1="10" x2="21" y2="11.5" stroke="${silver}" stroke-width="0.8"/>
      <line x1="24" y1="18" x2="21" y2="16.5" stroke="${silver}" stroke-width="0.8"/>
      <line x1="20" y1="5" x2="18" y2="7" stroke="${silver}" stroke-width="0.8"/>
    </svg>`,
    
    full: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="10" fill="${silver}" opacity="0.9"/>
      <line x1="14" y1="1" x2="14" y2="5" stroke="${silver}" stroke-width="1"/>
      <line x1="14" y1="23" x2="14" y2="27" stroke="${silver}" stroke-width="1"/>
      <line x1="1" y1="14" x2="5" y2="14" stroke="${silver}" stroke-width="1"/>
      <line x1="23" y1="14" x2="27" y2="14" stroke="${silver}" stroke-width="1"/>
      <line x1="4" y1="4" x2="7" y2="7" stroke="${silver}" stroke-width="0.8"/>
      <line x1="24" y1="4" x2="21" y2="7" stroke="${silver}" stroke-width="0.8"/>
      <line x1="4" y1="24" x2="7" y2="21" stroke="${silver}" stroke-width="0.8"/>
      <line x1="24" y1="24" x2="21" y2="21" stroke="${silver}" stroke-width="0.8"/>
      <circle cx="14" cy="14" r="5" fill="none" stroke="rgba(220,215,255,0.3)" stroke-width="0.8"/>
    </svg>`,
    
    waningGibbous: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4 A10 10 0 1 0 14 24 C10 20 8 8 14 4Z" fill="${silver}" opacity="0.9"/>
      <line x1="14" y1="2" x2="14" y2="6" stroke="${silver}" stroke-width="1"/>
      <line x1="14" y1="22" x2="14" y2="26" stroke="${silver}" stroke-width="1"/>
      <line x1="4" y1="10" x2="7" y2="11.5" stroke="${silver}" stroke-width="0.8"/>
      <line x1="4" y1="18" x2="7" y2="16.5" stroke="${silver}" stroke-width="0.8"/>
      <line x1="8" y1="5" x2="10" y2="7" stroke="${silver}" stroke-width="0.8"/>
    </svg>`,
    
    lastQuarter: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4 A10 10 0 0 0 14 24 Z" fill="${silver}" opacity="0.9"/>
      <line x1="14" y1="2" x2="14" y2="26" stroke="${silver}" stroke-width="1"/>
      <line x1="19" y1="5" x2="22" y2="3" stroke="${silver}" stroke-width="0.8"/>
      <line x1="19" y1="23" x2="22" y2="25" stroke="${silver}" stroke-width="0.8"/>
      <circle cx="14" cy="14" r="2" fill="none" stroke="${silver}" stroke-width="0.8"/>
    </svg>`,
    
    waningCrescent: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4 C18 8 18 20 14 24 C20 24 24 19.5 24 14 C24 8.5 20 4 14 4Z" fill="${silver}" opacity="0.9"/>
      <line x1="14" y1="2" x2="14" y2="6" stroke="${silver}" stroke-width="1"/>
      <line x1="14" y1="22" x2="14" y2="26" stroke="${silver}" stroke-width="1"/>
      <line x1="24" y1="10" x2="21" y2="11.5" stroke="${silver}" stroke-width="0.8"/>
      <line x1="24" y1="18" x2="21" y2="16.5" stroke="${silver}" stroke-width="0.8"/>
    </svg>`
  };

  if (phase < 0.0625) return sigils.new;
  if (phase < 0.1875) return sigils.waxingCrescent;
  if (phase < 0.3125) return sigils.firstQuarter;
  if (phase < 0.4375) return sigils.waxingGibbous;
  if (phase < 0.5625) return sigils.full;
  if (phase < 0.6875) return sigils.waningGibbous;
  if (phase < 0.8125) return sigils.lastQuarter;
  return sigils.waningCrescent;
}
document.addEventListener('DOMContentLoaded', function() {
  const moon = document.createElement('div');
  moon.style.cssText = 'position:fixed;pointer-events:none;z-index:99999;font-size:18px;transform:translate(-50%,-50%);filter:drop-shadow(0 0 4px rgba(220,220,255,0.8));';
  moon.textContent = getMoonEmoji(getLunarPhase());
  document.body.appendChild(moon);
  const particles = [];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.style.cssText = 'position:fixed;pointer-events:none;z-index:99998;width:3px;height:3px;border-radius:50%;background:rgba(210,210,255,0.9);box-shadow:0 0 4px rgba(200,200,255,0.8);transform:translate(-50%,-50%);';
    document.body.appendChild(p);
    particles.push(p);
  }
  let trailPoints = [];
  document.addEventListener('mousemove', function(e) {
    moon.style.left = e.clientX + 'px';
    moon.style.top = e.clientY + 'px';
    trailPoints.unshift({x: e.clientX, y: e.clientY, life: 1.0});
    if (trailPoints.length > 12) trailPoints.pop();
  });
  function animate() {
    trailPoints = trailPoints.map(p => ({...p, life: p.life - 0.06})).filter(p => p.life > 0);
    particles.forEach(function(p, i) {
      const point = trailPoints[i];
      if (point) {
        p.style.left = (point.x + (Math.random()-0.5)*6) + 'px';
        p.style.top = (point.y + (Math.random()-0.5)*6) + 'px';
        p.style.opacity = point.life * 0.8;
      } else {
        p.style.opacity = 0;
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
});
`}} />
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
