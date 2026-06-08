# PageSpeed Insights (PSI) — Performance Guide

> A reusable reference for running PSI audits, diagnosing issues, and tracking score improvements across any website project.

---

## Setup — Fill In Per Project

Before running any script, set these three variables. Everything else is the same for every project.

```powershell
$url  = "https://your-site.com/"           # Target URL (trailing slash recommended)
$key  = "YOUR_GOOGLE_API_KEY"              # PageSpeed Insights API key
$base = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
```

### How to Get an API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or use an existing one)
3. Enable **PageSpeed Insights API**
4. Go to **APIs & Services → Credentials → Create Credentials → API Key**
5. Restrict it to **PageSpeed Insights API** for security

### Aptus Project Credentials
| Field | Value |
|---|---|
| **API Key** | `AIzaSyCVyI7wT3gDDMR3eFtw3ep6aDnmNEAxoXQ` |
| **Target URL** | `https://boilerinstallation.aptuscontrol.co.uk/` |

### AULD Heating Project Credentials
| Field | Value |
|---|---|
| **API Key** | `AIzaSyCVyI7wT3gDDMR3eFtw3ep6aDnmNEAxoXQ` |
| **Target URL** | `https://auldheating.com/` |

---

## Scripts

### 1. Quick Score Check (Desktop + Mobile)

```powershell
$url  = "https://your-site.com/"
$key  = "YOUR_API_KEY"
$base = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"

Write-Host "Fetching DESKTOP..." -ForegroundColor Cyan
$d = Invoke-RestMethod "$base`?url=$([uri]::EscapeDataString($url))&strategy=desktop&category=performance&key=$key"
Write-Host "Desktop: $($d.lighthouseResult.categories.performance.score * 100)" -ForegroundColor Green

Write-Host "Fetching MOBILE..." -ForegroundColor Cyan
$m = Invoke-RestMethod "$base`?url=$([uri]::EscapeDataString($url))&strategy=mobile&category=performance&key=$key"
Write-Host "Mobile: $($m.lighthouseResult.categories.performance.score * 100)" -ForegroundColor Green
```

---

### 2. Full Diagnostic Report (Score + Core Web Vitals + Issues)

```powershell
$url  = "https://your-site.com/"
$key  = "YOUR_API_KEY"
$base = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"

$d = Invoke-RestMethod "$base`?url=$([uri]::EscapeDataString($url))&strategy=desktop&category=performance&key=$key"
$m = Invoke-RestMethod "$base`?url=$([uri]::EscapeDataString($url))&strategy=mobile&category=performance&key=$key"

$metrics = @('first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index','interactive')

Write-Host "`nDesktop Score: $($d.lighthouseResult.categories.performance.score * 100)" -ForegroundColor Green
Write-Host "Mobile Score:  $($m.lighthouseResult.categories.performance.score * 100)" -ForegroundColor Green

Write-Host "`n--- Desktop Core Web Vitals ---"
foreach ($k in $metrics) { $a=$d.lighthouseResult.audits.$k; if($a){ Write-Host "  $($a.id): $($a.displayValue) [score:$($a.score)]" } }

Write-Host "`n--- Mobile Core Web Vitals ---"
foreach ($k in $metrics) { $a=$m.lighthouseResult.audits.$k; if($a){ Write-Host "  $($a.id): $($a.displayValue) [score:$($a.score)]" } }

Write-Host "`n--- Desktop Diagnostics (failing audits) ---"
$d.lighthouseResult.audits.PSObject.Properties | Where-Object {
    $_.Value.score -ne $null -and $_.Value.score -lt 0.9 -and $_.Value.details.type -in @('table','opportunity')
} | ForEach-Object { $a=$_.Value; Write-Host "  [$([math]::Round($a.score,2))] $($a.id): $($a.displayValue)" }

Write-Host "`n--- Mobile Diagnostics (failing audits) ---"
$m.lighthouseResult.audits.PSObject.Properties | Where-Object {
    $_.Value.score -ne $null -and $_.Value.score -lt 0.9 -and $_.Value.details.type -in @('table','opportunity')
} | ForEach-Object { $a=$_.Value; Write-Host "  [$([math]::Round($a.score,2))] $($a.id): $($a.displayValue)" }
```

---

### 3. Save Full JSON Results to File

Useful for diffing results between runs, or sharing with a team.

```powershell
$url  = "https://your-site.com/"
$key  = "YOUR_API_KEY"
$base = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"

$d = Invoke-RestMethod "$base`?url=$([uri]::EscapeDataString($url))&strategy=desktop&category=performance&key=$key"
$d | ConvertTo-Json -Depth 30 | Set-Content "psi_d.json" -Encoding UTF8

$m = Invoke-RestMethod "$base`?url=$([uri]::EscapeDataString($url))&strategy=mobile&category=performance&key=$key"
$m | ConvertTo-Json -Depth 30 | Set-Content "psi_m.json" -Encoding UTF8

