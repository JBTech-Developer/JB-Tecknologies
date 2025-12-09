# JB Technologies Local Directory ("The Lead Engine")

A high-performance, programmatic SEO engine that generates thousands of "City + Service" landing pages for network cabling services.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Rendering**: Static Site Generation (SSG)
- **Styling**: Tailwind CSS + shadcn/ui
- **Content Generation**: OpenAI API
- **Maps**: Google Maps Static API
- **CRM Integration**: Zoho CRM Webhooks
- **Hosting**: Vercel (recommended)

## Project Structure

```
├── app/
│   ├── [state]/              # State hub pages
│   │   └── [city]/           # City spoke pages
│   ├── api/
│   │   ├── leads/            # Zoho CRM webhook endpoint
│   │   └── og/               # Dynamic OG image generation
│   ├── layout.tsx
│   ├── page.tsx
│   └── sitemap.ts
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── LeadForm.tsx
├── lib/
│   ├── cities.ts             # City database & utilities
│   ├── content-generator.ts  # OpenAI content generation
│   ├── maps.ts               # Google Maps integration
│   ├── schema.ts             # JSON-LD schema markup
│   └── types.ts
└── scripts/
    └── generate-pages.ts     # Build script for content generation
```

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Load city data** (choose one):
   - Use sample data (already included)
   - Generate sample cities: `npm run generate-city-data -- --count=50`
   - Import your data: `npm run import-cities -- --file=data/cities.json --format=json`

4. **Verify setup**:
   ```bash
   npm run verify-build
   ```

5. **Run development server**:
   ```bash
   npm run dev
   ```

6. **Build for production**:
   ```bash
   npm run build
   ```

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## Features

### Dynamic Routing
- State Hub: `/georgia-network-cabling`
- City Spoke: `/georgia/atlanta-network-cabling`

### Lead Routing Logic
- **Small Business** (1-10 or 11-50 drops) → Routes to Mazzy (SDR)
- **Enterprise** (51-200+ drops or Warehouse) → Routes to Preston (Account Executive)

### SEO Features
- JSON-LD schema markup (ProfessionalService)
- Dynamic OG images
- Google Maps integration
- Nearby cities widget (Haversine distance)
- Programmatic content generation

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The site will automatically generate static pages for all cities during build time.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Pre-generate AI content for all cities
- `npm run import-cities` - Import cities from CSV/JSON
- `npm run generate-city-data` - Generate sample city data
- `npm run verify-build` - Verify project is ready for build

## Notes

- **City Database**: Currently includes 10 sample cities. Load your 5,000+ city dataset using:
  - `npm run import-cities` for CSV/JSON files
  - Sanity CMS (configure in `.env.local`)
  - `npm run generate-city-data` for sample data
- **OpenAI API**: Optional - fallback content will be used if not configured
- **Google Maps**: Requires API key for map display
- **Zoho Webhook**: Must be configured for lead routing

## Documentation

- [SETUP.md](./SETUP.md) - Complete setup guide
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Implementation overview
- [REQUIREMENTS_COMPLIANCE_REPORT.md](./REQUIREMENTS_COMPLIANCE_REPORT.md) - Feature compliance

