# Fix InvalidKeyMapError - Quick Guide

## The Error
```
Google Maps JavaScript API error: InvalidKeyMapError
Google Maps JavaScript API warning: InvalidKey
```

This means your Google Maps API key is **invalid** or **misconfigured**.

## Step-by-Step Fix

### Step 1: Verify Your API Key is Complete
Your API key should:
- Start with `AIza` (Google API keys always start with this)
- Be about 39 characters long
- Look like: `AIzaSyCAJpw1dBhF4PDdapBHi_sVpDli4aPsUH8AI`

**If your key doesn't start with `AIza`, it's incomplete or wrong!**

### Step 2: Get/Create a Valid API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Go to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **API key**
5. Copy the **full** API key (it should start with `AIza`)

### Step 3: Enable Required APIs

Your API key needs these APIs enabled:

1. Go to [APIs & Services](https://console.cloud.google.com/google/maps-apis/apis) → **Library**
2. Search for and **Enable**:
   - ✅ **Maps JavaScript API** (REQUIRED)
   - ✅ **Geocoding API** (if using address lookups)
   - ✅ **Places API** (if using places)

### Step 4: Enable Billing

Google Maps requires billing to be enabled (even for free tier):

1. Go to [Billing](https://console.cloud.google.com/billing)
2. Link a billing account to your project
3. Note: Google provides $200/month free credit

### Step 5: Update Your Environment Variables

**Local (.env.local):**
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCAJpw1dBhF4PDdapBHi_sVpDli4aPsUH8AI
```
(Replace with your **full** API key starting with `AIza`)

**Vercel:**
1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` with your **full** API key
3. **Redeploy** your application

### Step 6: Configure API Key Restrictions (Optional but Recommended)

1. In Google Cloud Console → **Credentials** → Click your API key
2. Under **Application restrictions**:
   - Choose **HTTP referrers (web sites)**
   - Add your domains:
     - `http://localhost:3000/*` (for local dev)
     - `https://yourdomain.com/*` (for production)
     - `https://*.vercel.app/*` (if using Vercel)
3. Under **API restrictions**:
   - Choose **Restrict key**
   - Select: **Maps JavaScript API**
4. Click **Save**

### Step 7: Test Your API Key

Test your key directly in browser:
```
https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap
```

If you see an error, the key is invalid or APIs aren't enabled.

## Common Mistakes

❌ **Truncated API key** - Make sure you copied the entire key (starts with `AIza`)  
❌ **Wrong API key** - Using a key from a different project  
❌ **Maps JavaScript API not enabled** - Must enable this API  
❌ **Billing not enabled** - Required even for free tier  
❌ **API restrictions too strict** - Temporarily remove restrictions to test  

## Still Not Working?

1. **Check Google Cloud Console**:
   - Verify API key exists and is active
   - Check if any APIs are disabled
   - Review quota/usage limits

2. **Check Browser Console**:
   - Look for specific error messages
   - Check network tab for failed requests to `maps.googleapis.com`

3. **Test with Minimal Restrictions**:
   - Temporarily remove all API key restrictions
   - Test if map loads
   - If it works, gradually add restrictions back

4. **Verify Environment Variable**:
   - Make sure variable name is exactly `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - No extra spaces or quotes
   - Redeploy after changing

## Quick Checklist

- [ ] API key starts with `AIza` and is complete
- [ ] Maps JavaScript API is enabled
- [ ] Billing is enabled on Google Cloud project
- [ ] API key is set in `.env.local` (local) and Vercel (production)
- [ ] Application rebuilt/redeployed after adding key
- [ ] API key restrictions allow your domain (or temporarily removed for testing)

