# Laravel + Inertia.js SSR Fix Guide

**Problem this solves:** Laravel SPA delivering empty HTML to Googlebot, causing:
- `<title>` showing "Laravel" or bare brand name with no keywords
- Empty `<body>` — no H1, no copy, no meta description visible to crawlers
- Google Ads "Below Average" Landing Page Experience
- Poor or zero organic indexing despite live content

**Stack this applies to:** Laravel 11 + Inertia.js v1 + React (TypeScript or JS)  
**Hosting:** Any containerised host (Laravel Cloud, Forge, Railway, etc.)

---

## Quick Checklist

- [ ] Step 1 — Confirm SSR files exist in the project
- [ ] Step 2 — Fix `.env`
- [ ] Step 3 — Fix `vite.config.ts`
- [ ] Step 4 — Fix `resources/js/ssr.tsx`
- [ ] Step 5 — Add SEO tags to the page component
- [ ] Step 6 — Update `package.json` build script
- [ ] Step 7 — Configure hosting (build command + background worker)
- [ ] Step 8 — Deploy and verify

---

## Step 1 — Confirm SSR is Scaffolded

Check that these files exist in the project:

```
resources/js/ssr.tsx       (or ssr.jsx / ssr.ts)
resources/js/app.tsx       (client entry point)
resources/views/app.blade.php
```

If `ssr.tsx` does not exist, run:

```bash
php artisan inertia:middleware
# Then create resources/js/ssr.tsx manually (see Step 4 for the template)
```

Also confirm `@inertiaHead` is in `app.blade.php` inside `<head>`:

```blade
@inertiaHead
```

If it is missing, add it directly before `</head>`. This directive outputs all SSR-rendered head tags (title, meta, etc.).

---

## Step 2 — Fix `.env`

```dotenv
# Fix the app name — "Laravel" is the framework default placeholder
APP_NAME="Your Brand Name Here"

# Enable SSR
INERTIA_SSR_ENABLED=true
INERTIA_SSR_HOST=127.0.0.1
INERTIA_SSR_PORT=13714
```

> Note: Values with spaces or special characters must be wrapped in double quotes.

---

## Step 3 — Fix `vite.config.ts`

Add the `ssr` block **at the top level** of `defineConfig`. This bundles all Node.js dependencies into the SSR output so it can run standalone in production containers where `node_modules` is not available at runtime.

```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',   // <-- must point to your SSR entry file
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    // ✅ CRITICAL for containerised hosting (Laravel Cloud, Railway, etc.)
    // Bundles ALL dependencies into bootstrap/ssr/ssr.js so it runs without node_modules.
    // Without this you will get ERR_MODULE_NOT_FOUND on every SSR startup in production.
    ssr: {
        noExternal: true,
    },
});
```

> If you're not using Ziggy (route helpers), remove the `ziggy-js` alias.

---

## Step 4 — Fix `resources/js/ssr.tsx`

Replace or update the SSR entry file. The most common mistake is the `title` callback appending the app name, which creates a double-title when the page component already sets a full SEO title.

```tsx
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { type RouteName, route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Your Brand Name Here';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,

        // ✅ Pass the title through as-is.
        // If your page component sets the full title (e.g. "New Boiler Installation | Brand"),
        // do NOT append appName here — it will produce "New Boiler Installation | Brand | Brand".
        title: (title) => title,

        // If you want "Page Name | Brand" format and your page components only set short titles:
        // title: (title) => `${title} | ${appName}`,

        resolve: (name) =>
            resolvePageComponent(
                `./pages/${name}.tsx`,
                import.meta.glob('./pages/**/*.tsx'),
            ),

        setup: ({ App, props }) => {
            /* eslint-disable */
            // @ts-expect-error
            global.route<RouteName> = (name, params, absolute) =>
                route(name, params as any, absolute, {
                    // @ts-expect-error
                    ...page.props.ziggy,
                    // @ts-expect-error
                    location: new URL(page.props.ziggy.location),
                });
            /* eslint-enable */

            return <App {...props} />;
        },
    }),
);
```

> If not using Ziggy, remove the `route` import and the `global.route` block. The `setup` function simplifies to just `return <App {...props} />;`.

---

## Step 5 — Add SEO Tags to the Page Component

In your main landing page component (e.g. `resources/js/pages/Welcome.tsx`), import `Head` from Inertia and set a full SEO title and meta description:

```tsx
import { Head } from '@inertiajs/react';

export default function Welcome() {
    const pageTitle = 'Your Full SEO Title | Location | Brand';
    const pageDescription = 'Your meta description — 150–160 characters. Include your main USP and a call to action.';

    return (
        <>
            <Head title={pageTitle}>
                <meta name="description" content={pageDescription} />
            </Head>

            {/* rest of your page */}
        </>
    );
}
```

