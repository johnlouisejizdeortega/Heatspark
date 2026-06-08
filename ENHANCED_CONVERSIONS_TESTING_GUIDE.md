# Google Ads Enhanced Conversions - Testing Guide

## ✅ What Was Implemented

### 1. **Tracking Script Location**
The Enhanced Conversions tracking script has been added to:
- **File**: `resources/views/app.blade.php`
- **Location**: Right after the GTM noscript tag, before the Inertia content

### 2. **Standalone Version**
A copy-paste ready version is available in:
- **File**: `google-enhanced-conversions.html`
- **Use for**: Custom HTML tag in Google Tag Manager (optional alternative)

---

## 📊 How It Works

### On Form Submit:
1. The script captures form data (email, phone, name)
2. Normalizes the data (lowercase email, format phone)
3. Pushes to `dataLayer` with this structure:

```javascript
{
  event: 'form_submit',
  form_id: 'lead-form',
  form_name: 'lead-capture',
  enhanced_conversion_data: {
    email: 'user@example.com',
    phone_number: '07577732295',
    first_name: 'John',
    last_name: 'Doe'
  }
}
```

### Data Layer Event Name
- **Event**: `form_submit`
- **Trigger**: Use this event in GTM to fire your Google Ads Conversion tag

---

## 🧪 Testing Instructions

### Step 1: Test with Google Tag Assistant

1. **Install Extension**:
   - Install [Google Tag Assistant](https://tagassistant.google.com/) Chrome extension

2. **Start Preview Mode**:
   - Open Google Tag Manager
   - Click "Preview" in the top right
   - Enter your website URL and click "Connect"

3. **Navigate to Your Site**:
   - The Tag Assistant window will open
   - Navigate to the page with the form

4. **Submit the Form**:
   - Fill out the form with test data
   - Click submit
   - **Expected Result**: Form redirects to thank you page

5. **Check the dataLayer Event**:
   - In Tag Assistant, look for the `form_submit` event
   - Click on it to see the data
   - Verify `enhanced_conversion_data` contains:
     - ✓ email
     - ✓ phone_number
     - ✓ first_name
     - ✓ last_name

### Step 2: Test in Browser Console

1. **Open Browser Console** (F12)
2. **Submit the form**
3. **Check Console Logs**:
   - You should see: `✓ Enhanced Conversion Data Pushed: {...}`
4. **Inspect dataLayer**:
   ```javascript
   console.log(window.dataLayer);
   ```
   - Look for the `form_submit` event object

### Step 3: Verify in Google Tag Manager Debug

1. In GTM Preview mode
2. After form submit, check the "Data Layer" tab
3. Find `enhanced_conversion_data` variable
4. Verify all fields are populated correctly

---

## 🎯 Google Ads Conversion Tag Setup

### Create the Conversion Tag in GTM:

1. **In Google Tag Manager**:
   - Go to Tags → New
   - Tag Type: **Google Ads Conversion Tracking**

2. **Configure the Tag**:
   - Conversion ID: `AW-XXXXXXXXX` (from Google Ads)
   - Conversion Label: `xxxxxxxxxxxxx` (from Google Ads)
   
3. **Enable Enhanced Conversions**:
   - ✅ Check "Enable enhanced conversions"
   - Method: **Automatic** (recommended)
   - OR Method: **Code** → "User-provided data should be in data layer"

4. **Set the Trigger**:
   - Trigger Type: **Custom Event**
   - Event name: `form_submit`

5. **Save and Publish**

---

## 🔍 Troubleshooting

### Form not being tracked?

**Check 1**: Open console and look for:
```
✓ Enhanced Conversion Data Pushed: {...}
```

**Check 2**: Verify form has one of these:
- `aria-label="Lead capture form"`
- Fields with IDs: `#lead-email`, `#lead-phone`, `#lead-name`

**Check 3**: Check if form has `data-gtm-tracked="true"` attribute after page load
```javascript
document.querySelector('form').dataset.gtmTracked
// Should return: "true"
```

### Data not showing in dataLayer?

**Check 1**: Verify dataLayer exists:
```javascript
console.log(window.dataLayer);
```

**Check 2**: Verify GTM container loaded:
```javascript
console.log(google_tag_manager);
```

### Enhanced Conversions not working in Google Ads?

**Check 1**: Verify data format is correct
- Email must be lowercase
- Phone must be digits only (with optional +)
- Names must be separated (first_name, last_name)

**Check 2**: In Google Ads:
- Go to Tools → Measurement → Conversions
- Click on your conversion action
- Check "Enhanced conversions" diagnostics
- Look for "User-provided data detected" ✓

**Check 3**: Wait 24-48 hours for Google Ads to report enhanced conversion data

---

## 📋 Data Captured

| Field | Form Input | Normalized Format | Required |
|-------|------------|-------------------|----------|
| email | `#lead-email` | Lowercase, trimmed | Recommended |
| phone_number | `#lead-phone` | Digits only, + allowed | Recommended |
| first_name | `#lead-name` (split) | First word | Optional |
| last_name | `#lead-name` (split) | Remaining words | Optional |

---

## ✨ Features

✅ **Works with AJAX forms** - No page reload required  
✅ **Prevents duplicate events** - Smart tracking flags  
✅ **Inertia.js compatible** - Re-initializes on SPA navigation  
✅ **Console logging** - Easy debugging  
✅ **Flexible form detection** - Multiple selector strategies  
✅ **Google Ads compliant** - Proper data structure for Enhanced Conversions  

---

## 📞 Support

### Common Form Field IDs:
- Email: `#lead-email`
- Phone: `#lead-phone`
- Name: `#lead-name`

### Form Selector:
- Aria Label: `form[aria-label="Lead capture form"]`

### Custom Tracking:
Add `data-track-conversion` attribute to any form:
```html
<form data-track-conversion>
  <!-- form fields -->
</form>
```

---

## 🚀 Go Live Checklist

- [ ] GTM container published with Preview mode
- [ ] Test form submission in Tag Assistant
- [ ] Verify `form_submit` event appears in dataLayer
- [ ] Check enhanced_conversion_data contains email + phone
- [ ] Google Ads Conversion tag created and published
- [ ] Enhanced Conversions enabled in the tag
- [ ] Trigger set to `form_submit` event
- [ ] Test a real conversion
- [ ] Wait 24-48 hours and check Google Ads reporting

---

## 📝 Notes

- Enhanced conversion data improves conversion tracking accuracy by ~15-30%
- User data is hashed by Google before matching
- No PII is stored in Google Analytics or Tag Manager
- Data is only used for conversion matching in Google Ads
- Complies with Google's Enhanced Conversions policies and GDPR