Write-Host "Desktop: $($d.lighthouseResult.categories.performance.score * 100)"
Write-Host "Mobile:  $($m.lighthouseResult.categories.performance.score * 100)"
Write-Host "Saved to psi_d.json and psi_m.json"
```

---

### 4. Deep-Dive: Specific Audits

Run these after Script 2 — `$d` and `$m` must already be set.

```powershell
# Bootup time per script (sorted by slowest — identifies heavy third-party scripts)
Write-Host "`n--- Bootup time per script ---"
$d.lighthouseResult.audits.'bootup-time'.details.items |
  Sort-Object -Descending total |
  ForEach-Object { Write-Host "  $([math]::Round($_.total))ms  $($_.url)" }

# Unused JS (sorted by most wasted bytes)
Write-Host "`n--- Unused JavaScript ---"
$d.lighthouseResult.audits.'unused-javascript'.details.items |
  Sort-Object -Descending wastedBytes |
  ForEach-Object { Write-Host "  $([math]::Round($_.wastedBytes/1024))KB wasted  $($_.url)" }

# Cache issues (assets with no or short cache lifetime)
Write-Host "`n--- Cache insight ---"
$d.lighthouseResult.audits.'cache-insight'.details.items |
  Sort-Object -Descending wastedBytes |
  ForEach-Object { Write-Host "  $([math]::Round($_.wastedBytes/1024))KB  ttl:$($_.cacheHitProbability)  $($_.url)" }

# Image delivery savings (oversized or wrong format images)
Write-Host "`n--- Image delivery ---"
$d.lighthouseResult.audits.'image-delivery-insight'.details.items |
  Sort-Object -Descending wastedBytes |
  ForEach-Object { Write-Host "  total:$([math]::Round($_.totalBytes/1024))KB  wasted:$([math]::Round($_.wastedBytes/1024))KB  $($_.url)" }

# Main thread work breakdown
Write-Host "`n--- Main thread breakdown ---"
$d.lighthouseResult.audits.'mainthread-work-breakdown'.details.items |
  Sort-Object -Descending duration |
  ForEach-Object { Write-Host "  $([math]::Round($_.duration))ms  $($_.groupLabel)" }
```

---

## Core Web Vitals — Scoring Thresholds

| Metric | Good 🟢 | Needs Work 🟠 | Poor 🔴 |
|---|---|---|---|
| **FCP** (First Contentful Paint) | < 1.8s | 1.8–3s | > 3s |
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5–4s | > 4s |
| **TBT** (Total Blocking Time) | < 200ms | 200–600ms | > 600ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1–0.25 | > 0.25 |
| **Speed Index** | < 3.4s | 3.4–5.8s | > 5.8s |
| **TTI** (Time to Interactive) | < 3.8s | 3.8–7.3s | > 7.3s |

### Overall Score

| Score | Colour | Status |
|---|---|---|
| 90–100 | 🟢 Green | Good |
| 50–89 | 🟠 Orange | Needs improvement |
| 0–49 | 🔴 Red | Poor |

---

## Common Issues & Fixes

### Third-Party Scripts Blocking TBT
**Symptoms:** `bootup-time` > 1s, `total-blocking-time` > 400ms, `interactive` > 5s  
**Cause:** GTM, Google Analytics, Facebook Pixel, reCAPTCHA, chat widgets loading eagerly at page `load`  
**Fix:** Defer to first user interaction (scroll/click/touchstart):
```js
var _loaded = false;
function loadScripts() {
    if (_loaded) return; _loaded = true;
    // inject GTM, analytics, etc. here
}
['scroll','touchstart','click','keydown'].forEach(function(e) {
    window.addEventListener(e, loadScripts, { once: true, passive: true });
});
// Hard fallback — fires 5s after load for passive visitors
window.addEventListener('load', function() { setTimeout(loadScripts, 5000); }, { once: true });
```

---

### Images Oversized / Wrong Format
**Symptoms:** `image-delivery-insight` shows large wasted KB  
**Diagnosis:** Check actual display size vs source dimensions  
**Fix checklist:**
- Convert PNG/JPG to WebP or AVIF (`sharp` in Node.js)
- Resize to 2× the displayed CSS size (e.g. displayed at 300px → source at 600px max)
- Use `loading="lazy"` on all below-fold images
- Use `fetchpriority="high"` on the LCP image only

```js
// Resize + convert with sharp (Node.js)
const sharp = require('sharp');
await sharp('input.jpg')
  .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 75 })
  .toBuffer()
  .then(buf => require('fs').writeFileSync('output.webp', buf));
```

---

### Cache Headers Not Working
**Symptoms:** `cache-insight` shows all own assets as uncached, `cacheHitProbability` = 0  
**Causes & Fixes:**

| Cause | Fix |
|---|---|
| Apache `mod_expires`/`mod_headers` in same `<IfModule>` block | Split into two separate `<IfModule>` blocks |
| Cloudflare overriding origin headers (default 4h TTL) | Cloudflare Dashboard → Rules → Page Rules → `*your-domain.com/*` → Browser Cache TTL: **Respect Existing Headers** |
| Nginx missing `expires` directive | Add `expires 1y; add_header Cache-Control "public, immutable";` for hashed assets |

---

### Cumulative Layout Shift (CLS)
**Symptoms:** `cumulative-layout-shift` > 0.1  
**Common causes:**
- Embedded iframes (GHL, Typeform, etc.) with no reserved height — script injects wrapper divs post-load
- Images without `width`/`height` attributes
- Fonts loading and reflowing text

**Fix:**
```css
/* Reserve space for any dynamically-injected iframe embed */
.iframe-wrapper {
  min-height: 700px; /* match the embed's expected height */
  display: block;
}

