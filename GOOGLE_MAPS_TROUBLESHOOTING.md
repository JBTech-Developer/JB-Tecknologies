# Google Maps Mobile Device Troubleshooting Guide

## Problem: "Google API needed" or Map Not Loading on Mobile Devices

If your map works on desktop but shows "Google API needed" or fails to load on mobile devices, follow these steps:

## Common Causes & Solutions

### 1. **API Key Restrictions Blocking Mobile Browsers**

**Problem:** Your Google Maps API key has HTTP referrer restrictions that don't include mobile browser user agents or domains.

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/credentials)
2. Click on your API key
3. Under "Application restrictions", check:
   - If using "HTTP referrers", ensure your production domain is listed
   - Add your mobile domain (e.g., `https://yourdomain.com/*`)
   - Add wildcard patterns if needed: `https://*.yourdomain.com/*`
4. **Important:** For mobile devices, you may need to allow requests without referrer restrictions temporarily to test, or ensure your mobile site uses the same domain

### 2. **Maps JavaScript API Not Enabled**

**Problem:** The Maps JavaScript API is not enabled for your project.

**Solution:**
1. Go to [Google Cloud Console APIs](https://console.cloud.google.com/google/maps-apis/apis)
2. Search for "Maps JavaScript API"
3. Click "Enable" if it's not already enabled
4. Wait a few minutes for changes to propagate

### 3. **Billing Not Enabled**

**Problem:** Google Maps Platform requires billing to be enabled, even for free tier usage.

**Solution:**
1. Go to [Google Cloud Console Billing](https://console.cloud.google.com/billing)
2. Link a billing account to your project
3. Note: Google provides $200/month free credit for Maps usage

### 4. **Environment Variable Not Set in Production**

**Problem:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is not set in your production environment (Vercel, Netlify, etc.).

**Solution:**
1. **For Vercel:**
   - Go to your project settings → Environment Variables
   - Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` with your API key value
   - Ensure it's set for "Production" environment
   - Redeploy your application

2. **For Other Platforms:**
   - Check your hosting platform's environment variable settings
   - Ensure the variable name is exactly `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Redeploy after adding the variable

### 5. **API Key Quota Exceeded**

**Problem:** You've exceeded your API usage quota.

**Solution:**
1. Check [Google Cloud Console Quotas](https://console.cloud.google.com/google/maps-apis/quotas)
2. Review your usage
3. Increase quotas if needed or wait for reset

### 6. **Mobile Browser Caching Issues**

**Problem:** Mobile browser cached an old version without the API key.

**Solution:**
1. Clear browser cache on mobile device
2. Try incognito/private browsing mode
3. Hard refresh: iOS Safari (hold refresh button), Android Chrome (menu → clear cache)

## Step-by-Step Debugging

### Step 1: Verify API Key is Available
1. Open your site on mobile device
2. Open browser developer tools (if possible) or use remote debugging
3. Check console for errors
4. Look for messages about API key

### Step 2: Check API Key Restrictions
1. In Google Cloud Console, go to your API key
2. Review "Application restrictions"
3. For mobile, consider:
   - Using "None" temporarily to test (not recommended for production)
   - Or ensuring your mobile domain is in the allowed list

### Step 3: Test API Key Directly
Test your API key with a direct request:
```
https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap
```

If this fails, the issue is with the API key configuration.

### Step 4: Check Network Tab
1. On mobile device, open browser dev tools (use remote debugging)
2. Go to Network tab
3. Look for requests to `maps.googleapis.com`
4. Check if they're failing (red status)
5. Review error messages in response

### Step 5: Verify Environment Variable
1. Check your production build logs
2. Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is present during build
3. In Next.js, `NEXT_PUBLIC_` variables are embedded at build time
4. If missing, rebuild after adding the variable

## Mobile-Specific Considerations

### iOS Safari
- May have stricter security policies
- Ensure HTTPS is used (required for Google Maps)
- Check if content blockers are interfering

### Android Chrome
- Check if data saver mode is blocking scripts
- Verify JavaScript is enabled
- Check for ad blockers interfering

### Responsive Design
- Ensure map container has proper dimensions
- Check CSS isn't hiding the map on mobile
- Verify viewport meta tag is correct

## Quick Fix Checklist

- [ ] API key is set in production environment variables
- [ ] Maps JavaScript API is enabled
- [ ] Billing is enabled on Google Cloud project
- [ ] API key restrictions allow your production domain
- [ ] API key restrictions allow mobile browsers/user agents
- [ ] Site is served over HTTPS (required for Google Maps)
- [ ] No ad blockers or content blockers interfering
- [ ] Browser cache cleared on mobile device
- [ ] Application rebuilt/redeployed after adding API key

## Testing on Mobile

### Remote Debugging
1. **Chrome DevTools (Android):**
   - Connect Android device via USB
   - Enable USB debugging
   - Open `chrome://inspect` in desktop Chrome
   - Select your device and inspect

2. **Safari Web Inspector (iOS):**
   - Enable Web Inspector in iOS Settings → Safari → Advanced
   - Connect to Mac
   - Open Safari → Develop → [Your Device] → [Your Site]

### Alternative Testing
- Use browser emulation in desktop Chrome DevTools
- Test on multiple mobile devices/browsers
- Use services like BrowserStack for cross-device testing

## Still Not Working?

1. **Check Error Messages:**
   - Look at browser console on mobile device
   - Check network requests to Google Maps API
   - Review error responses

2. **Verify API Key Status:**
   - Go to Google Cloud Console
   - Check if API key is restricted or has issues
   - Verify API key hasn't been deleted or regenerated

3. **Test with Minimal Restrictions:**
   - Temporarily remove API key restrictions
   - Test if map loads
   - If it works, gradually add restrictions back

4. **Contact Support:**
   - Check Google Maps Platform status page
   - Review Google Maps Platform documentation
   - Contact Google Cloud Support if needed

## Prevention

To prevent this issue in the future:

1. **Set up API key restrictions properly from the start:**
   - Include both desktop and mobile domains
   - Use wildcards for subdomains
   - Test on mobile devices during development

2. **Monitor API usage:**
   - Set up alerts in Google Cloud Console
   - Monitor quota usage
   - Review error logs regularly

3. **Document your setup:**
   - Keep track of API key restrictions
   - Document environment variable setup
   - Note any mobile-specific configurations

