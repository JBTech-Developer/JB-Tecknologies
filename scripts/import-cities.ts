/**
 * Script to import cities from CSV or JSON into the project
 * 
 * Usage:
 *   npm run import-cities -- --file=data/cities.csv --format=csv
 *   npm run import-cities -- --file=data/cities.json --format=json
 * 
 * This script helps load large city datasets (5,000+ cities) into the project.
 */

import fs from 'fs';
import path from 'path';
import { City } from '../lib/types';

interface ImportOptions {
  file: string;
  format: 'csv' | 'json';
  output?: string;
}

function parseCSV(csvContent: string): City[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const cities: City[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const city: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      
      // Map CSV headers to City interface
      // Supports SimpleMaps US Cities (city, state_name, state_id, lat, lng, population, zips)
      if (header === 'name' || header === 'city') city.name = value;
      else if (header === 'state' || header === 'state_name') city.state = value;
      else if (
        header === 'stateabbr' ||
        header === 'state_abbr' ||
        header === 'state abbreviation' ||
        header === 'state_id'
      ) {
        city.stateAbbr = value;
      }
      else if (header === 'latitude' || header === 'lat') city.latitude = parseFloat(value);
      else if (header === 'longitude' || header === 'lng' || header === 'lon' || header === 'long') city.longitude = parseFloat(value);
      else if (header === 'population' || header === 'pop') city.population = parseInt(value, 10);
      else if (header === 'areacode' || header === 'area_code') city.areaCode = value;
      else if (header === 'majorlandmark' || header === 'landmark') city.majorLandmark = value;
      else if (header === 'neighboringtowns' || header === 'neighbors') city.neighboringTowns = value.split(';').map((t: string) => t.trim());
      else if (header === 'zipcodes' || header === 'zips') city.zipCodes = value.split(';').map((z: string) => z.trim());
    });
    
    // Validate required fields
    if (city.name && city.state && city.stateAbbr && 
        typeof city.latitude === 'number' && 
        typeof city.longitude === 'number' && 
        typeof city.population === 'number') {
      cities.push(city as City);
    }
  }
  
  return cities;
}

function parseJSON(jsonContent: string): City[] {
  const data = JSON.parse(jsonContent);
  const cities: City[] = Array.isArray(data) ? data : [];
  
  // Validate and filter cities
  return cities.filter(city => 
    city.name && 
    city.state && 
    city.stateAbbr && 
    typeof city.latitude === 'number' && 
    typeof city.longitude === 'number' &&
    typeof city.population === 'number'
  );
}

async function importCities(options: ImportOptions) {
  const filePath = path.join(process.cwd(), options.file);
  
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }
  
  console.log(`Reading ${options.format.toUpperCase()} file: ${filePath}`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  let cities: City[];
  
  if (options.format === 'csv') {
    cities = parseCSV(fileContent);
  } else {
    cities = parseJSON(fileContent);
  }
  
  console.log(`Parsed ${cities.length} cities`);
  
  // Validate cities and enforce population filter (> 3000)
  const validCities = cities.filter(city => {
    if (!city.name || !city.state || !city.stateAbbr) return false;
    if (typeof city.latitude !== 'number' || city.latitude < -90 || city.latitude > 90) return false;
    if (typeof city.longitude !== 'number' || city.longitude < -180 || city.longitude > 180) return false;
    if (typeof city.population !== 'number' || city.population <= 3000) return false;
    return true;
  });
  
  console.log(`Valid cities: ${validCities.length}`);
  
  if (validCities.length === 0) {
    console.error('No valid cities found. Please check your data format.');
    process.exit(1);
  }
  
  // Output to JSON file
  const outputPath = options.output || path.join(process.cwd(), 'data', 'cities.json');
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(validCities, null, 2));
  console.log(`✅ Successfully imported ${validCities.length} cities to ${outputPath}`);
  
  // Show statistics
  const states = new Set(validCities.map(c => c.stateAbbr));
  console.log(`\nStatistics:`);
  console.log(`- Total cities: ${validCities.length}`);
  console.log(`- States covered: ${states.size}`);
  console.log(`- Average population: ${Math.round(validCities.reduce((sum, c) => sum + c.population, 0) / validCities.length).toLocaleString()}`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: ImportOptions = {
  file: 'data/cities.csv',
  format: 'csv',
};

args.forEach(arg => {
  if (arg.startsWith('--file=')) {
    options.file = arg.split('=')[1];
  } else if (arg.startsWith('--format=')) {
    options.format = arg.split('=')[1] as 'csv' | 'json';
  } else if (arg.startsWith('--output=')) {
    options.output = arg.split('=')[1];
  }
});

importCities(options).catch(console.error);