/* Always set explicit dimensions on images */
img { width: 100%; height: auto; aspect-ratio: 16/9; }
```

---

### Unused CSS
**Symptoms:** `unused-css-rules` > 20KB  
**Fix:** Use PurgeCSS (works with Tailwind, Vue, React):
```js
// vite.config.ts — add vite-plugin-purgecss
import purgecss from 'vite-plugin-purgecss';
export default { plugins: [purgecss({ content: ['./resources/**/*.{tsx,ts,blade.php}'] })] };
```

---

### Code Splitting (Large JS Bundle)
**Symptoms:** `unused-javascript` > 200KB on first load, slow TTI  
**Fix (React without SSR):** Use `React.lazy` for below-fold components:
```tsx
import { lazy, Suspense } from 'react';
const HeavySection = lazy(() => import('./HeavySection'));

// In JSX:
<Suspense fallback={null}>
  <HeavySection />
</Suspense>
```

> ⚠️ **Inertia.js + Vite projects with `ssr.tsx`:** Even if SSR is disabled at runtime (`INERTIA_SSR_ENABLED=false`), Vite still compiles the SSR bundle. `React.lazy` / dynamic `import()` is incompatible with the SSR bundle build step and will cause a 500. Use **static imports only** in these projects. If you need code splitting without SSR, use Vite's manual `build.rollupOptions.output.manualChunks` instead.

---

## Score History — AULD Heating

| Round | Date | Desktop | Mobile | Key Changes |
|---|---|---|---|---|
| Baseline | May 9, 2026 | 37 | 13 | No optimisations. TBT 2,020ms (D) / 3,880ms (M). CLS 0.451 (M). LCP 9.4s (M). |
| Round 1 | May 9, 2026 | 61 | 51 | GTM + GHL deferred to first interaction. `min-height: 700px` on iframeWrap. React.lazy on 10 below-fold sections. |
| Round 2 | May 9, 2026 | 83 | 42 | Fixed React.lazy 500 (reverted to static imports — SSR bundle build incompatibility). CLS still high on mobile due to font-swap + iframe push. |
| Round 3 | May 10, 2026 | 99 | 73 | Gallery images compressed (~1.2 MB saved). PNG → WebP (Vaillant boiler: 75KB → 5KB). All images given `width`/`height` attributes. `fetchpriority="high"` on header logo. `font-display: optional` to suppress font-swap CLS. |
| Round 4 | May 10, 2026 | 96 | 86 | Self-hosted fonts via `@fontsource/poppins` + `@fontsource/roboto`. Eliminated Google Fonts DNS lookup (−900ms LCP). Font preloads added to Blade `<head>`. CSS preload from Vite manifest. GHL iframe `src` set to `about:blank` until first user interaction (eliminated reCAPTCHA Enterprise boot: −3,941ms TBT). |
| Round 5 | May 10, 2026 | 98 | 88 | `font-display: swap` on self-hosted fonts (replaced `optional`). Removed right iframe column from Hero entirely — GHL form moved to full-screen `FormModal`. Modal only mounts iframe on open. CLS → 0. |
| Round 6 | May 11, 2026 | **100** | **94** | All Core Web Vitals green. TBT 0ms. CLS 0. LCP < 1.2s desktop / < 2.1s mobile. |

---

## Optimisation Log — AULD Heating

### Round 1 — May 9, 2026

| # | Fix | File | Impact |
|---|---|---|---|
| 1 | Defer GTM + GHL `form_embed.js` to first user interaction (scroll/click/keydown) | `resources/views/app.blade.php` | TBT: 2,020ms → ~600ms. GTM and reCAPTCHA no longer block main thread at load. |
| 2 | `min-height: 700px` on `.iframeWrap` / `contain: layout size` | `HeroSection.module.css` | Partially reduced CLS — reserved space before GHL iframe injects wrapper divs. |
| 3 | `React.lazy` on 10 below-fold sections | `Welcome.tsx` | Reduced initial JS bundle. **Later reverted** — caused a 500 error. SSR is disabled (`INERTIA_SSR_ENABLED=false`) but Vite still builds the SSR bundle; `React.lazy` dynamic imports are incompatible with that build step. |

### Round 2 — May 9, 2026

| # | Fix | File | Impact |
|---|---|---|---|
| 4 | Reverted all `React.lazy` usage | `Welcome.tsx` | Fixed 500 crash. SSR is disabled in `.env` but the SSR bundle is still built by Vite — `React.lazy` breaks that build step. Static imports only. |
| 5 | `font-display: optional` on Google Fonts URL | `app.blade.php` | Eliminated font-swap CLS on desktop; mobile CLS still present from iframe column. |

### Round 3 — May 10, 2026

| # | Fix | File | Impact |
|---|---|---|---|
| 6 | Compress gallery WebP images | `public/images/gallery/` | ~1.2 MB total savings across all gallery images. |
| 7 | Convert Vaillant boiler PNG → WebP | `public/images/` | 75 KB → 5 KB (−93%) |
| 8 | Add `width` + `height` attributes to all unsized images | Various `.tsx` components | Eliminated image-layout-shift CLS. Header logo, footer logo, hero boiler, Google logo, gallery, product images all fixed. |
| 9 | `fetchpriority="high"` on header logo | `LandingPageHeader.tsx` | LCP image starts downloading immediately; not deprioritised behind other resources. |

### Round 4 — May 10, 2026

| # | Fix | File | Impact |
|---|---|---|---|
| 10 | Install `@fontsource/poppins` + `@fontsource/roboto` | `package.json` / `app.css` | Removed Google Fonts CDN dependency. Eliminated 2 external DNS lookups. Fonts served from same origin. −900ms LCP on mobile. |
| 11 | Add font `<link rel="preload">` hints for critical woff2 files | `app.blade.php` | Browser fetches fonts before CSS is parsed. Zero FOUT on above-fold text. |
| 12 | Configure Vite `assetFileNames` for predictable font output paths | `vite.config.ts` | Fonts output to `public/build/assets/fonts/[name][extname]` — stable URLs for preload hints. |
| 13 | Add CSS `<link rel="preload">` from Vite manifest | `app.blade.php` | Stylesheet starts downloading in parallel with HTML parse. |
| 14 | GHL iframe `src` set to `about:blank` until interaction | `app.blade.php` | reCAPTCHA Enterprise inside GHL iframe no longer boots at page load. Eliminated 3,941ms of TBT on mobile. |

### Round 5 — May 10–11, 2026

| # | Fix | File | Impact |
|---|---|---|---|
| 15 | Remove Hero right column (inline GHL iframe) entirely | `HeroSection.tsx` / `HeroSection.module.css` | Eliminated root cause of mobile CLS (GHL iframe wrapper injection). Hero is now single-column, content-centred. |
| 16 | Implement `FormModal` component | `FormModal.tsx` / `FormModal.module.css` | Full-screen overlay modal. GHL iframe `src` only set when modal opens — zero impact on page load. |
| 17 | Wire all CTA buttons to `openFormModal` custom event | `BoilerOptionsSection.tsx`, `TestimonialsSection.tsx`, `FinalCtaSection.tsx`, `WhyUsDetailedSection.tsx`, `HeroSection.tsx` | All quote buttons across the page open the modal. No page anchors or inline forms. |
| 18 | Render `<FormModal />` once at page root | `Welcome.tsx` | Single modal instance shared across all CTAs. |

---

## What Each Core Web Vital Was and How It Was Fixed — AULD Heating

### TBT (Total Blocking Time) — Baseline: 2,020ms → Final: 0ms
**Root cause:** GTM loaded eagerly at `<head>`, pulling in GA4, Google Ads, FB Pixel, reCAPTCHA Enterprise (via GHL iframe).  
**Fix sequence:**
1. GTM script deferred to first user interaction → most scripts no longer boot at load
2. GHL iframe `src` set to `about:blank` → reCAPTCHA Enterprise (the last remaining 3,941ms offender) eliminated
3. FormModal pattern → iframe only exists in the DOM when the user explicitly opens it

### CLS (Cumulative Layout Shift) — Baseline: 0.451 → Final: 0
**Root cause:** GHL `form_embed.js` injected multiple wrapper divs into the Hero right column after load, pushing all content down. Google Fonts async load caused text reflow.  
**Fix sequence:**
1. `min-height: 700px` on iframeWrap — partially contained the shift
2. Self-hosted fonts with `display=optional` — eliminated font reflow CLS
3. `width`/`height` on all images — eliminated image CLS
4. Removed right column entirely — GHL wrapper injection can no longer affect layout
5. FormModal — iframe never exists in document flow at all

### LCP (Largest Contentful Paint) — Baseline: 9.4s (mobile) → Final: ~2.1s
**Root cause:** Google Fonts CDN blocked rendering (2 external DNS lookups). No preload on logo. TBT blocking the main thread delayed everything.  
**Fix sequence:**
1. Self-hosted `@fontsource` fonts — fonts served from same origin, no DNS lookup
2. Font preloads in `<head>` — browser fetches fonts before CSS is parsed
3. `fetchpriority="high"` on header logo — LCP element starts downloading immediately
4. TBT reduction — freed main thread for rendering

### FCP (First Contentful Paint) — Baseline: ~4.2s → Final: ~0.8s
Improved as a side effect of TBT, font, and CSS preload fixes.

---

---

## Detailed Implementation Guide — AULD Heating

Everything below documents exactly what was changed, which file, and the precise code that was written or modified during each optimisation round.

---

### Round 1 — GTM + GHL Deferred Loading

**File:** `resources/views/app.blade.php`

The original `<head>` contained an inline GTM `<script>` tag that fired synchronously at page load, pulling in Google Analytics, Google Ads, Facebook Pixel, and reCAPTCHA Enterprise immediately. This was replaced with a deferred loader that waits for the first user interaction before injecting any third-party scripts.

**Before:**
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-TX6NV42H');</script>
```

