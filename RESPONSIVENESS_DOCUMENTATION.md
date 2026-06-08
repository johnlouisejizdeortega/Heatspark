# Responsiveness Documentation

**Project:** Choros.io Marketing Landing Page  
**Stack:** React 19 + TypeScript, CSS Modules, Laravel 12 + Inertia.js v2, Vite 6

---

## How Responsiveness Is Achieved

The site is fully responsive using **CSS Modules with mobile-first media queries**. Each section component has its own `.module.css` file that handles its own breakpoints independently.

---

## Global HTML Zoom

```css
/* resources/views/app.blade.php */
html {
    zoom: 0.75;
}
```

The entire page uses `zoom: 0.75` — meaning the visual output is scaled to **75% of its designed size**. This is intentional and affects all sections uniformly. CSS media queries still evaluate at the real device pixel width (not the zoomed size), so breakpoints behave normally.

---

## Viewport Meta Tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

- `width=device-width`: Makes the layout width match the device screen width
- `initial-scale=1`: No zoom on first load
- Pinch-to-zoom is allowed (good for accessibility)

---

## Container System

The `ui/Container` component provides max-width control and responsive horizontal padding:

| Screen Size | Padding Inline | Max-Width Options |
|-------------|----------------|-------------------|
| Mobile (≤640px) | `1rem` (16px) | `page` = 92rem, `wide` = 72rem, `medium` = 56rem, `narrow` = 42rem |
| Tablet (641–1024px) | `1.5rem` (24px) | Same options |
| Desktop (≥1025px) | `2rem` (32px) | Same options |

Most sections do not use the shared Container component — they inline their own `max-width: 80rem; margin: 0 auto; padding: 0 1.5rem` on their `.container` class.

---

## Breakpoint System

The project uses a 4-tier breakpoint system:

| Tier | Width | Used For |
|------|-------|---------|
| Mobile (default) | 0px+ | Base styles — single column, stacked layouts |
| Small mobile tablet | 480px+ | Some 2→3 column transitions (team grid) |
| Tablet | 768px+ | Multi-column grids, font size bumps |
| Desktop | 1024px / 1025px | Full desktop layouts, side-by-side columns |

> **Note:** `1024px` and `1025px` are both used in the codebase — this is a minor inconsistency but has no visible effect.

---

## Section-by-Section Responsive Breakdown

### HeroSection
- **Mobile:** Single column — headline text top, image below
- **Desktop (≥1024px):** Two columns — text left (`1fr`), image right (`1fr`)
- **Title font:** `2.25rem` (mobile) → `2.75rem` (tablet) → `3.5rem` (desktop)
- **Stats grid:** Always `2×2` (4 stats in 2 columns)
- **CTA buttons:** `flex-wrap: wrap` — always wrap to next line on small screens

### HowItWorksSection
- **Mobile (default):** Single column — steps stack vertically
- **Small tablet (≥480px):** `2` columns
- **Tablet (≥768px):** `4` columns (all 4 steps in one row)
- **Gap:** `1rem` → `1.5rem` on tablet/desktop

### ServicesSection
- **Mobile:** `1` column
- **Tablet (≥768px):** `2` columns
- **Desktop (≥1024px):** `4` columns

### PricingSection
- **Mobile:** `1` column
- **Tablet (≥768px):** `2` columns
- **Desktop (≥1024px):** `4` columns

### TestimonialsSection
- **Mobile:** `1` column (cards stack)
- **Tablet (≥768px):** `3` columns — `repeat(3, minmax(0, 1fr))`

### VideoTestimonialsSection
- **Mobile:** `1` column
- **Tablet (≥768px):** `3` columns

### GuaranteesSection
- **Mobile:** `1` column
- **Tablet (≥768px):** `3` columns

### ProblemSolutionSection
- **Mobile:** `1` column
- **Tablet (≥768px):** `2` columns

### ServiceAreasSection
- **Mobile:** `2` columns
- **Tablet (≥768px):** `3` columns
- **Desktop (≥1024px):** `6` columns

### ServiceDetailSection
- **Mobile:** Single column — text and image stack
- **Desktop (≥1024px):** Two columns — text left, image right

### CertifiedExpertsSection

**Cert Grid:**
- **Mobile:** `2` columns (per row)
- **Tablet (≥768px):** `3` columns
- **Desktop (≥1024px):** `6` columns

**Team Grid:**
- **Mobile (default):** `2` columns
- **Small tablet (≥480px):** `3` columns
- **Tablet (≥768px):** `5` columns

### FAQSection
- Single column flexbox layout (`flex-direction: column`) — constrained to `max-width: 48rem` and centered

