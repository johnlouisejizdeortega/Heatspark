# Google Search Console Sitemap Submission Guide

## Files Created

✅ **sitemap.xml** - Located at `public/sitemap.xml`  
✅ **robots.txt** - Updated at `public/robots.txt`

---

## STEP 1: Update Your Domain URLs

### In `public/sitemap.xml`:
Replace `https://www.yourdomain.com/` with your actual website URL.

**Example:**
```xml
<loc>https://www.auldheating.co.uk/</loc>
```

### In `public/robots.txt`:
Replace the sitemap URL with your actual domain.

**Example:**
```
Sitemap: https://www.auldheating.co.uk/sitemap.xml
```

---

## STEP 2: Verify Sitemap is Accessible

After deploying to production, test these URLs in your browser:

1. **Sitemap**: `https://yourdomain.com/sitemap.xml`
2. **Robots.txt**: `https://yourdomain.com/robots.txt`

Both should load successfully (200 status code).

---

## STEP 3: Submit to Google Search Console

### A. Access Google Search Console
1. Go to: https://search.google.com/search-console
2. Sign in with your Google account
3. Add your website property if you haven't already

### B. Verify Website Ownership
If not already verified, choose one method:
- **HTML file upload** (recommended)
- **HTML tag** (add to your `<head>` in app.blade.php)
- **Google Analytics** (if already installed)
- **Google Tag Manager** (you already have GTM-TX6NV42H installed ✅)
- **Domain name provider**

### C. Submit Sitemap
1. In the left sidebar, click **"Sitemaps"**
2. Under "Add a new sitemap", enter: `sitemap.xml`
3. Click **"Submit"**

---

## STEP 4: Monitor & Wait

**After submission:**
- Google will show "Success" or "Couldn't fetch" status
- It takes **24-48 hours** for Google to crawl your sitemap
- It can take **1-4 weeks** for pages to appear in search results

**Check status:**
1. Go to **Sitemaps** section in Search Console
2. View "Discovered URLs" and "Indexed URLs"
3. Check for any errors or warnings

---

## What's Included in Your Sitemap

Currently, your sitemap includes:

| URL | Priority | Change Frequency | Notes |
|-----|----------|------------------|-------|
| Homepage (/) | 1.0 (highest) | Weekly | Main landing page |

### What's Excluded (Blocked in robots.txt):
- ❌ `/admin/*` - Admin pages
- ❌ `/dashboard` - User dashboard
- ❌ `/login`, `/register` - Auth pages
- ❌ `/thank-you` - Post-conversion page (no SEO value)
- ❌ `/api/*` - API endpoints
- ❌ `/settings/*` - Settings pages

This ensures only your public landing page is indexed for SEO.

---

## Adding More Pages Later

If you add more public pages (e.g., About Us, Services, Blog), update `sitemap.xml`:

```xml
<url>
    <loc>https://www.yourdomain.com/about</loc>
    <lastmod>2026-03-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
</url>
```

**Priority guide:**
- `1.0` - Homepage (most important)
- `0.8` - Main service/product pages
- `0.6` - Secondary pages
- `0.4` - Blog posts, articles

**Change frequency:**
- `always` - Content changes every visit (e.g., news feeds)
- `hourly` - Very dynamic content
- `daily` - Updated daily (e.g., blog)
- `weekly` - Updated weekly (recommended for most)
- `monthly` - Stable content
- `yearly` - Rarely changes
- `never` - Archived content

---

## Common Issues & Solutions

### Issue: "Couldn't fetch sitemap"
**Solutions:**
- ✅ Verify sitemap.xml is in `public/` folder
- ✅ Check file permissions (should be readable)
- ✅ Ensure website is live (not localhost)
- ✅ Test URL manually in browser
- ✅ Check for XML syntax errors

### Issue: "Sitemap is HTML"
**Solution:** Make sure you're submitting `sitemap.xml`, not an HTML page.

### Issue: "No data yet"
**Solution:** Wait 24-48 hours after submission. Google needs time to crawl.

### Issue: URLs not getting indexed
**Possible reasons:**
- New website (takes 2-4 weeks)
- Duplicate content
- Low-quality content
- Technical SEO issues
- Website not mobile-friendly

---

## Additional SEO Tips

### Already Implemented ✅
- ✅ Google Tag Manager (GTM-TX6NV42H)
- ✅ Enhanced Conversions tracking
- ✅ Meta descriptions on pages
- ✅ Favicon
- ✅ Mobile-responsive design
- ✅ Fast page load (2-3s form submission)

### Consider Adding:
- 📊 Google Analytics 4 (via GTM)
- 🔍 Schema.org markup (LocalBusiness, Service)
- 📱 Accelerated Mobile Pages (AMP) - optional
- 🌐 Multiple location pages (if serving multiple areas)
- 📝 Blog for content marketing
- ⭐ Review schema for testimonials

---

## Monitoring Tools

**Free tools to track SEO:**
1. **Google Search Console** - Essential (free)
2. **Google Analytics** - Track traffic (free)
3. **Google PageSpeed Insights** - Performance (free)
4. **Mobile-Friendly Test** - Mobile check (free)

**Paid tools (optional):**
- Ahrefs - Keyword research & backlinks
- SEMrush - Comprehensive SEO suite
- Moz - SEO metrics & tracking

---

## Quick Checklist

Before submitting to Google Search Console:

- [ ] Updated domain in `sitemap.xml`
- [ ] Updated domain in `robots.txt`
- [ ] Deployed changes to production server
- [ ] Verified sitemap.xml is accessible at your domain
- [ ] Verified robots.txt is accessible at your domain
- [ ] Signed up for Google Search Console
- [ ] Verified website ownership
- [ ] Submitted sitemap
- [ ] Waited 24-48 hours for initial crawl

---

## Expected Timeline

| Milestone | Timeline |
|-----------|----------|
| Submit sitemap | Today |
| Google discovers sitemap | 1-2 days |
| Google crawls pages | 2-7 days |
| Pages appear in search | 1-4 weeks |
| Ranking improvements | 4-12 weeks |

SEO is a **long-term strategy**. Be patient and focus on quality content and user experience.

---

**Questions?** Check Google Search Console Help: https://support.google.com/webmasters

**Good luck!** 🚀
