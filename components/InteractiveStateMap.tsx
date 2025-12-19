'use client';

import { useMemo, useState, useEffect } from 'react';
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
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

  // Monitor for script loading errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const message = event.message?.toLowerCase() || '';
      if (message.includes('maps.googleapis.com') || message.includes('google maps') || message.includes('invalidkey')) {
        console.error('Google Maps script error:', event.message);
        
        if (message.includes('invalidkey') || message.includes('invalid key')) {
          setLoadError('Invalid API key. Please verify your Google Maps API key is correct and has Maps JavaScript API enabled.');
        } else {
          setLoadError('Failed to load Google Maps. Check API key restrictions and ensure Maps JavaScript API is enabled.');
        }
      }
    };

    // Listen for Google Maps specific errors
    const handleGoogleMapsError = () => {
      const googleMapsScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (googleMapsScript) {
        googleMapsScript.addEventListener('error', () => {
          setLoadError('Failed to load Google Maps script. Check your API key and network connection.');
        });
      }
    };

    const checkGoogleMaps = () => {
      // Check if Google Maps loaded successfully after a delay
      setTimeout(() => {
        if (!(window as any).google?.maps && !scriptLoaded) {
          // Check for specific error messages in console
          const consoleErrors = (window as any).__googleMapsErrors || [];
          if (consoleErrors.some((err: string) => err.toLowerCase().includes('invalidkey'))) {
            setLoadError('Invalid API key. Verify your key in Google Cloud Console and ensure Maps JavaScript API is enabled.');
          } else {
            setLoadError('Google Maps failed to load. Please check your API key configuration.');
          }
        }
      }, 5000);
    };

    window.addEventListener('error', handleError);
    handleGoogleMapsError();
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

  // Determine zoom level based on number of cities
  const zoom = useMemo(() => {
    if (cities.length === 0) return 4;
    if (cities.length <= 5) return 8;
    if (cities.length <= 10) return 7;
    return 6;
  }, [cities.length]);

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

