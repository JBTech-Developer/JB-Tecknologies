'use client';

import { useMemo } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { City } from '@/lib/types';

interface InteractiveStateMapProps {
  cities: City[];
  centerCity?: City;
  height?: string;
  className?: string;
  maxMarkers?: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: true,
  fullscreenControl: true,
};

export default function InteractiveStateMap({ 
  cities, 
  centerCity,
  height = '500px',
  className = '',
  maxMarkers = 20
}: InteractiveStateMapProps) {
  const center = useMemo(() => {
    if (centerCity) {
      return {
        lat: centerCity.latitude,
        lng: centerCity.longitude,
      };
    }
    // Calculate center from all cities if no center city provided
    if (cities.length === 0) {
      return { lat: 39.8283, lng: -98.5795 }; // Center of US
    }
    const avgLat = cities.reduce((sum, city) => sum + city.latitude, 0) / cities.length;
    const avgLng = cities.reduce((sum, city) => sum + city.longitude, 0) / cities.length;
    return { lat: avgLat, lng: avgLng };
  }, [cities, centerCity]);

  const markers = useMemo(() => {
    return cities.slice(0, maxMarkers).map(city => ({
      position: { lat: city.latitude, lng: city.longitude },
      label: city.name.charAt(0),
      title: `${city.name}, ${city.stateAbbr}`,
    }));
  }, [cities, maxMarkers]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div 
        className={`w-full flex items-center justify-center bg-luxury-beige/20 text-luxury-black/60 ${className}`}
        style={{ height }}
      >
        Google Maps API key required
      </div>
    );
  }

  // Determine zoom level based on number of cities
  const zoom = useMemo(() => {
    if (cities.length === 0) return 4;
    if (cities.length <= 5) return 8;
    if (cities.length <= 10) return 7;
    return 6;
  }, [cities.length]);

  return (
    <div className={`w-full rounded-lg overflow-hidden luxury-shadow-lg ${className}`} style={{ height }}>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={defaultOptions}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              label={{
                text: marker.label,
                color: '#ffffff',
                fontWeight: 'bold',
              }}
              title={marker.title}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