### LandingPageHeader
- Flexbox `space-between` — logo left, nav/CTA right
- No explicit breakpoint; relies on natural flexbox wrapping

### LandingPageFooter
- **Mobile (≤640px):** Single column
- **Desktop (≥1025px):** Two columns — brand left, links right

---

## GHL Iframe Form (LeadCaptureSection)

The GoHighLevel form is embedded as an `<iframe>`. Here is exactly how it is sized:

```tsx
<iframe
    src="https://api.leadconnectorhq.com/widget/form/IRQZ0pMEZTBZcopbDDjP"
    className={styles.iframe}
    style={{ width: '100%', border: 'none', borderRadius: '3px' }}
/>
```

```css
/* LeadCaptureSection.module.css */
.iframe {
    display: block;
    width: 100%;
    min-height: 420px;
    height: 100%;
}

@media (min-width: 768px) {
    .iframe {
        min-height: 520px;
    }
}
```

| Property | Value | Purpose |
|----------|-------|---------|
| `width: 100%` | Fills container | Adapts to any parent width |
| `min-height: 420px` | Mobile | Enough height for the form on small screens |
| `min-height: 520px` | Tablet+ (≥768px) | More vertical space on larger screens |
| `height: 100%` | Fills parent | Expands if parent is taller than min-height |
| `border: none` | Removes iframe border | Clean appearance |

**Card variant** (`variant="card"`) — used in HeroSection and FinalCtaSection:
```css
.card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1.5rem;
    max-width: 36rem;   /* 576px — constrains form width on large screens */
    margin: 0 auto;     /* centers horizontally */
    width: 100%;
}
```

**Section variant** (`variant="section"`) — used standalone:
```css
.section {
    padding: 4rem 0;
    background: #f9fafb;
}
```
The iframe fills the full section width within the 80rem max-width container.

---

## Floating CTA Buttons (MobileStickyCta)

```css
.wrap {
    position: fixed;
    right: 1rem;
    bottom: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    z-index: 50;
}

.btn {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    /* blue, green, dark variants */
}
```

- Fixed to **bottom-right** of the viewport on all screen sizes
- 3 circular buttons stacked vertically: Phone (blue), WhatsApp (green), Get Quote (dark)
- `z-index: 50` ensures they render above all content

---

## CTA Button Groups (All Sections)

Every section's CTA button group uses:

```css
.ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;       /* or 1rem */
    justify-content: center;
}
```

- `flex-wrap: wrap` — buttons wrap to the next line on small screens
- Never overflow horizontally
- Centered on all screen sizes

---

## Scroll Animations

Scroll-triggered animations are applied via the `IntersectionObserver` pattern (or CSS transitions triggered by `.is-visible` classes added on scroll). These are **layout-independent** and work on all screen sizes without breakpoint changes.

---

## Issues Fixed During Audit

| Issue | Fix Applied |
|-------|-------------|
| iframe `minHeight: 520px` hardcoded on all screens | Moved to CSS class: `420px` on mobile, `520px` on tablet+ |
| HowItWorks grid starts at `2` columns on all mobiles | Added `1fr` default, `2` columns at ≥480px, `4` at ≥768px |
| TeamGrid always `3` columns (cramped on small phones) | Changed to `2` default, `3` at ≥480px, `5` at ≥768px |

---

## Testing Checklist

Use browser DevTools (F12 → Toggle Device Toolbar) to test these key widths:

| Device | Width | Critical Checks |
|--------|-------|-----------------|
| iPhone SE | 375px | Form height, button sizes, HowItWorks grid |
| iPhone 14 Pro | 393px | All sections, floating buttons |
| Pixel 7 | 412px | Grid layouts |
| iPad Mini | 768px | Column transitions |
| iPad Pro | 1024px | Desktop layout trigger |
| Desktop | 1440px | Max-width containers centered |

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `resources/views/app.blade.php` | Viewport meta, global `zoom: 0.75`, `form_embed.js` |
| `resources/js/LandingPage/ui/Container.module.css` | Shared container max-widths + responsive padding |
| `resources/js/LandingPage/LeadCaptureSection.tsx` | GHL iframe embed |
| `resources/js/LandingPage/LeadCaptureSection.module.css` | iframe responsive min-height |
| `resources/js/LandingPage/MobileStickyCta.module.css` | Fixed floating CTA buttons |
| `resources/js/LandingPage/HowItWorksSection.module.css` | Steps grid (1→2→4 columns) |
| `resources/js/LandingPage/CertifiedExpertsSection.module.css` | Cert + team grids |