**After (placed just before `@inertia` at the bottom of `<body>`):**
```html
<!-- Deferred third-party loader: GTM + GHL form_embed load on first interaction -->
<script>
(function () {
    var _loaded = false;
    function loadThirdParty() {
        if (_loaded) return;
        _loaded = true;
        // GTM
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TX6NV42H');
        // GHL form embed
        var s = document.createElement('script');
        s.src = 'https://link.msgsndr.com/js/form_embed.js';
        s.async = true;
        document.head.appendChild(s);
    }
    ['scroll', 'touchstart', 'click', 'keydown'].forEach(function (e) {
        window.addEventListener(e, loadThirdParty, { once: true, passive: true });
    });
    // Hard fallback for passive visitors — 5s after load
    window.addEventListener('load', function () {
        setTimeout(loadThirdParty, 5000);
    }, { once: true });
})();
</script>
```

**Why it works:** The `_loaded` guard prevents double-execution. Four interaction event listeners each use `{ once: true }` so they self-remove after first fire. The 5-second `setTimeout` fallback ensures GTM eventually fires for users who never scroll or click (e.g. they landed and immediately closed the tab) — preventing data loss. The `passive: true` flag on scroll/touch listeners avoids blocking scroll performance.

---

### Round 1 — `min-height` CLS Reserve on iframeWrap

