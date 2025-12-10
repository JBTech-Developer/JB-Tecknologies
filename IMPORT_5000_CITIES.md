# Importing 5,000+ Cities Guide

This guide explains how to import 5,000+ cities with all required data (including county and zip codes) for programmatic page generation.

## Required Data Fields

Every city in your database **MUST** include:

- `name` (string) - City name
- `state` (string) - Full state name (e.g., "Georgia")
- `stateAbbr` (string) - 2-letter state abbreviation (e.g., "GA")
- `latitude` (number) - Latitude coordinate (-90 to 90)
- `longitude` (number) - Longitude coordinate (-180 to 180)
- `population` (number) - Population count
- `county` (string) - **REQUIRED** - County name (e.g., "Fulton")
- `zipCodes` (string[]) - **REQUIRED** - Array with at least one zip code (e.g., ["30301", "30302"])
- `areaCode` (string, optional) - Primary area code
- `majorLandmark` (string, optional) - Famous landmark
- `neighboringTowns` (string[], optional) - Nearby cities

## Data Sources

### Option 1: US Census Bureau Data

The US Census Bureau provides comprehensive city data:

1. **Census Places**: Download from [Census.gov](https://www.census.gov/data/tables/time-series/demo/popest/2020s-total-cities-and-towns.html)
2. **ZIP Code Database**: Use [ZIP Code Database](https://www.unitedstateszipcodes.org/zip-code-database/) or [Geonames](https://www.geonames.org/)
3. **County Data**: Cross-reference with [Census County Data](https://www.census.gov/data/tables/time-series/demo/popest/2020s-counties-total.html)

### Option 2: Geonames Database

Geonames provides comprehensive worldwide data:

1. Download US cities: `http://download.geonames.org/export/dump/US.zip`
2. Parse the `US.txt` file which includes:
   - City names
   - Coordinates
   - Population
   - Admin codes (state/county)

### Option 3: Commercial APIs

- **Google Places API**: Can provide city data with coordinates
- **OpenStreetMap Overpass API**: Free, comprehensive city data
- **SimpleMaps**: Provides city databases with county and zip code data

### Option 4: Combine Multiple Sources

1. **Base city data**: From Census or Geonames (name, coordinates, population)
2. **County data**: Cross-reference with Census county boundaries
3. **ZIP codes**: Use ZIP code database to match cities to zip codes

## Data Format

Your `data/cities.json` file should be an array of city objects:

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
    "areaCode": "404",
    "majorLandmark": "Ponce City Market",
    "neighboringTowns": ["Sandy Springs", "Roswell", "Alpharetta"],
    "zipCodes": ["30301", "30302", "30303", "30304", "30305"]
  }
]
```

## Import Scripts

### Using the Built-in Import Script

```bash
# Import from CSV
npm run import-cities -- --file=data/cities.csv --format=csv --output=data/cities.json

# Import from JSON
npm run import-cities -- --file=data/cities.json --format=json
```

### CSV Format

If importing from CSV, use this format:

```csv
name,state,stateAbbr,latitude,longitude,population,county,areaCode,majorLandmark,neighboringTowns,zipCodes
Atlanta,Georgia,GA,33.749,-84.388,498715,Fulton,404,Ponce City Market,"Sandy Springs;Roswell;Alpharetta","30301;30302;30303"
```

**Note**: Arrays (neighboringTowns, zipCodes) should be semicolon-separated in CSV.

## Python Script Example

Here's a Python script to help you build the cities.json file from multiple sources:

```python
import json
import csv
from typing import List, Dict

def build_cities_json():
    """
    Example function to build cities.json from your data sources.
    Replace with your actual data fetching logic.
    """
    cities = []
    
    # Example: Reading from a CSV file
    with open('source_data.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            city = {
                "name": row['city_name'],
                "state": row['state_name'],
                "stateAbbr": row['state_abbr'],
                "latitude": float(row['lat']),
                "longitude": float(row['lon']),
                "population": int(row['population']),
                "county": row['county'],  # CRITICAL: Must include county
                "zipCodes": row['zip_codes'].split(';'),  # CRITICAL: Must include zip codes
                "areaCode": row.get('area_code', ''),
                "majorLandmark": row.get('landmark', ''),
                "neighboringTowns": row.get('neighbors', '').split(';') if row.get('neighbors') else []
            }
            cities.append(city)
    
    # Write to JSON file
    with open('data/cities.json', 'w') as f:
        json.dump(cities, f, indent=2)
    
    print(f"Imported {len(cities)} cities")

if __name__ == '__main__':
    build_cities_json()
```

## Validation

After importing, validate your data:

```bash
npm run verify-build
```

This will check:
- All required fields are present
- Coordinates are valid
- County and zipCodes are included
- Data structure is correct

## Important Notes

1. **County is REQUIRED**: The intro text template uses `{County}` - without it, pages will fail validation
2. **Zip Codes are REQUIRED**: At least one zip code must be provided per city
3. **Coordinates are REQUIRED**: Used for calculating nearby cities and displaying maps
4. **Unique Content**: Each page uses city name, county, and zip code to create unique content - ensure these are accurate

## Testing with Sample Data

Before importing 5,000+ cities, test with a small subset:

1. Create `data/cities-test.json` with 10-20 cities
2. Verify pages generate correctly
3. Check that intro text includes county and zip code
4. Verify nearby cities sidebar shows 5 closest cities
5. Confirm Cloudinary images generate with city names

## Production Build

When ready to build with 5,000+ cities:

1. Ensure `data/cities.json` contains all cities with required fields
2. Run `npm run build` - this will generate all static pages
3. Build time will be longer with 5,000+ pages (expect 10-30 minutes)
4. Deploy the built site

## Troubleshooting

### "County is missing" error
- Ensure every city object includes a `county` field
- Check your import script is mapping county data correctly

### "zipCodes must be an array" error
- Ensure zipCodes is an array: `["30301", "30302"]`
- Not a string: `"30301,30302"` ❌

### Pages showing 404
- Verify `generateStaticParams()` is loading cities correctly
- Check that city slugs match the URL pattern: `/{state}/{city}-network-cabling`
- Ensure city names don't have special characters that break URL encoding

### Nearby cities not showing
- Verify coordinates (latitude/longitude) are correct
- Check that `getNearbyCities()` function has access to all cities
- Ensure at least 5 cities exist in the database


