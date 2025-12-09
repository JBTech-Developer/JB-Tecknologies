import { City, StateData } from './types';
import { loadCitiesFromJSON } from './load-cities';
import fs from 'fs';
import path from 'path';

// Lazy import Sanity functions to prevent build errors
let sanityModule: any = null;

/**
 * Get Sanity module (lazy loaded)
 */
async function getSanityModule() {
  if (sanityModule !== null) {
    return sanityModule;
  }
  
  try {
    sanityModule = await import('./sanity');
    return sanityModule;
  } catch (error) {
    sanityModule = false; // Mark as unavailable
    return null;
  }
}

/**
 * Check if Sanity is configured (synchronous check)
 */
function isSanityConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
}

// Sample city data - In production, this would be a full JSON file with 5,000+ cities
// For now, we'll create a representative sample and a function to load from JSON
const fallbackCities: City[] = [
  // Georgia cities
  { name: 'Atlanta', state: 'Georgia', stateAbbr: 'GA', latitude: 33.749, longitude: -84.388, population: 498715, areaCode: '404', majorLandmark: 'Ponce City Market', neighboringTowns: ['Sandy Springs', 'Roswell', 'Alpharetta'], zipCodes: ['30301', '30302', '30303'] },
  { name: 'Savannah', state: 'Georgia', stateAbbr: 'GA', latitude: 32.0809, longitude: -81.0912, population: 147780, areaCode: '912', majorLandmark: 'Port of Savannah', neighboringTowns: ['Pooler', 'Garden City', 'Port Wentworth'], zipCodes: ['31401', '31402', '31403'] },
  { name: 'Augusta', state: 'Georgia', stateAbbr: 'GA', latitude: 33.4735, longitude: -82.0105, population: 202081, areaCode: '706', majorLandmark: 'Augusta National Golf Club', neighboringTowns: ['Martinez', 'Evans', 'Grovetown'], zipCodes: ['30901', '30902', '30903'] },
  { name: 'Columbus', state: 'Georgia', stateAbbr: 'GA', latitude: 32.4609, longitude: -84.9877, population: 206922, areaCode: '706', majorLandmark: 'National Infantry Museum', neighboringTowns: ['Phenix City', 'Fort Benning', 'Smiths Station'], zipCodes: ['31901', '31902', '31903'] },
  { name: 'Athens', state: 'Georgia', stateAbbr: 'GA', latitude: 33.9519, longitude: -83.3576, population: 127315, areaCode: '706', majorLandmark: 'University of Georgia', neighboringTowns: ['Watkinsville', 'Bogart', 'Winterville'], zipCodes: ['30601', '30602', '30603'] },
  
  // Additional states for testing
  { name: 'New York', state: 'New York', stateAbbr: 'NY', latitude: 40.7128, longitude: -74.0060, population: 8336817, areaCode: '212', majorLandmark: 'Times Square', neighboringTowns: ['Jersey City', 'Newark', 'Yonkers'], zipCodes: ['10001', '10002', '10003'] },
  { name: 'Los Angeles', state: 'California', stateAbbr: 'CA', latitude: 34.0522, longitude: -118.2437, population: 3967000, areaCode: '213', majorLandmark: 'Hollywood Sign', neighboringTowns: ['Beverly Hills', 'Santa Monica', 'Pasadena'], zipCodes: ['90001', '90002', '90003'] },
  { name: 'Chicago', state: 'Illinois', stateAbbr: 'IL', latitude: 41.8781, longitude: -87.6298, population: 2697000, areaCode: '312', majorLandmark: 'Willis Tower', neighboringTowns: ['Evanston', 'Oak Park', 'Skokie'], zipCodes: ['60601', '60602', '60603'] },
  { name: 'Houston', state: 'Texas', stateAbbr: 'TX', latitude: 29.7604, longitude: -95.3698, population: 2328000, areaCode: '713', majorLandmark: 'Space Center Houston', neighboringTowns: ['Sugar Land', 'Pearland', 'The Woodlands'], zipCodes: ['77001', '77002', '77003'] },
  { name: 'Phoenix', state: 'Arizona', stateAbbr: 'AZ', latitude: 33.4484, longitude: -112.0740, population: 1681000, areaCode: '602', majorLandmark: 'Camelback Mountain', neighboringTowns: ['Scottsdale', 'Tempe', 'Mesa'], zipCodes: ['85001', '85002', '85003'] },
];

/**
 * Load cities from multiple sources with fallback chain:
 * 1. Sanity CMS (if configured)
 * 2. JSON file (data/cities.json)
 * 3. Fallback sample data
 */
let cachedCities: City[] | null = null;