**File:** `resources/js/LandingPage/HeroSection.module.css`

GHL's `form_embed.js` was injecting multiple wrapper `<div>` elements into the Hero section after page load, pushing all content below it down the page. This caused a CLS spike. A reserved minimum height was added as a temporary containment measure:

```css
.iframeWrap {
    min-height: 700px;
    contain: layout size;
}
```

This was later made redundant by Round 5 (right column removed entirely), but it provided immediate partial CLS relief.

---

### Round 2 — Reverted React.lazy (SSR Bundle Conflict)

**File:** `resources/js/pages/Welcome.tsx`

Ten below-fold sections had been converted to `React.lazy` + `Suspense` for code splitting:

```tsx
// ❌ This caused a 500 error — do NOT use in this project
const WhyUsDetailedSection = lazy(() => import('../LandingPage/WhyUsDetailedSection'));
const TestimonialsSection   = lazy(() => import('../LandingPage/TestimonialsSection'));
// ...
```

The build failed because `INERTIA_SSR_ENABLED=false` in `.env` does **not** prevent Vite from compiling `resources/js/ssr.tsx`. The SSR bundle build step uses Node.js CommonJS semantics and cannot handle dynamic `import()` expressions produced by `React.lazy`. The fix was to revert all sections to static top-level imports:

```tsx
// ✅ Static imports — compatible with both SSR and non-SSR Vite builds
import WhyUsDetailedSection from '../LandingPage/WhyUsDetailedSection';
import TestimonialsSection   from '../LandingPage/TestimonialsSection';
```

**Key lesson:** In Inertia + Vite projects where `ssr.tsx` exists in the build config (even if disabled at runtime), always use static imports. Use `build.rollupOptions.output.manualChunks` for code splitting instead.

---

### Round 2 — `font-display: optional` on Google Fonts

**File:** `resources/views/app.blade.php`

The Google Fonts `<link>` URL had `&display=swap` appended, which causes a brief invisible text period followed by a layout shift when the font loads. This was changed to `display=optional`, which tells the browser to use the font only if it's available within the first paint:

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=optional" rel="stylesheet">
```

This was a temporary fix. The Google Fonts dependency was fully eliminated in Round 4.

---

### Round 3 — Gallery Image Compression

**Directory:** `public/images/gallery/`

All gallery WebP images were re-compressed using `sharp` in Node.js. The process:

```js
const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const dir = './public/images/gallery';
fs.readdirSync(dir).filter(f => f.endsWith('.webp')).forEach(async file => {
    const src = path.join(dir, file);
    const buf = await sharp(src)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer();
    fs.writeFileSync(src, buf);
    console.log(`${file}: ${fs.statSync(src).size / 1024}KB`);
});
```

Total saving: ~1.2 MB across all gallery images.

---

### Round 3 — Vaillant Boiler PNG → WebP

**File:** `public/images/gas-boiler-vaillant-vmw-23cs-1-5-cf-ecotec-plus-removebg-preview.webp`

The original PNG was 75 KB. Converted using sharp:

```js
await sharp('public/images/gas-boiler-vaillant.png')
    .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile('public/images/gas-boiler-vaillant-vmw-23cs-1-5-cf-ecotec-plus-removebg-preview.webp');
```

Result: 75 KB → 5 KB (−93%).

---

### Round 3 — Explicit `width`/`height` on All Images

**Files:** `LandingPageHeader.tsx`, `HeroSection.tsx`, and all section components.

Images without explicit dimensions cause layout shifts as the browser doesn't know how much space to reserve before the image loads. All `<img>` tags were given matching `width` and `height` attributes:

```tsx
// LandingPageHeader.tsx — logo (also the LCP element)
<img
    src="/images/363351001_121344347693353_7451035572293416588_n-removebg-preview.avif"
    alt={brandName}
    className={styles.logo}
    width="160"
    height="80"
    fetchpriority="high"
/>

// HeroSection.tsx — decorative background boilers
<img src="/images/Logic_System_IE_Front_Facing.webp"
    aria-hidden="true"
    className={`${styles.bgBoiler} ${styles.bgBoiler1}`}
    alt=""
    width="250"
    height="313"
