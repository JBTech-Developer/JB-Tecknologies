import { City } from './types';

/**
 * Sanity.io CMS Client Configuration
 * 
 * This client connects to your Sanity project to fetch city data.
 * Falls back to static JSON if Sanity is not configured.
 */

// Lazy import to prevent build errors if @sanity/client is not installed
let sanityClient: any = null;
let createClientFn: any = null;
let sanityClientAvailable: boolean | null = null;

/**
 * Check if @sanity/client is available
 */
async function checkSanityClient(): Promise<boolean> {
  if (sanityClientAvailable !== null) {
    return sanityClientAvailable;
  }

  try {
    // Dynamic import to prevent build errors
    const sanityModule = await import('@sanity/client');
    createClientFn = sanityModule.createClient;
    sanityClientAvailable = true;
    return true;
  } catch (error) {
    sanityClientAvailable = false;
    return false;
  }
}

/**
 * Initialize Sanity client if credentials are available
 */
async function getSanityClient() {
  if (sanityClient) {
    return sanityClient;
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';
  const token = process.env.SANITY_API_TOKEN; // Optional: for private datasets

  if (!projectId) {
    return null; // Sanity not configured, will use fallback
  }

  try {
    // Check if Sanity client is available
    const isAvailable = await checkSanityClient();
    if (!isAvailable || !createClientFn) {
      return null;
    }

    sanityClient = createClientFn({
      projectId,
      dataset,
      apiVersion,
      useCdn: true, // Use CDN for faster responses
      token, // Only needed for private datasets
    });

    return sanityClient;
  } catch (error) {
    console.error('Error initializing Sanity client:', error);
    return null;
  }
}

/**
 * Fetch all cities from Sanity CMS
 * Returns null if Sanity is not configured or if fetch fails
 */
export async function fetchCitiesFromSanity(): Promise<City[] | null> {
  const client = await getSanityClient();
  
  if (!client) {
    return null; // Sanity not configured
  }

  try {
    const query = `*[_type == "city"] {
      _id,
      name,
      state,
      stateAbbr,
      latitude,
      longitude,
      population,
      areaCode,
      majorLandmark,
      neighboringTowns,
      zipCodes
    } | order(population desc)`;

    const cities = await client.fetch<City[]>(query);

    if (!cities || cities.length === 0) {
      console.warn('No cities found in Sanity CMS');
      return null;
    }

    return cities;
  } catch (error) {
    console.error('Error fetching cities from Sanity:', error);
    return null;
  }
}

/**
 * Fetch a single city by slug from Sanity
 */
export async function fetchCityFromSanity(
  stateSlug: string,
  citySlug: string
): Promise<City | null> {
  const client = await getSanityClient();
  
  if (!client) {
    return null;
  }

  try {
    const cityName = citySlug
      .replace('-network-cabling', '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const query = `*[_type == "city" && (
      name == $cityName
    ) && (
      stateAbbr == $stateSlug || 
      lower(state) == $stateSlug
    )][0] {
      _id,
      name,
      state,
      stateAbbr,
      latitude,
      longitude,
      population,
      areaCode,
      majorLandmark,
      neighboringTowns,
      zipCodes
    }`;

    const city = await client.fetch<City | null>(query, {
      cityName,
      stateSlug: stateSlug.toLowerCase(),
    });

    return city;
  } catch (error) {
    console.error('Error fetching city from Sanity:', error);
    return null;
  }
}

/**
 * Check if Sanity CMS is configured
 */
export function isSanityConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
}

