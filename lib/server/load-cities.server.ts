import { City } from '../types';

export async function loadCitiesFromJSONServer(filePath: string): Promise<City[]> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const fullPath = path.join(process.cwd(), filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');
    const cities: City[] = JSON.parse(fileContents);

    return cities.filter(city =>
      city.name &&
      city.state &&
      city.stateAbbr &&
      typeof city.latitude === 'number' &&
      typeof city.longitude === 'number' &&
      typeof city.population === 'number' &&
      city.county &&
      city.zipCodes &&
      Array.isArray(city.zipCodes) &&
      city.zipCodes.length > 0
    );
  } catch (error) {
    console.error('Error loading cities from JSON (server):', error);
    return [];
  }
}