/>
<img src="/images/gas-boiler-vaillant-vmw-23cs-1-5-cf-ecotec-plus-removebg-preview.webp"
    aria-hidden="true"
    className={`${styles.bgBoiler} ${styles.bgBoiler2}`}
    alt=""
    width="300"
    height="300"
/>
<img src="/images/WorcesterBoschGreenstarBoiler.webp"
    aria-hidden="true"
    className={`${styles.bgBoiler} ${styles.bgBoiler3}`}
    alt=""
    width="200"
    height="333"
/>
```

The `width`/`height` attributes allow the browser to compute `aspect-ratio` before the image downloads, reserving the correct space and eliminating image CLS entirely.

---

### Round 3 — `fetchpriority="high"` on Header Logo

**File:** `resources/js/LandingPage/LandingPageHeader.tsx`

The header logo was the Largest Contentful Paint element. Without priority hinting, the browser treats it as a normal resource and deprioritises it behind other fetches. Adding `fetchpriority="high"` signals to the browser to begin downloading it at the same priority as render-blocking resources:

```tsx
<img
    src="/images/363351001_121344347693353_7451035572293416588_n-removebg-preview.avif"
    alt={brandName}
    className={styles.logo}
    width="160"
    height="80"
    fetchpriority="high"   // ← signals browser: download this first
/>
```

Note: `fetchpriority` is a React prop (not the HTML attribute `fetchPriority`) — TypeScript may flag it; cast to `any` or add a declaration if needed.

---

### Round 4 — Self-Hosted Fonts via @fontsource

**Packages installed:**
```bash
npm install @fontsource/poppins @fontsource/roboto
```

**File:** `resources/css/app.css`

The Google Fonts `<link>` tag was removed from `app.blade.php` entirely. Fonts are now imported directly in the CSS bundle, served from the same origin as the application:

```css
/* Self-hosted fonts — eliminates cross-origin Google Fonts DNS/TCP overhead */
/* Poppins: headings — Latin subset only, weights used on landing page */
@import '@fontsource/poppins/latin-400.css';
@import '@fontsource/poppins/latin-500.css';
@import '@fontsource/poppins/latin-600.css';
@import '@fontsource/poppins/latin-700.css';
@import '@fontsource/poppins/latin-800.css';
/* Roboto: body text — Latin subset only */
@import '@fontsource/roboto/latin-400.css';
@import '@fontsource/roboto/latin-500.css';
@import '@fontsource/roboto/latin-700.css';
```

Using the `-latin-` subset variants (e.g. `latin-700.css` instead of `700.css`) reduces the number of font files shipped — only Latin characters are included, saving ~30% per weight compared to the full Unicode set.

**Impact:** Eliminated 2 external DNS lookups + TCP/TLS handshakes to `fonts.googleapis.com` and `fonts.gstatic.com`. This alone removed ~900 ms from mobile LCP.

---

### Round 4 — Font Preload Hints in `<head>`

**File:** `resources/views/app.blade.php`

Even with self-hosted fonts, the browser doesn't discover them until it parses the CSS. Font preload hints make the browser start the download before the CSS is even parsed:

```html
{{-- Preload critical fonts (self-hosted via @fontsource — no Google Fonts DNS overhead) --}}
<link rel="preload" href="/build/assets/fonts/poppins-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/build/assets/fonts/roboto-latin-400-normal.woff2"  as="font" type="font/woff2" crossorigin>
```

Only the two most critical weights are preloaded — `Poppins 700` (hero headline) and `Roboto 400` (body text). Preloading all weights would add unnecessary network requests.

The `crossorigin` attribute is required even for same-origin fonts when using `rel="preload"` with `as="font"` — without it, the browser fetches the font twice.

---

### Round 4 — Stable Font Output Paths in Vite

**File:** `vite.config.ts`

By default Vite hashes all asset filenames (e.g. `poppins-abcd1234.woff2`). Since the blade preload hints need to reference font files by a predictable path, Rollup's `assetFileNames` was configured to output font files without a hash:

```ts
build: {
    rollupOptions: {
        output: {
            // Keep font files with stable names (no hash) so blade can preload them
            assetFileNames: (assetInfo) => {
                if (/\.(woff2?|ttf|eot)$/i.test(assetInfo.name ?? '')) {
                    return 'assets/fonts/[name][extname]';
                }
                return 'assets/[name]-[hash][extname]';
            },
        },
    },
},
```

Fonts output to `public/build/assets/fonts/poppins-latin-700-normal.woff2` (stable). All other assets keep their content hash for cache-busting.

---

### Round 4 — CSS Preload from Vite Manifest

**File:** `resources/views/app.blade.php`

To make the stylesheet start downloading before `@vite()` injects its `<link>` tags (which happens later in `<head>`), the manifest is read at render time and a `rel="preload"` hint is injected at the very top of `<head>`:

```php
@php
    try {
        $viteManifest = json_decode(
            file_get_contents(public_path('build/manifest.json')),
            true, 512, JSON_THROW_ON_ERROR
        );
        $appCssFile  = $viteManifest['resources/css/app.css']['file'] ?? null;
        $pageCssFile = $viteManifest["resources/js/pages/{$page['component']}.tsx"]['css'][0] ?? null;
    } catch (\Throwable $e) {
        $appCssFile  = null;
        $pageCssFile = null;
    }
