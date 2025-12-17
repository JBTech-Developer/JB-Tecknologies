'use client';

import { useMemo, useState, useEffect } from 'react';
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  const center = useMemo(() => ({
    lat: city.latitude,
    lng: city.longitude,
  }), [city.latitude, city.longitude]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Monitor for script loading errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('maps.googleapis.com') || event.message?.includes('Google Maps')) {
        console.error('Google Maps script error:', event.message);
        setLoadError('Failed to load Google Maps. Check API key restrictions and ensure Maps JavaScript API is enabled.');
      }
    };

    const checkGoogleMaps = () => {
      // Check if Google Maps loaded successfully after a delay
      setTimeout(() => {
        if (!(window as any).google?.maps && !scriptLoaded) {
          setLoadError('Google Maps failed to load. Please check your API key configuration.');
        }
      }, 5000);
    };

    window.addEventListener('error', handleError);
    checkGoogleMaps();

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, [scriptLoaded]);

  if (!apiKey) {
    return (
      <div 
        className={`w-full flex items-center justify-center bg-luxury-beige/20 text-luxury-black/60 ${className}`}
        style={{ height }}
      >
        <div className="text-center p-4">
          <p className="font-semibold">Google Maps API key required</p>
          <p className="text-sm mt-2">Please configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div 
        className={`w-full flex items-center justify-center bg-luxury-beige/20 text-luxury-black/60 ${className}`}
        style={{ height }}
      >
        <div className="text-center p-4">
          <p className="font-semibold">Unable to load Google Maps</p>
          <p className="text-sm mt-2">{loadError}</p>
          <p className="text-xs mt-4 text-luxury-black/50">
            Common issues: API key restrictions blocking mobile browsers, Maps JavaScript API not enabled, billing not enabled
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full rounded-lg overflow-hidden luxury-shadow-lg ${className}`} style={{ height }}>
      <LoadScript 
        googleMapsApiKey={apiKey}
        loadingElement={<div className="w-full h-full flex items-center justify-center bg-luxury-beige/20">Loading map...</div>}
        onLoad={() => {
          setScriptLoaded(true);
          setLoadError(null);
        }}
      >
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

