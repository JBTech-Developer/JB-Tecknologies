# Quick Start Guide - Get Your Site Live

## 🎯 What You Need to Do (In Order)

### Step 1: Import Your City Data ⚠️ MOST IMPORTANT

**Create**: `data/cities.json`

This file must contain an array of 5,000+ cities. Each city needs:

```json
[
  {
    "name": "Atlanta",
    "state": "Georgia",
    "stateAbbr": "GA",
    "latitude": 33.749,
    "longitude": -84.388,
    "population": 498715,
    "county": "Fulton",
    "zipCodes": ["30301", "30302", "30303"],
    "areaCode": "404",
    "majorLandmark": "Ponce City Market",
    "neighboringTowns": ["Sandy Springs", "Roswell", "Alpharetta"]
  }
]
```

**Where to get data**:
- See `IMPORT_5000_CITIES.md` for detailed sources
- Quick options:
  - **SimpleMaps**: https://simplemaps.com/data/us-cities (paid, includes county/zip)
  - **Geonames**: Free but requires processing
  - **Census Bureau**: Free but requires data processing

**Validation**:
```bash
npm run verify-build
```

### Step 2: Test Locally

```bash
npm run dev
```

Visit:
- `http://localhost:3000/georgia/network-cabling` (state page)
- `http://localhost:3000/georgia/atlanta/voice-data-cabling-installers` (service page)

**What to check**:
- ✅ Page loads with content (not just header/footer)
- ✅ Services grid shows all 30 services
- ✅ Cities grid shows cities
- ✅ Intro text includes city name, county, and zip code
- ✅ Forms work

### Step 3: Build for Production

```bash
npm run build
```

**Time**: 60-120 minutes for 5,000 cities × 30 services = 150,000 pages

**If build fails**:
- Check `data/cities.json` format
- Ensure all cities have `county` and `zipCodes`
- Run `npm run verify-build` first

### Step 4: Deploy

Deploy the `.next` folder to your hosting platform.

## 📋 Current Status

✅ **Working**:
- 30 services configured
- Page templates ready
- Routing fixed
- Forms working
- Dynamic content generation

⚠️ **Needs Your Data**:
- `data/cities.json` with 5,000+ cities (with county + zipCodes)

## 🚀 Expected Results

Once you add your city data:
- **150,000 pages** will be generated automatically
- Each page will have unique content
- All links will work
- SEO-optimized with schema markup

## 📞 Quick Checklist

- [ ] Create `data/cities.json` with 5,000+ cities
- [ ] Ensure every city has `county` field
- [ ] Ensure every city has `zipCodes` array (at least one zip)
- [ ] Run `npm run verify-build` to validate
- [ ] Test locally with `npm run dev`
- [ ] Build with `npm run build`
- [ ] Deploy

That's it! The system does the rest automatically.

