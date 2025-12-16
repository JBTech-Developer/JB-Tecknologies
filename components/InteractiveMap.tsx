'use client';

import { useMemo } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { City } from '@/lib/types';

interface InteractiveMapProps {
  city: City;
  height?: string;
  className?: string;
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

export default function InteractiveMap({ 
  city, 
  height = '500px',
  className = '' 
}: InteractiveMapProps) {
  const center = useMemo(() => ({
    lat: city.latitude,
    lng: city.longitude,
  }), [city.latitude, city.longitude]);

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

  return (
    <div className={`w-full rounded-lg overflow-hidden luxury-shadow-lg ${className}`} style={{ height }}>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          options={defaultOptions}
        >
          <Marker
            position={center}
            label={{
              text: 'JB',
              color: '#ffffff',
              fontWeight: 'bold',
            }}
            title={`${city.name}, ${city.stateAbbr}`}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

