/**
 * Utility to load cities from a JSON file
 * Place your cities.json file in the data/ directory
 * Format: Array of City objects matching the City interface
 */

import { City } from './types';
import fs from 'fs';
import path from 'path';

export function loadCitiesFromJSON(filePath: string): City[] {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');
    const cities: City[] = JSON.parse(fileContents);
    
    // Validate city structure (including required county and zipCodes)
    return cities.filter(city => 
      city.name && 
      city.state && 
      city.stateAbbr && 
      typeof city.latitude === 'number' && 
      typeof city.longitude === 'number' &&
      typeof city.population === 'number' &&
      city.county && // County is required
      city.zipCodes && // zipCodes array is required
      Array.isArray(city.zipCodes) &&
      city.zipCodes.length > 0 // At least one zip code required
    );
  } catch (error) {
    console.error('Error loading cities from JSON:', error);
    return [];
  }
}

/**
 * Example cities.json structure:
 * [
 *   {
 *     "name": "Atlanta",
 *     "state": "Georgia",
 *     "stateAbbr": "GA",
 *     "latitude": 33.749,
 *     "longitude": -84.388,
 *     "population": 498715,
 *     "county": "Fulton",
 *     "areaCode": "404",
 *     "majorLandmark": "Ponce City Market",
 *     "neighboringTowns": ["Sandy Springs", "Roswell", "Alpharetta"],
 *     "zipCodes": ["30301", "30302", "30303"]
 *   }
 * ]
 * 
 * Required fields: name, state, stateAbbr, latitude, longitude, population, county, zipCodes (array with at least one zip code)
 */