@endphp
@if($appCssFile)
<link rel="preload" href="/build/{{ $appCssFile }}" as="style">
@endif
@if($pageCssFile)
<link rel="preload" href="/build/{{ $pageCssFile }}" as="style">
@endif
```

The `try/catch` handles the development environment where `manifest.json` doesn't exist (Vite dev server serves files differently). Using `JSON_THROW_ON_ERROR` ensures a clean exception rather than a silent `null` decode.

---

### Round 4 — GHL Iframe `src` Set to `about:blank`

**Context:** The Hero section originally contained an inline GHL iframe:

```html
<iframe src="https://api.leadconnectorhq.com/widget/form/AVEw95R5mKrOHNlfUnzf" ...></iframe>
```

Even with `form_embed.js` deferred, the browser still loaded the iframe's full URL at page load — which included reCAPTCHA Enterprise, a 3,941 ms TBT contributor. The iframe `src` was set to `about:blank` in the blade template, and the real URL was only swapped in after the first user interaction. This is fully superseded by Round 5 (the iframe was removed from the page entirely), but was the correct interim fix.

---

### Round 5 — Remove Hero Right Column (Root CLS Cause)

**Files:** `resources/js/LandingPage/HeroSection.tsx`, `HeroSection.module.css`

The two-column Hero layout (left: content, right: inline GHL iframe) was dismantled. The right column and all associated CSS grid rules were deleted. The Hero is now single-column, centred content:

```tsx
// HeroSection.tsx — all form props removed, openFormModal dispatches event instead
const openFormModal = () => window.dispatchEvent(new Event('openFormModal'));

export default function HeroSection({ ..., quoteCtaLabel }: HeroSectionProps) {
    return (
        <section className={styles.section} aria-label="Hero">
            {/* Decorative background boilers (aria-hidden, no layout impact) */}
            <img src="/images/Logic_System_IE_Front_Facing.webp" aria-hidden="true"
                className={`${styles.bgBoiler} ${styles.bgBoiler1}`} alt="" width="250" height="313" />
            <Container>
                <div className={styles.grid}>
                    <div className={styles.left}>
                        ...
                        <Button onClick={openFormModal} variant="primary">
                            {quoteCtaLabel}
                        </Button>
                        ...
                    </div>
                    {/* Right column with iframe removed entirely */}
                </div>
            </Container>
        </section>
    );
}
```

GHL's `form_embed.js` cannot inject wrapper `<div>` elements into layout flow if there is no container for it to target. This eliminated the root cause of all mobile CLS.

---

### Round 5 — FormModal Component

**Files:** `resources/js/LandingPage/FormModal.tsx`, `FormModal.module.css`

A full-screen modal was created to host the GHL iframe. The iframe only receives its real `src` when the modal is opened — it does not exist in the DOM at page load at all.

**`FormModal.tsx`:**
```tsx
import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import styles from './FormModal.module.css';

const GHL_FORM_SRC = 'https://api.leadconnectorhq.com/widget/form/AVEw95R5mKrOHNlfUnzf';

