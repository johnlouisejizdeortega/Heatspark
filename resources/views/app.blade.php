<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Preload render-blocking CSS early so download starts before @vite() injects the link tags --}}
    @php
        try {
            $viteManifest = json_decode(file_get_contents(public_path('build/manifest.json')), true, 512, JSON_THROW_ON_ERROR);
            $appCssFile   = $viteManifest['resources/css/app.css']['file'] ?? null;
            $pageCssFile  = $viteManifest["resources/js/pages/{$page['component']}.tsx"]['css'][0] ?? null;
        } catch (\Throwable $e) {
            $appCssFile = null;
            $pageCssFile = null;
        }
    @endphp
    @if($appCssFile)
    <link rel="preload" href="/build/{{ $appCssFile }}" as="style">
    @endif
    @if($pageCssFile)
    <link rel="preload" href="/build/{{ $pageCssFile }}" as="style">
    @endif

    {{-- Preload critical fonts (self-hosted via @fontsource — no Google Fonts DNS overhead) --}}
    <link rel="preload" href="/build/assets/fonts/poppins-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/build/assets/fonts/roboto-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>

    {{-- Inline style to set the HTML background color for white mode --}}
    <style>
        html {
            background-color: oklch(1 0 0);
            zoom: 0.75;
        }
    </style>

    {{-- Favicon --}}
    <link rel="icon" type="image/avif" href="/images/363351001_121344347693353_7451035572293416588_n-removebg-preview.avif">
    <link rel="apple-touch-icon" href="/images/363351001_121344347693353_7451035572293416588_n-removebg-preview.avif">

    <!-- Fonts and GTM deferred to first user interaction (see loader below) -->

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TX6NV42H"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->

    <!-- Google Ads Enhanced Conversions - Form Tracking -->
    <script>
    (function () {
      'use strict';

      window.dataLayer = window.dataLayer || [];

      /* -----------------------------
         Helpers
      ----------------------------- */

      function normalizeEmail(email) {
        return email ? email.trim().toLowerCase() : '';
      }

      function formatPhone(phone) {
        return phone ? phone.replace(/[^\d+]/g, '') : '';
      }

      function parseName(fullName) {
        if (!fullName) return { first: '', last: '' };
        var parts = fullName.trim().split(/\s+/);
        return {
          first: parts[0] || '',
          last: parts.slice(1).join(' ') || ''
        };
      }

      /* -----------------------------
         Extract form data
      ----------------------------- */

      function getFormData(form) {
        var data = {};

        // Get email field
        var emailInput = form.querySelector('#lead-email') || form.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
          data.email = normalizeEmail(emailInput.value);
        }

        // Get phone field
        var phoneInput = form.querySelector('#lead-phone') || form.querySelector('input[type="tel"]');
        if (phoneInput && phoneInput.value) {
          data.phone_number = formatPhone(phoneInput.value);
        }

        // Get name field
        var nameInput = form.querySelector('#lead-name') || form.querySelector('input[name="name"]');
        if (nameInput && nameInput.value) {
          var parsed = parseName(nameInput.value);
          data.first_name = parsed.first;
          data.last_name = parsed.last;
        }

        // Optional: Add address data if available
        var postcodeInput = form.querySelector('input[name="postcode"]');
        var addressInput = form.querySelector('input[name="address"]');
        var cityInput = form.querySelector('input[name="city"]');

        if (postcodeInput || addressInput || cityInput) {
          data.address = {
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            street: addressInput ? addressInput.value : '',
            city: cityInput ? cityInput.value : '',
            postal_code: postcodeInput ? postcodeInput.value : '',
            country: 'GB'
          };
        }

        return data;
      }

      /* -----------------------------
         Push enhanced conversion data
      ----------------------------- */

      function pushEnhancedData(form, data) {
        window.dataLayer.push({
          event: 'form_submit',
          form_id: form.id || 'lead-form',
          form_name: form.getAttribute('name') || 'lead-capture',
          enhanced_conversion_data: data
        });

        console.log('Enhanced Conversion Data Pushed:', {
          event: 'form_submit',
          enhanced_conversion_data: data
        });
      }

      /* -----------------------------
         Safe tracking (no duplicates)
      ----------------------------- */

      function attachTracking(form) {
        if (!form) return;

        // Prevent multiple listeners
        if (form.dataset.gtmTracked === 'true') return;
        form.dataset.gtmTracked = 'true';

        form.addEventListener('submit', function (e) {
          // Prevent duplicate firing on same submission
          if (form.dataset.gtmSubmitting === 'true') return;
          form.dataset.gtmSubmitting = 'true';

          var data = getFormData(form);
          pushEnhancedData(form, data);

          // Reset flag after submission completes
          setTimeout(function () {
            form.dataset.gtmSubmitting = 'false';
          }, 1000);
        });
      }

      /* -----------------------------
         Init - Track all forms
      ----------------------------- */

      function init() {
        // Find all forms with lead capture fields
        var forms = document.querySelectorAll('form[aria-label*="Lead"], form[data-track-conversion]');
        
        forms.forEach(function (form) {
          attachTracking(form);
        });

        // Also track by specific field IDs (for dynamically loaded forms)
        var leadForms = document.querySelectorAll('form:has(#lead-email), form:has(#lead-phone), form:has(#lead-name)');
        leadForms.forEach(function (form) {
          attachTracking(form);
        });
      }

      /* -----------------------------
         Run on DOM ready and on Inertia navigation
      ----------------------------- */

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }

      // Re-run when Inertia loads new pages (for SPA navigation)
      document.addEventListener('inertia:success', function () {
        setTimeout(init, 100);
      });

    })();
    </script>
    <!-- End Google Ads Enhanced Conversions Tracking -->

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

    @inertia
</body>

</html>
