# Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure all environment variables are set in your Vercel project:
- `OPENAI_API_KEY` - For content generation (optional but recommended)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - For map displays
- `ZOHO_WEBHOOK_URL` - Your Zoho CRM webhook endpoint
- `ZOHO_MAZZY_ID` - Mazzy's Zoho user ID
- `ZOHO_PRESTON_ID` - Preston's Zoho user ID
- `NEXT_PUBLIC_BASE_URL` - Your production domain (e.g., https://jbtech.com)

### 2. City Database
Replace `lib/cities.ts` with your full 5,000+ city dataset. You can:
- Use the `loadCitiesFromJSON()` utility to load from a JSON file
- Or directly import your city data array

### 3. Google Maps API Setup
1. Create a project in Google Cloud Console
2. Enable Maps Static API
3. Create an API key
4. Restrict the key to your domain
5. Add to environment variables

### 4. Zoho CRM Webhook Setup
1. Create a webhook in Zoho CRM
2. Map the following fields:
   - First_Name → First Name
   - Last_Name → Last Name
   - Company → Company Name
   - Email → Email
   - Phone → Phone
   - Drop_Count → Custom Field
   - Facility_Type → Custom Field
   - City → City
   - State → State
   - Owner → Owner (routed based on lead type)
   - Tag → Tag
   - Priority → Priority

### 5. OpenAI API (Optional)
If using OpenAI for content generation:
1. Create an OpenAI account
2. Generate an API key
3. Add to environment variables
4. Monitor usage and costs

## Vercel Deployment Steps

1. **Connect Repository**
   ```bash
   vercel init
   ```

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables

4. **Deploy**
   ```bash
   vercel --prod
   ```

## Post-Deployment

### 1. Verify Static Generation
Check that all city pages are generated:
- Visit `/georgia/atlanta-network-cabling`
- Check page source for static HTML
- Verify JSON-LD schema is present

### 2. Test Lead Routing
1. Submit a form with 1-10 drops → Should route to Mazzy
2. Submit a form with 200+ drops → Should route to Preston
3. Submit a form with Warehouse → Should route to Preston

### 3. Submit Sitemap
1. Go to Google Search Console
2. Submit `https://yourdomain.com/sitemap.xml`
3. Monitor indexing status

### 4. Performance Check
Run Lighthouse audit:
- Performance should be 90+
- SEO should be 100
- Accessibility should be 90+

## Troubleshooting

### Pages Not Generating
- Check `generateStaticParams()` includes all cities
- Verify city data is loaded correctly
- Check build logs for errors

### Maps Not Showing
- Verify Google Maps API key is set
- Check API key restrictions
- Verify billing is enabled in Google Cloud

### Leads Not Routing
- Check Zoho webhook URL
- Verify webhook is receiving requests
- Check Zoho field mappings
- Review API route logs

### Content Not Generating
- Check OpenAI API key
- Verify API credits available
- Check content-generator.ts for errors
- Fallback content should still work