export default function FormModal() {
    const [open, setOpen] = useState(false);
    const [src, setSrc]   = useState('about:blank');

    const openModal = useCallback(() => {
        setSrc(GHL_FORM_SRC);   // only now does the iframe start loading
        setOpen(true);
    }, []);

    const closeModal = useCallback(() => setOpen(false), []);

    // Listen for the custom event dispatched by every CTA button
    useEffect(() => {
        window.addEventListener('openFormModal', openModal);
        return () => window.removeEventListener('openFormModal', openModal);
    }, [openModal]);

    // Keyboard close
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, closeModal]);

    if (!open) return null;   // renders nothing until a CTA is clicked

    return (
        <div className={styles.overlay} onClick={closeModal}
             role="dialog" aria-modal="true" aria-label="Get a Free Quote">
            <div className={styles.box} onClick={e => e.stopPropagation()}>
                <button className={styles.close} onClick={closeModal} aria-label="Close">
                    <X size={22} />
                </button>
                <iframe
                    src={src}
                    className={styles.iframe}
                    style={{ border: 'none' }}
                    id="inline-AVEw95R5mKrOHNlfUnzf"
                    data-layout="{'id':'INLINE'}"
                    data-trigger-type="alwaysShow"
                    data-activation-type="alwaysActivated"
                    data-deactivation-type="neverDeactivate"
                    data-form-name="Auld Form"
                    data-height="550"
                    data-layout-iframe-id="inline-AVEw95R5mKrOHNlfUnzf"
                    data-form-id="AVEw95R5mKrOHNlfUnzf"
                    title="Auld Form"
                />
            </div>
        </div>
    );
}
```

**`FormModal.module.css`:**
```css
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}
.box {
    background: #ffffff;
    border-radius: 1rem;
    width: 100%;
    max-width: 580px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    padding: 1rem;
}
.close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    color: #333;
    border-radius: 0.25rem;
    z-index: 1;
}
.close:hover { background: #f0f0f0; }
.iframe {
    display: block;
    width: 100% !important;
    max-width: 100% !important;
    min-height: 550px;
    border: none;
}
```

**Key design decisions:**
- `if (!open) return null` — the component renders zero DOM nodes at page load, so reCAPTCHA Enterprise never boots.
- `src` starts as `'about:blank'` and is only set to the real GHL URL when `openModal()` fires. This means reCAPTCHA only loads after the user has explicitly clicked a CTA.
- Clicking the overlay backdrop closes the modal (`onClick={closeModal}` on `.overlay`), while `e.stopPropagation()` on `.box` prevents the backdrop click from triggering through the form.
- The `Escape` key listener is scoped to when `open === true` and cleaned up on close.

---

### Round 5 — Wiring All CTA Buttons to `openFormModal`

**Files:** `HeroSection.tsx`, `BoilerOptionsSection.tsx`, `TestimonialsSection.tsx`, `FinalCtaSection.tsx`, `WhyUsDetailedSection.tsx`

Every CTA button across the page dispatches the same custom DOM event, which `FormModal` listens to. This decouples the button components from the modal — no props or context needed:

```tsx
// One line at the top of each component file:
const openFormModal = () => window.dispatchEvent(new Event('openFormModal'));

// Used in JSX:
<button onClick={openFormModal}>Get My Free Quote →</button>
// or via the shared Button component:
<Button onClick={openFormModal} variant="primary">{quoteCtaLabel}</Button>
```

---

### Round 5 — `<FormModal />` Mounted Once at Page Root

**File:** `resources/js/pages/Welcome.tsx`

The modal is rendered once at the top level of the page component, shared by all CTA buttons:

```tsx
import FormModal from '../LandingPage/FormModal';

export default function Welcome() {
    return (
        <>
            <FormModal />   {/* Single instance — mounts once, listens for openFormModal event */}
            <LandingPageHeader ... />
            <HeroSection ... />
            <TrustStripSection ... />
            <WhyUsDetailedSection ... />
            {/* ... other sections */}
        </>
    );
}
```

Mounting it outside any section means it is never unmounted during scroll or re-renders. The `useState` inside `FormModal` persists for the full page lifetime.

---

## Remaining Actions — AULD Heating

| Priority | Action | Type |
|---|---|---|
| 🟠 Manual | Cloudflare Page Rule: `*auldheating.com/*` → Browser Cache TTL: **Respect Existing Headers** | Cloudflare Dashboard |
| 🟢 Low | Delete `public/images/optimised/` temp folder (used during image processing) | Cleanup |

---

## Score History — Aptus Boiler Installation

| Date | Desktop | Mobile | Notes |
|---|---|---|---|
| May 8, 2026 (baseline) | 61 | 61 | No optimisations |
| May 8, 2026 (round 1) | 67 | 64 | `requestIdleCallback` for GTM/GHL, .htaccess cache headers, images compressed, React.lazy code splitting |
| May 8, 2026 (round 2) | **86** | **89** | GTM/GHL deferred to user interaction, CLS min-height fix, gallery images resized 1542px → 650px |

---

## Optimisation Log — Aptus Boiler Installation

### Round 1 — May 8, 2026

| # | Fix | File | Impact |
|---|---|---|---|
| 1 | `requestIdleCallback` for GTM + GHL embed | `resources/views/app.blade.php` | TBT reduced, TTI improved |
| 2 | Split `.htaccess` cache blocks into two independent `<IfModule>` | `public/.htaccess` | 1-year cache headers now applied on Apache |
| 3 | Re-compress gallery WebP images (quality 80) | `public/landing/*.webp` | ~55% size reduction per image |
| 4 | Convert Vaillant boiler PNG → WebP | `public/landing/gas-boiler-vaillant.webp` | 75KB → 6KB (−92%) |
| 5 | React.lazy for 13 below-fold sections | `resources/js/LandingPages/LandingPage.tsx` | Initial JS bundle reduced; lazy chunks load on scroll |

### Round 2 — May 8, 2026

| # | Fix | File | Impact |
|---|---|---|---|
| 6 | GTM/GHL load on first user interaction (scroll/click) | `resources/views/app.blade.php` | TBT: 1,020ms → 290ms desktop / 1,680ms → 200ms mobile |
| 7 | `min-height: 700px` on `.iframeWrap` | `resources/js/LandingPages/HeroSection.module.css` | CLS reduced (form_embed.js no longer causes layout shift) |
| 8 | Resize gallery images 1542×2048 → 650×650 | `public/landing/*_650.webp` | 166KB→23KB, 120KB→21KB, 82KB→14KB (avg −84%) |

---

## Remaining Issues — Aptus

| Priority | Issue | Fix |
|---|---|---|
| 🟠 High | Cache capped at 4h — Cloudflare overriding origin headers | Cloudflare Page Rule: Browser Cache TTL → Respect Existing Headers |
| 🟠 High | TTI 3.4s desktop — React hydration cost | Inertia SSR is already scaffolded (`ssr.tsx`) but disabled. Enable it (`INERTIA_SSR_ENABLED=true`) and run `php artisan inertia:start-ssr` to reduce hydration time. Alternatively, use Vite `manualChunks` to split the bundle. |
| 🟡 Medium | Unused JS ~985KB — GTM/FB/GHL post-interaction | Third-party; not controllable |
| 🟡 Medium | Unused CSS 40KB | PurgeCSS / Tailwind safelist audit |
| 🟢 Low | font-display-insight 10ms | Already using `display=swap`; negligible |
