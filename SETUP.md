# Complete Setup Guide
## JB Technologies Local Directory ("The Lead Engine")

This guide will help you set up the complete project from scratch.

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- API keys for:
  - OpenAI (for content generation)
  - Google Maps (for static maps)
  - Zoho CRM (for lead routing)

---

## Step 1: Install Dependencies

```bash
npm install
```

---

## Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your API keys:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key-here
   ZOHO_WEBHOOK_URL=https://your-webhook-url.com
   ZOHO_MAZZY_ID=Mazzy_ID
   ZOHO_PRESTON_ID=Preston_Brown_ID
   NEXT_PUBLIC_BASE_URL=https://jbtech.com
   ```

---

## Step 3: Load City Data

You have three options for loading city data:

### Option A: Use Sample Data (Quick Start)
The project includes 10 sample cities for testing. No action needed.

### Option B: Generate Sample Cities
Generate a larger sample dataset:
```bash
npm run generate-city-data -- --count=50 --output=data/cities.json
```
This generates 50 cities per state (2,500 total).

### Option C: Import Real City Data
1. Prepare your city data in JSON or CSV format matching the City interface:
   ```json
   [
     {
       "name": "Atlanta",
       "state": "Georgia",
       "stateAbbr": "GA",
       "latitude": 33.749,
       "longitude": -84.388,
       "population": 498715,
       "areaCode": "404",
       "majorLandmark": "Ponce City Market",
       "neighboringTowns": ["Sandy Springs", "Roswell"],
       "zipCodes": ["30301", "30302"]
     }
   ]
   ```

2. Import the data:
   ```bash
   # For JSON files
   npm run import-cities -- --file=data/your-cities.json --format=json
   
   # For CSV files
   npm run import-cities -- --file=data/your-cities.csv --format=csv
   ```

### Option D: Use Sanity CMS
1. Set up a Sanity project at https://sanity.io
2. Configure Sanity environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
   SANITY_API_TOKEN=your-token
   ```
3. Create a "city" schema in Sanity matching the City interface
4. Import your cities into Sanity

---

## Step 4: Test the Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see the site.

Test pages:
- Home: http://localhost:3000
- State Hub: http://localhost:3000/georgia-network-cabling
- City Page: http://localhost:3000/georgia/atlanta-network-cabling

---

## Step 5: Generate Content (Optional)

If you want to pre-generate AI content for all cities:

```bash
npm run generate
```

**Note:** This will make API calls to OpenAI for each city. Ensure your API key is configured and you have sufficient credits.

---

## Step 6: Build for Production

```bash
npm run build
```

This will:
- Generate static pages for all cities
- Create sitemaps
- Optimize assets
- Verify all routes

**Note:** For 5,000+ cities, the build may take 30-60 minutes depending on your system and API rate limits.

---

## Step 7: Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

The site will automatically:
- Build all static pages
- Generate sitemaps
- Deploy to production

---

## Verification Checklist

After setup, verify:

- [ ] Environment variables are set
- [ ] City data is loaded (check `data/cities.json` or Sanity)
- [ ] Development server runs without errors
- [ ] State hub pages load (e.g., `/georgia-network-cabling`)
- [ ] City pages load (e.g., `/georgia/atlanta-network-cabling`)
- [ ] Lead form submits successfully
- [ ] Zoho webhook receives leads
- [ ] Google Maps display correctly
- [ ] OG images generate correctly
- [ ] Sitemaps are accessible (`/sitemap.xml`, `/sitemap-index`)

---

## Troubleshooting

### Build Fails with "Too Many Pages"
- Reduce the number of cities in development mode
- Use `generateStaticParams` to limit pages in dev

### OpenAI API Errors
- Check your API key is correct
- Verify you have sufficient credits
- Content will fall back to template content if API fails

### Google Maps Not Showing
- Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- Check API key has Static Maps API enabled
- Verify billing is enabled in Google Cloud Console

### Zoho Webhook Not Receiving Leads
- Verify webhook URL is correct
- Check Zoho webhook configuration
- Review server logs for errors

### City Data Not Loading
- Verify JSON file format matches City interface
- Check file path is correct
- Ensure Sanity credentials are correct if using CMS

---

## Next Steps

1. **Add Real City Data**: Replace sample data with your 5,000+ city dataset
2. **Customize Content**: Adjust prompts in `lib/content-generator.ts`
3. **Configure Lead Routing**: Update owner IDs in `.env.local`
4. **Optimize SEO**: Review and customize schema markup in `lib/schema.ts`
5. **Monitor Performance**: Use Vercel Analytics and Lighthouse

---

## Support

For issues or questions:
1. Check the documentation in `/README.md`
2. Review `REQUIREMENTS_COMPLIANCE_REPORT.md` for feature details
3. Check `PROJECT_SUMMARY.md` for implementation overview

---

**Last Updated:** December 2025