async function loadCities(): Promise<City[]> {
  if (cachedCities) {
    return cachedCities;
  }

  // Try Sanity CMS first
  if (isSanityConfigured()) {
    try {
      const sanity = await getSanityModule();
      if (sanity && sanity.fetchCitiesFromSanity) {
        const sanityCities = await sanity.fetchCitiesFromSanity();
        if (sanityCities && sanityCities.length > 0) {
          cachedCities = sanityCities;
          return sanityCities;
        }
      }
    } catch (error) {
      console.warn('Failed to load cities from Sanity, falling back to JSON:', error);
    }
  }

  // Try loading from JSON file
  try {
    const jsonPath = path.join(process.cwd(), 'data', 'cities.json');
    if (fs.existsSync(jsonPath)) {
      const jsonCities = loadCitiesFromJSON('data/cities.json');
      if (jsonCities && jsonCities.length > 0) {
        cachedCities = jsonCities;
        return cachedCities;
      }
    }
  } catch (error) {
    console.warn('Failed to load cities from JSON, using fallback:', error);
  }

  // Use fallback sample data
  cachedCities = fallbackCities;
  return cachedCities;
}

/**
 * Get all cities (supports async loading from CMS/JSON)
 * For build-time SSG, use getAllCitiesSync() instead
 */
export async function getAllCities(): Promise<City[]> {
  return await loadCities();
}

/**
 * Get all cities synchronously (for build-time SSG)
 * Uses cached data or fallback
 */
export function getAllCitiesSync(): City[] {
  if (cachedCities) {
    return cachedCities;
  }
  return fallbackCities;
}

// Export sampleCities for backwards compatibility
export const sampleCities = fallbackCities;

export async function getCityBySlug(stateSlug: string, citySlug: string): Promise<City | null> {
  // Try Sanity CMS first if configured
  if (isSanityConfigured()) {
    try {
      const sanity = await getSanityModule();
      if (sanity && sanity.fetchCityFromSanity) {
        const city = await sanity.fetchCityFromSanity(stateSlug, citySlug);
        if (city) return city;
      }
    } catch (error) {
      console.warn('Failed to fetch city from Sanity:', error);
    }
  }

  // Fallback to local data
  const cities = getAllCitiesSync();
  const cityName = citySlug.replace('-network-cabling', '').split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return cities.find(
    city => 
      (city.stateAbbr.toLowerCase() === stateSlug.toLowerCase() ||
       city.state.toLowerCase().replace(/\s+/g, '-') === stateSlug.toLowerCase()) &&
      city.name.toLowerCase() === cityName.toLowerCase()
  ) || null;
}

// Synchronous version for backwards compatibility
export function getCityBySlugSync(stateSlug: string, citySlug: string): City | null {
  const cities = getAllCitiesSync();
  const cityName = citySlug.replace('-network-cabling', '').split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return cities.find(
    city => 
      (city.stateAbbr.toLowerCase() === stateSlug.toLowerCase() ||
       city.state.toLowerCase().replace(/\s+/g, '-') === stateSlug.toLowerCase()) &&
      city.name.toLowerCase() === cityName.toLowerCase()
  ) || null;
}

export function getCitiesByState(stateSlug: string): City[] {
  // Remove '-network-cabling' suffix if present for matching
  const cleanSlug = stateSlug.replace('-network-cabling', '');
  const cities = getAllCitiesSync();
  return cities.filter(city => 
    city.stateAbbr.toLowerCase() === cleanSlug.toLowerCase() ||
    city.state.toLowerCase().replace(/\s+/g, '-') === cleanSlug.toLowerCase()
  ).sort((a, b) => b.population - a.population);
}

export function getAllStates(): StateData[] {
  const stateMap = new Map<string, City[]>();
  const cities = getAllCitiesSync();
  
  cities.forEach(city => {
    const key = city.stateAbbr;
    if (!stateMap.has(key)) {
      stateMap.set(key, []);
    }
    stateMap.get(key)!.push(city);
  });
  
  return Array.from(stateMap.entries()).map(([abbr, cities]) => ({
    name: cities[0].state,
    abbreviation: abbr,
    cities: cities.sort((a, b) => b.population - a.population),
  }));
}

export function getStateBySlug(stateSlug: string): StateData | null {
  const states = getAllStates();
  // Remove '-network-cabling' suffix if present for matching
  const cleanSlug = stateSlug.replace('-network-cabling', '');
  return states.find(state => 
    state.abbreviation.toLowerCase() === cleanSlug.toLowerCase() ||
    state.name.toLowerCase().replace(/\s+/g, '-') === cleanSlug.toLowerCase()
  ) || null;
}

// Haversine distance calculation
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getNearbyCities(city: City, limit: number = 10): City[] {
  const cities = getAllCitiesSync();
  return cities
    .filter(c => c.name !== city.name && c.state === city.state)
    .map(c => ({
      city: c,
      distance: calculateDistance(city.latitude, city.longitude, c.latitude, c.longitude),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(({ city }) => city);
}

