'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { City } from '@/lib/types';
import { calculateDistance } from '@/lib/cities';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';
import Link from 'next/link';

interface InteractiveStateMapWithSelectorProps {
  cities: City[];
  centerCity?: City;
  height?: string;
  className?: string;
  showSelector?: boolean;
  onCitySelect?: (city: City) => void;
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

export default function InteractiveStateMapWithSelector({ 
  cities, 
  centerCity,
  height = '500px',
  className = '',
  showSelector = true,
  onCitySelect
}: InteractiveStateMapWithSelectorProps) {
  const [loadError, setLoadError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(centerCity || cities[0] || null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(6);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Sort cities alphabetically for selector
  const sortedCities = useMemo(() => {
    return [...cities].sort((a, b) => a.name.localeCompare(b.name));
  }, [cities]);

  // Find nearest city to user location
  const findNearestCity = (lat: number, lng: number): City | null => {
    if (cities.length === 0) return null;
    
    let nearest: City | null = null;
    let minDistance = Infinity;

    cities.forEach(city => {
      const distance = calculateDistance(lat, lng, city.latitude, city.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = city;
      }
    });

    return nearest;
  };

  // Get user's location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setUserLocation({ lat, lng });
        setIsGettingLocation(false);

        // Find nearest city
        const nearest = findNearestCity(lat, lng);
        if (nearest) {
          setSelectedCity(nearest);
          setMapCenter({ lat: nearest.latitude, lng: nearest.longitude });
          setMapZoom(10);
          if (onCitySelect) {
            onCitySelect(nearest);
          }
        } else {
          // If no nearest city found, center on user location
          setMapCenter({ lat, lng });
          setMapZoom(10);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Initialize map center
  useEffect(() => {
    if (selectedCity) {
      setMapCenter({ lat: selectedCity.latitude, lng: selectedCity.longitude });
      setMapZoom(10);
      if (onCitySelect) {
        onCitySelect(selectedCity);
      }
    } else if (cities.length > 0) {
      // Calculate center from all cities
      const avgLat = cities.reduce((sum, city) => sum + city.latitude, 0) / cities.length;
      const avgLng = cities.reduce((sum, city) => sum + city.longitude, 0) / cities.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
      
      // Determine zoom based on number of cities
      if (cities.length <= 5) setMapZoom(8);
      else if (cities.length <= 10) setMapZoom(7);
      else setMapZoom(6);
    } else {
      setMapCenter({ lat: 39.8283, lng: -98.5795 }); // Center of US
      setMapZoom(4);
    }
  }, [selectedCity, cities, onCitySelect]);

  // Handle city selection from dropdown
  const handleCitySelect = (cityName: string) => {
    const city = cities.find(c => c.name === cityName);
    if (city) {
      setSelectedCity(city);
    }
  };

  const markers = useMemo(() => {
    return cities.map((city, index) => ({
      id: index,
      position: { lat: city.latitude, lng: city.longitude },
      label: city.name.charAt(0),
      title: `${city.name}, ${city.stateAbbr}`,
      city: city,
      isSelected: selectedCity?.name === city.name,
    }));
  }, [cities, selectedCity]);

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

    window.addEventListener('error', handleError);
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setScriptLoaded(true);
    setLoadError(null);
  };

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
        </div>
      </div>
    );
  }

  const defaultCenter = mapCenter || { lat: 39.8283, lng: -98.5795 };

  return (
    <div className={`w-full ${className}`}>
      {/* Controls */}
      {showSelector && (
        <div className="mb-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* City Selector */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-luxury-black mb-2">
                Select a City
              </label>
              <Select
                value={selectedCity?.name || ''}
                onValueChange={handleCitySelect}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a city..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {sortedCities.map((city) => (
                    <SelectItem key={`${city.name}-${city.stateAbbr}`} value={city.name}>
                      {city.name}, {city.stateAbbr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Geolocation Button */}
            <div className="flex items-end">
              <Button
                type="button"
                onClick={getUserLocation}
                disabled={isGettingLocation}
                className="w-full sm:w-auto bg-luxury-blue hover:bg-luxury-blue/90 text-white"
              >
                <Navigation className="h-4 w-4 mr-2" />
                {isGettingLocation ? 'Locating...' : 'Use My Location'}
              </Button>
            </div>
          </div>

          {/* Location Error */}
          {locationError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm p-2">
              {locationError}
            </div>
          )}

          {/* Selected City Info */}
          {selectedCity && (
            <div className="bg-luxury-beige/30 border border-luxury-beige rounded-sm p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-luxury-black">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    {selectedCity.name}, {selectedCity.stateAbbr}
                  </p>
                  <p className="text-sm text-luxury-black/70 mt-1">
                    Population: {selectedCity.population.toLocaleString()} • County: {selectedCity.county}
                  </p>
                </div>
                <Link
                  href={`/${selectedCity.state.toLowerCase().replace(/\s+/g, '-')}/${selectedCity.name.toLowerCase().replace(/\s+/g, '-')}/voice-data-cabling-installers`}
                  className="text-sm text-luxury-blue hover:underline"
                >
                  View Services →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Map */}
      <div className="rounded-lg overflow-hidden luxury-shadow-lg" style={{ height }}>
        <LoadScript 
          googleMapsApiKey={apiKey}
          loadingElement={<div className="w-full h-full flex items-center justify-center bg-luxury-beige/20">Loading map...</div>}
          onLoad={onLoad}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={mapZoom}
            options={defaultOptions}
            onLoad={onLoad}
          >
            {/* User Location Marker */}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: '#4285F4',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2,
                }}
                title="Your Location"
              />
            )}

            {/* City Markers */}
            {markers.map((marker) => (
              <div key={marker.id}>
                <Marker
                  position={marker.position}
                  label={{
                    text: marker.label,
                    color: '#ffffff',
                    fontWeight: 'bold',
                  }}
                  title={marker.title}
                  icon={marker.isSelected ? {
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                  } : undefined}
                  onClick={() => {
                    setSelectedCity(marker.city);
                    setSelectedMarker(marker.id);
                  }}
                />
                {selectedMarker === marker.id && marker.city && (
                  <InfoWindow
                    position={marker.position}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="p-2">
                      <h3 className="font-semibold text-luxury-black">{marker.city.name}, {marker.city.stateAbbr}</h3>
                      <p className="text-sm text-luxury-black/70 mt-1">
                        Population: {marker.city.population.toLocaleString()}
                      </p>
                      <a
                        href={`/${marker.city.state.toLowerCase().replace(/\s+/g, '-')}/${marker.city.name.toLowerCase().replace(/\s+/g, '-')}/voice-data-cabling-installers`}
                        className="text-sm text-luxury-blue hover:underline mt-2 inline-block"
                      >
                        View Services →
                      </a>
                    </div>
                  </InfoWindow>
                )}
              </div>
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}

