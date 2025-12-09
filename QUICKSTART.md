# Quick Start Guide

## Day 1: Setup & Structure ✅

The project skeleton is complete with:
- ✅ Next.js 14+ App Router configured
- ✅ shadcn/ui components installed
- ✅ Dynamic routing structure (`[state]/[city]`)
- ✅ City database structure (sample data included)
- ✅ Header, Footer, and global layout

## Day 2: Template & Form ✅

The master template is ready:
- ✅ City page template with content sections
- ✅ Lead form component (desktop sticky sidebar)
- ✅ Mobile sticky button for form
- ✅ Zoho CRM webhook API route
- ✅ Lead routing logic (Mazzy vs Preston)

## Day 3: Intelligence ✅

Content generation is set up:
- ✅ OpenAI integration (with fallback)
- ✅ JSON-LD schema markup
- ✅ Nearby cities widget (Haversine)
- ✅ Google Maps Static API integration
- ✅ Dynamic OG image generation

## Day 4: Ready for Launch ✅

- ✅ Sitemap generation
- ✅ Robots.txt
- ✅ Build scripts
- ✅ Documentation

## Next Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Environment Variables**:
   Create `.env.local`:
   ```env
   OPENAI_API_KEY=sk-...
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
   ZOHO_WEBHOOK_URL=https://...
   ZOHO_MAZZY_ID=...
   ZOHO_PRESTON_ID=...
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Add Full City Database**:
   - Replace `lib/cities.ts` with your 5,000+ city dataset
   - Or use `loadCitiesFromJSON()` to load from a JSON file

4. **Test Locally**:
   ```bash
   npm run dev
   ```
   Visit: http://localhost:3000/georgia/atlanta-network-cabling

5. **Build & Deploy**:
   ```bash
   npm run build
   ```
   Then deploy to Vercel

## Testing Checklist

- [ ] State hub page loads (`/georgia-network-cabling`)
- [ ] City page loads (`/georgia/atlanta-network-cabling`)
- [ ] Form submits successfully
- [ ] Lead routes correctly (test small vs enterprise)
- [ ] Maps display (if API key set)
- [ ] Schema markup present in page source
- [ ] Mobile form button works
- [ ] Nearby cities widget shows related cities

## Key Files to Customize

- `lib/cities.ts` - Add your full city database
- `components/Header.tsx` - Customize navigation
- `components/Footer.tsx` - Add your contact info
- `app/api/leads/route.ts` - Adjust Zoho field mappings
- `lib/content-generator.ts` - Customize AI prompts

## Performance Tips

- Pages are statically generated at build time
- Images use Next.js Image optimization
- Maps use Google Static API (no JS required)
- Form submissions are server-side only

## Support

See `DEPLOYMENT.md` for detailed deployment instructions.
See `README.md` for full project documentation.

