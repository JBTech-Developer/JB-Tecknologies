/**
 * Import City Populations from CSV
 * 
 * This script allows you to import city population data from a CSV file
 * and update cities.json with accurate populations.
 * 
 * CSV Format:
 *   city_name,state_abbr,population
 *   Atlanta,GA,498715
 *   New York,NY,8478072
 * 
 * Usage:
 *   tsx scripts/import-city-populations.ts --file=data/city-populations.csv
 */

import fs from 'fs';
import path from 'path';
import { City } from '../lib/types';

interface ImportOptions {
  file: string;
  dryRun?: boolean;
}

function parseCSV(filePath: string): Map<string, number> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  const populationMap = new Map<string, number>();
  
  // Skip header if present
  const startIndex = lines[0].toLowerCase().includes('city') ? 1 : 0;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line (handles quoted values)
    const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
    
    if (parts.length >= 3) {
      const cityName = parts[0].toLowerCase().trim();
      const stateAbbr = parts[1].toUpperCase().trim();
      const population = parseInt(parts[2], 10);
      
      if (cityName && stateAbbr && !isNaN(population)) {
        const key = `${cityName},${stateAbbr}`;
        populationMap.set(key, population);
      }
    }
  }
  
  return populationMap;
}

async function importCityPopulations(options: ImportOptions) {
  console.log('🚀 Starting city population import...\n');
  
  const filePath = path.join(process.cwd(), options.file);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found: ${filePath}`);
    process.exit(1);
  }
  
  console.log(`📖 Reading population data from: ${filePath}`);
  const populationMap = parseCSV(filePath);
  console.log(`✅ Loaded ${populationMap.size} city populations\n`);
  
  const citiesPath = path.join(process.cwd(), 'data', 'cities.json');
  
  if (!fs.existsSync(citiesPath)) {
    console.error(`❌ Error: ${citiesPath} not found`);
    process.exit(1);
  }
  
  console.log('📖 Reading cities.json...');
  const citiesData = fs.readFileSync(citiesPath, 'utf-8');
  const cities: City[] = JSON.parse(citiesData);
  
  console.log(`✅ Loaded ${cities.length} cities\n`);
  
  let updatedCount = 0;
  const updatedCities: City[] = [];
  
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    
    // Skip fake cities
    if (city.name.match(/^City \d+$/)) {
      updatedCities.push(city);
      continue;
    }
    
    // Try to find matching population
    const key = `${city.name.toLowerCase().trim()},${city.stateAbbr.toUpperCase()}`;
    const population = populationMap.get(key);
    
    if (population !== undefined) {
      city.population = population;
      updatedCount++;
    }
    
    updatedCities.push(city);
    
    // Progress indicator
    if ((i + 1) % 100 === 0) {
      console.log(`📊 Processed ${i + 1}/${cities.length} cities (${updatedCount} updated)...`);
    }
  }
  
  if (options.dryRun) {
    console.log(`\n🔍 DRY RUN - No changes made`);
    console.log(`📊 Would update ${updatedCount} cities`);
    return;
  }
  
  // Write updated data
  console.log(`\n💾 Writing updated data...`);
  fs.writeFileSync(citiesPath, JSON.stringify(updatedCities, null, 2));
  
  console.log(`\n✅ Population import complete!`);
  console.log(`📊 Statistics:`);
  console.log(`   - Total cities: ${cities.length}`);
  console.log(`   - Updated with real data: ${updatedCount}`);
  console.log(`   - Coverage: ${Math.round(updatedCount / cities.length * 100)}%`);
  console.log(`\n📁 Updated file: ${citiesPath}`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: ImportOptions = {
  file: 'data/city-populations.csv',
  dryRun: false,
};

args.forEach(arg => {
  if (arg.startsWith('--file=')) {
    options.file = arg.split('=')[1];
  } else if (arg === '--dry-run') {
    options.dryRun = true;
  }
});

importCityPopulations(options).catch(console.error);

