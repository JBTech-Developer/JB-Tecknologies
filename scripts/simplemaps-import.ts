/**
 * SimpleMaps US Cities → Filtered JSON
 *
 * This script converts the SimpleMaps US Cities CSV into a filtered JSON file.
 * It enforces:
 *  - Input:  data/uscities.csv      (SimpleMaps Basic CSV)
 *  - Filter: population > 3000
 *  - Output: data/cities-simplemaps.json in the spec shape:
 *      {
 *        "city": "Atlanta",
 *        "state_name": "Georgia",
 *        "state_id": "GA",
 *        "slug": "atlanta",
 *        "lat": 33.7490,
 *        "lng": -84.3880,
 *        "zip": "30303",
 *        "population": 498715
 *      }
 *
 * Usage:
 *   npm run simplemaps-import
 */

import fs from 'fs';
import path from 'path';

interface SimpleMapsCity {
  city: string;
  state_name: string;
  state_id: string;
  lat: number;
  lng: number;
  population: number;
  zip: string;
}

function slugifyCity(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function parseSimpleMapsCSV(csvContent: string): SimpleMapsCity[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  const cities: SimpleMapsCity[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    const values = rawLine.split(',').map(v => v.trim());
    const record: any = {};

    headers.forEach((header, index) => {
      const value = values[index];
      if (header === 'city') record.city = value;
      else if (header === 'state_name') record.state_name = value;
      else if (header === 'state_id') record.state_id = value;
      else if (header === 'lat') record.lat = parseFloat(value);
      else if (header === 'lng') record.lng = parseFloat(value);
      else if (header === 'population') record.population = parseInt(value, 10);
      else if (header === 'zips') {
        // SimpleMaps "zips" is space-separated list; pick the first as primary zip
        record.zip = value.split(/[; ]+/)[0];
      }
    });

    if (
      record.city &&
      record.state_name &&
      record.state_id &&
      typeof record.lat === 'number' &&
      !Number.isNaN(record.lat) &&
      typeof record.lng === 'number' &&
      !Number.isNaN(record.lng) &&
      typeof record.population === 'number' &&
      record.population > 3000
    ) {
      if (!record.zip) {
        record.zip = '';
      }
      cities.push({
        city: record.city,
        state_name: record.state_name,
        state_id: record.state_id,
        lat: record.lat,
        lng: record.lng,
        population: record.population,
        zip: record.zip,
      });
    }
  }

  return cities;
}

async function main() {
  const inputPath = path.join(process.cwd(), 'data', 'uscities.csv');
  const outputPath = path.join(process.cwd(), 'data', 'cities-simplemaps.json');

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`);
    console.error('   Please download the SimpleMaps US Cities CSV and save it as data/uscities.csv');
    process.exit(1);
  }

  console.log('📥 Reading SimpleMaps CSV:', inputPath);
  const csvContent = fs.readFileSync(inputPath, 'utf-8');

  const allCities = parseSimpleMapsCSV(csvContent);
  console.log(`🔎 Parsed ${allCities.length.toLocaleString()} cities with population > 3,000`);

  // Add slug field and sort by population desc
  const finalData = allCities
    .map(c => ({
      ...c,
      slug: slugifyCity(c.city),
    }))
    .sort((a, b) => b.population - a.population);

  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));

  console.log(`✅ Wrote ${finalData.length.toLocaleString()} cities to ${outputPath}`);

  if (finalData.length > 0) {
    console.log('\n📌 Example entries:');
    console.log(JSON.stringify(finalData.slice(0, 3), null, 2));
  }

  console.log('\nNext steps:');
  console.log('- If you want this to drive page generation directly, point your loader/router at data/cities-simplemaps.json');
}

main().catch(err => {
  console.error('❌ simplemaps-import failed:', err);
  process.exit(1);
});


