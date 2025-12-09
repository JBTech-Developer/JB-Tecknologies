import { City } from './types';

export function getGoogleMapsStaticUrl(city: City, apiKey?: string): string {
  const center = `${city.latitude},${city.longitude}`;
  const marker = `color:0x4285F4|label:JB|${center}`;
  const size = '600x400';
  const zoom = '12';
  
  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
  const params = new URLSearchParams({
    center,
    zoom,
    size,
    markers: marker,
    key: apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  return `${baseUrl}?${params.toString()}`;
}