**Rules for the title:**
- Include the main keyword first
- Include location if local service
- Include brand name at the end
- Keep under 60 characters for Google display, but longer is fine for Ads quality score
- Do NOT include `| Brand` if the `ssr.tsx` title callback already appends it

---

## Step 6 — Update `package.json`

Ensure the SSR build script exists:

```json
"scripts": {
    "build": "vite build",
    "build:ssr": "vite build && vite build --ssr",
    "dev": "vite"
}
```

The `build:ssr` command runs two builds:
1. `vite build` → client bundle → `public/build/`
2. `vite build --ssr` → SSR bundle → `bootstrap/ssr/ssr.js`

---

## Step 7 — Configure Hosting

### Build Command
Change the build command from `npm run build` to:

```bash
npm ci && npm run build:ssr
```

### Background SSR Process (Custom Worker)
Add a **persistent background worker** (not a deploy command — it must never exit):

```bash
node bootstrap/ssr/ssr.js
```

| Hosting Platform | Where to add it |
|---|---|
| **Laravel Cloud** | Application → Workers → Add Custom Worker |
| **Laravel Forge** | Site → Daemons → Add Daemon |
| **Railway** | Not recommended — use Forge or Cloud for Laravel SSR |
| **Self-hosted** | Supervisor process pointing to `node bootstrap/ssr/ssr.js` |

> **Why not in deploy commands?** Deploy commands must exit cleanly. A Node.js HTTP server runs forever — putting it in deploy commands will cause the deployment to hang until it times out.

### Laravel Cloud Specific Notes
- The SSR bundle listens on port `13714` by default
- Laravel's Inertia SSR client sends requests to `http://127.0.0.1:13714` when `INERTIA_SSR_ENABLED=true`
- The Custom Worker auto-restarts if the process crashes
- `bootstrap/ssr/` is in `.gitignore` — the bundle is produced at deploy time, never committed

---

## Step 8 — Deploy and Verify

After deploying:

### Check the logs
Look for this line in your hosting logs:

```
Inertia SSR server started.
```

If you see `ERR_MODULE_NOT_FOUND` instead, `ssr: { noExternal: true }` is missing from `vite.config.ts` (Step 3).

### Check the page source
1. Open the live site in a browser
2. Right-click → **View Page Source** (not Inspect — that shows the JS-rendered DOM)
3. Confirm you see:
   - `<title>` with full SEO title (not "Laravel" or bare brand)
   - `<meta name="description" content="...">` with your description
   - `<h1>` tag in the `<body>` HTML
   - Visible body copy — testimonials, FAQs, etc.

If the body is still empty in page source, SSR is not working. Check:
- Is the background worker running? (check hosting logs)
- Is `INERTIA_SSR_ENABLED=true` set in production environment variables?
- Did the build include the SSR bundle? (`bootstrap/ssr/ssr.js` must exist)

### Google Search Console
Use URL Inspection → "Test Live URL" to see exactly what Googlebot sees. The rendered HTML should now contain all your page content.

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `ERR_MODULE_NOT_FOUND` | Production has no `node_modules` at runtime | Add `ssr: { noExternal: true }` to `vite.config.ts` |
| Page source still empty | SSR process not running | Check background worker is configured and running |
| `<title>` shows "Laravel" | `APP_NAME` not set | Set `APP_NAME="Your Brand"` in production env vars |
| Double title in `<head>` | Title callback appending brand AND page component setting full title | Change `title: (title) => title` in `ssr.tsx` |
| Deployment hangs forever | SSR process added to deploy commands | Move to background worker — deploy commands must exit |
| 403 on page source check | WAF/Cloudflare blocking | Whitelist Googlebot UA in WAF rules or check Cloudflare settings |

---

## What SSR Does Not Fix

SSR fixes crawler visibility — it does not fix conversion rate or ad quality score on its own. After fixing SSR:

1. **Wait 1–2 weeks** for Google to re-crawl and update Landing Page Experience scores
2. **Force a Quality Score refresh** by pausing and unpausing weak keywords to trigger re-evaluation
3. **Check Search Console URL Inspection** to confirm Googlebot sees full HTML
4. **LP conversion work** (trust signals, form friction, social proof) is a separate project

---

## Files Changed Summary

For a standard Laravel + Inertia + React project, these are the only files you need to touch:

| File | What to change |
|---|---|
| `.env` | `APP_NAME`, `INERTIA_SSR_ENABLED=true` |
| `vite.config.ts` | Add `ssr: { noExternal: true }` |
| `resources/js/ssr.tsx` | Fix title callback, update appName fallback |
| `resources/js/pages/YourPage.tsx` | Add `<Head title={...}>` with meta description |
| `package.json` | Add `"build:ssr"` script |
| Hosting config | Change build command, add background worker |
