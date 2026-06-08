# Auld Heating — SEO & Landing Page Fix: Handoff Summary

**Date:** May 2026  
**Site:** auldheating.com  
**Stack:** Laravel 11 + Inertia.js v1 + React + TypeScript  
**Deployed to:** Laravel Cloud

---

## Root Cause

The site was a Laravel SPA (Single Page Application). In this architecture the server sends a near-empty HTML shell and React renders everything client-side **after JavaScript loads**.

Googlebot and other crawlers received:

| What Googlebot saw | What it should see |
|---|---|
| `<title>AULD</title>` | `<title>New Boiler Installation | Trusted Heating Engineers | Gas Safe Registered</title>` |
| No `<meta name="description">` | Full meta description with USPs |
| Empty `<body>` | Complete page: H1, copy, testimonials, FAQ, CTAs |
| No H1 tag | `<h1>New Boiler Installation in Stockton-on-Tees</h1>` |

This is the direct cause of **"Below Average" Landing Page Experience** in Google Ads and weak organic indexing.

---

## Fixes Applied

### 1. `.env`
```
APP_NAME="Auld Heating & Plumbing"   # was: Laravel
INERTIA_SSR_ENABLED=true              # was: false
```

### 2. `vite.config.ts`
Added `ssr: { noExternal: true }` — required for containerised deployment.  
Production containers have **no `node_modules` at runtime**, so all dependencies must be bundled into the SSR output at build time. Without this, the SSR server crashes with `ERR_MODULE_NOT_FOUND`.

```ts
ssr: {
    noExternal: true,
},
```

### 3. `resources/js/ssr.tsx`
Fixed the title callback — it was appending `- Auld Heating` which caused a double-title:

```tsx
// BEFORE (wrong — produces "Page Title - Auld Heating - Auld Heating")
title: (title) => `${title} - ${appName}`,

// AFTER (correct — Welcome.tsx already sets the full SEO title)
title: (title) => title,
```

Also fixed the `appName` fallback:
```tsx
const appName = import.meta.env.VITE_APP_NAME || 'Auld Heating & Plumbing';
```

### 4. `resources/js/pages/Welcome.tsx`
Added full SEO title and meta description via Inertia `<Head>`:

```tsx
const pageTitle = 'New Boiler Installation | Trusted Heating Engineers | Gas Safe Registered';
const pageDescription = 'Fixed-price boiler installations. Up to 15-year manufacturer warranty. Free power flush worth £750 included. Gas Safe | City & Guilds | CPD Accredited.';

return (
    <>
        <Head title={pageTitle}>
            <meta name="description" content={pageDescription} />
        </Head>
        {/* ... page content ... */}
    </>
);
```

### 5. `resources/js/LandingPage/LandingPageHeader.tsx`
Fixed `fetchpriority` → `fetchPriority` (React SSR casing requirement, was logging a warning):

```tsx
<img ... fetchPriority="high" />
```

### 6. `resources/views/app.blade.php`
Removed the redundant hardcoded blade fallback title and meta description — SSR now handles these correctly and the static ones were creating duplicate tags in the HTML output.

---

## Laravel Cloud Configuration

| Setting | Value |
|---|---|
| Build command | `npm run build:ssr` (was `npm run build`) |
| Custom Worker (background process) | `node bootstrap/ssr/ssr.js` |
| Worker port | `13714` (default Inertia SSR port) |

> **Important:** The SSR process must be added as a **Custom Worker / background process**, NOT in the deploy commands. Deploy commands must exit — a persistent server process in deploy commands will hang the deployment forever.

---

## Verification

After deployment, confirmed SSR working by viewing page source at `auldheating.com`:
- Full `<title>` tag with SEO keywords ✅
- `<meta name="description">` present ✅  
- Complete `<body>` HTML including H1, copy, testimonials, FAQ ✅
- Laravel Cloud logs: `Inertia SSR server started` ✅

---

## Broader Audit Findings

The same Laravel SPA problem exists across multiple Choros client sites:

| Site | Issue |
|---|---|
| `auldheating.com` | ✅ Fixed (this project) |
| `boilers.goodplumbing.co.uk` | `<title>Laravel</title>`, empty body — same fix needed |
| `zebra.choros.biz` | Returning 403 Forbidden — cannot assess until resolved |

**Systemic issue:** The underlying Laravel + Inertia scaffold ships with SSR disabled by default. All future client sites need SSR enabled before launch. See `LARAVEL_INERTIA_SSR_FIX_GUIDE.md` for the reusable step-by-step fix.

---

## Remaining Actions

| Priority | Task | Owner |
|---|---|---|
| 🔴 Critical | Apply same SSR fix to Good Plumbing (`boilers.goodplumbing.co.uk`) | Dev |
| 🔴 Critical | Check `zebra.choros.biz` in Search Console URL Inspection + WAF/Cloudflare (403) | Dev / Hosting |
| 🔴 Critical | Pause "New Boiler Broadstairs Fitted" ad (209 impressions, 0.96% CTR) | PPC |
| 🔴 Critical | Pull lead-to-install close rate and gross margin from CRM | Client |
| 🟠 High | Recalculate tCPA once close rate data available (£100 target likely wrong) | PPC |
| 🟠 High | Negatives sweep — research-intent terms ("certificate", "how much", "diy") | PPC |
| 🟠 High | Tighten match types to phrase + exact until QS recovers | PPC |
| 🟡 Medium | LP conversion rebuild — trust signals, low-friction form, social proof | Dev + Client |
| 🔵 Strategic | Fix the Laravel scaffold so all future client LPs ship with SSR enabled by default | Dev |
| 🔵 Strategic | Add LP quality gate checklist before any new client launch | Process |
