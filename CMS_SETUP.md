# CMS Integration Setup Guide

This project supports **Sanity.io** as a headless CMS for managing city data. The system automatically falls back to JSON files if Sanity is not configured.

## Option 1: Using Sanity.io CMS (Recommended)

### Step 1: Install Sanity CLI

```bash
npm install -g @sanity/cli
```

### Step 2: Initialize Sanity Project

```bash
sanity init
```

Follow the prompts:
- Choose "Create new project"
- Enter project name: `jb-tech-directory`
- Choose dataset: `production`
- Choose project template: `Clean project with no predefined schemas`

### Step 3: Create City Schema

1. Navigate to your Sanity studio directory (usually `studio/` or `sanity-studio/`)
2. Create `schemas/city.ts` file
3. Copy the schema from `sanity/schemas/city.ts` in this project

### Step 4: Deploy Schema

```bash
cd studio  # or sanity-studio
sanity deploy
```

### Step 5: Configure Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### Step 6: Import Cities to Sanity

You can import cities using the Sanity CLI or through the Sanity Studio interface:

```bash
# Using Sanity CLI
sanity dataset import data/cities.json production
```

Or manually add cities through the Sanity Studio at `https://your-project.sanity.studio`

## Option 2: Using JSON Files (Fallback)

If you don't want to use Sanity, the project automatically uses JSON files:

1. Place your cities data in `data/cities.json`
2. Format: Array of City objects (see `data/cities-example.json`)

### Import Cities from CSV/JSON

Use the import script to convert CSV or JSON files:

```bash
# Import from CSV
npm run import-cities -- --file=data/cities.csv --format=csv

# Import from JSON
npm run import-cities -- --file=data/cities.json --format=json

# Specify output location
npm run import-cities -- --file=data/cities.csv --format=csv --output=data/cities.json
```

### CSV Format Example

```csv
name,state,stateAbbr,latitude,longitude,population,areaCode,majorLandmark,neighboringTowns,zipCodes
Atlanta,Georgia,GA,33.749,-84.388,498715,404,Ponce City Market,"Sandy Springs;Roswell;Alpharetta","30301;30302;30303"
```

## Data Loading Priority

The system loads cities in this order:

1. **Sanity CMS** (if `NEXT_PUBLIC_SANITY_PROJECT_ID` is set)
2. **JSON File** (`data/cities.json` if exists)
3. **Fallback** (sample cities in code)

## City Data Structure

```typescript
interface City {
  name: string;                    // Required: City name
  state: string;                    // Required: Full state name
  stateAbbr: string;                // Required: State abbreviation (2 letters)
  latitude: number;                 // Required: Latitude (-90 to 90)
  longitude: number;                // Required: Longitude (-180 to 180)
  population: number;               // Required: Population count
  county: string;                   // Required: County name (for dynamic content)
  zipCodes: string[];              // Required: Array with at least one zip code
  areaCode?: string;                // Optional: Primary area code
  majorLandmark?: string;           // Optional: Famous landmark
  neighboringTowns?: string[];     // Optional: Nearby cities
}
```

**Critical Requirements:**
- `county` is **REQUIRED** - Used in intro text template: "surrounding {County} region"
- `zipCodes` is **REQUIRED** - Must be an array with at least one zip code
- These fields ensure unique content on every page (prevents Google penalties)

## WordPress/WPGraphQL Alternative

If you prefer WordPress with WPGraphQL:

1. Install WordPress with WPGraphQL plugin
2. Create a custom post type `city` with the required fields
3. Create `lib/wordpress.ts` similar to `lib/sanity.ts`
4. Update `lib/cities.ts` to fetch from WordPress instead

The architecture supports this - just replace the Sanity client with a WordPress GraphQL client.

## Troubleshooting

### Cities not loading from Sanity

1. Check environment variables are set correctly
2. Verify Sanity project ID and dataset name
3. Check browser console for errors
4. Ensure cities are published in Sanity (not drafts)

### Build fails with too many cities

If you have 5,000+ cities, the build might take a while. Consider:
- Using incremental static regeneration (ISR)
- Building in chunks
- Using a CDN for city data

### Content generation errors

If OpenAI API fails:
- The system automatically falls back to template content
- Check `OPENAI_API_KEY` is set correctly
- Verify API quota/billing

