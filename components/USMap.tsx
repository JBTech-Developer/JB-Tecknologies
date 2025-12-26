'use client';

import Link from 'next/link';
import { getAllStates } from '@/lib/cities';
import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// US State coordinates for map markers
const US_STATE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'AL': { lat: 32.806671, lng: -86.791130 },
  'AK': { lat: 61.370716, lng: -152.404419 },
  'AZ': { lat: 33.729759, lng: -111.431221 },
  'AR': { lat: 34.969704, lng: -92.373123 },
  'CA': { lat: 36.116203, lng: -119.681564 },
  'CO': { lat: 39.059811, lng: -105.311104 },
  'CT': { lat: 41.597782, lng: -72.755371 },
  'DE': { lat: 39.318523, lng: -75.507141 },
  'FL': { lat: 27.766279, lng: -81.686783 },
  'GA': { lat: 33.040619, lng: -83.643074 },
  'HI': { lat: 21.094318, lng: -157.498337 },
  'ID': { lat: 44.240459, lng: -114.478828 },
  'IL': { lat: 40.349457, lng: -88.986137 },
  'IN': { lat: 39.849426, lng: -86.258278 },
  'IA': { lat: 42.011539, lng: -93.210526 },
  'KS': { lat: 38.526600, lng: -96.726486 },
  'KY': { lat: 37.668140, lng: -84.670067 },
  'LA': { lat: 31.169546, lng: -91.867805 },
  'ME': { lat: 44.323535, lng: -69.765261 },
  'MD': { lat: 39.063946, lng: -76.802101 },
  'MA': { lat: 42.230171, lng: -71.530106 },
  'MI': { lat: 43.326618, lng: -84.536095 },
  'MN': { lat: 45.694454, lng: -93.900192 },
  'MS': { lat: 32.741646, lng: -89.678696 },
  'MO': { lat: 38.456085, lng: -92.288368 },
  'MT': { lat: 46.921925, lng: -110.454353 },
  'NE': { lat: 41.125370, lng: -98.268082 },
  'NV': { lat: 38.313515, lng: -117.055374 },
  'NH': { lat: 43.452492, lng: -71.563896 },
  'NJ': { lat: 40.298904, lng: -74.521011 },
  'NM': { lat: 34.840515, lng: -106.248482 },
  'NY': { lat: 42.165726, lng: -74.948051 },
  'NC': { lat: 35.630066, lng: -79.806419 },
  'ND': { lat: 47.528912, lng: -99.784012 },
  'OH': { lat: 40.388783, lng: -82.764915 },
  'OK': { lat: 35.565342, lng: -96.928917 },
  'OR': { lat: 44.572021, lng: -122.070938 },
  'PA': { lat: 40.590752, lng: -77.209755 },
  'RI': { lat: 41.680893, lng: -71.51178 },
  'SC': { lat: 33.856892, lng: -80.945007 },
  'SD': { lat: 44.299782, lng: -99.438828 },
  'TN': { lat: 35.747845, lng: -86.692345 },
  'TX': { lat: 31.054487, lng: -97.563461 },
  'UT': { lat: 40.150032, lng: -111.862434 },
  'VT': { lat: 44.045876, lng: -72.710686 },
  'VA': { lat: 37.769337, lng: -78.169968 },
  'WA': { lat: 47.400902, lng: -121.490494 },
  'WV': { lat: 38.491226, lng: -80.954453 },
  'WI': { lat: 44.268543, lng: -89.616508 },
  'WY': { lat: 42.755966, lng: -107.302490 },
};

export default function USMap() {
  const [showMoreOpen, setShowMoreOpen] = useState(false);
  
  const { statesWithCities, statesWithoutCities } = useMemo(() => {
    try {
      const allStates = getAllStates().sort((a, b) => a.name.localeCompare(b.name));
      const withCities = allStates.filter(state => state.cities.length > 0);
      const withoutCities = allStates.filter(state => state.cities.length === 0);
      return { statesWithCities: withCities, statesWithoutCities: withoutCities };
    } catch (error) {
      console.error('Error loading states:', error);
      return { statesWithCities: [], statesWithoutCities: [] };
    }
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-luxury-offwhite to-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4 text-luxury-black">
            Service Areas Nationwide
          </h2>
          <p className="text-xl text-luxury-black/70 max-w-3xl mx-auto mb-8">
            Click on any state below to explore our network cabling services. We serve businesses across all 50 states.
          </p>
        </div>

        {/* States with Cities - Main Grid */}
        {statesWithCities.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-w-7xl mx-auto">
              {statesWithCities.map((state) => {
                const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link
                    key={state.abbreviation}
                    href={`/${stateSlug}/network-cabling`}
                    className="border-2 border-luxury-beige rounded-lg p-4 bg-white luxury-shadow hover:shadow-xl hover:border-luxury-blue transition-all duration-300 group text-center transform hover:-translate-y-1"
                  >
                    <div className="text-3xl font-bold text-luxury-black group-hover:text-luxury-blue transition-colors mb-2">
                      {state.abbreviation}
                    </div>
                    <div className="text-sm font-medium text-luxury-black/80 group-hover:text-luxury-blue transition-colors">
                      {state.name}
                    </div>
                    <div className="text-xs text-luxury-black/50 mt-2">
                      {state.cities.length} {state.cities.length === 1 ? 'city' : 'cities'}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* States without Cities - Accordion "Show More" */}
        {statesWithoutCities.length > 0 && (
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => setShowMoreOpen(!showMoreOpen)}
              className="w-full flex items-center justify-between p-4 bg-luxury-beige/30 rounded-lg border border-luxury-beige hover:bg-luxury-beige/50 transition-colors mb-4"
            >
              <span className="text-lg font-display font-semibold text-luxury-black">
                Show More ({statesWithoutCities.length} additional states)
              </span>
              <ChevronDown 
                className={`h-5 w-5 text-luxury-black transition-transform duration-300 ${showMoreOpen ? 'rotate-180' : ''}`}
              />
            </button>
            
            {showMoreOpen && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 fade-in">
                {statesWithoutCities.map((state) => {
                  const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <Link
                      key={state.abbreviation}
                      href={`/${stateSlug}/network-cabling`}
                      className="border-2 border-luxury-beige rounded-lg p-4 bg-white luxury-shadow hover:shadow-xl hover:border-luxury-blue transition-all duration-300 group text-center transform hover:-translate-y-1"
                    >
                      <div className="text-3xl font-bold text-luxury-black group-hover:text-luxury-blue transition-colors mb-2">
                        {state.abbreviation}
                      </div>
                      <div className="text-sm font-medium text-luxury-black/80 group-hover:text-luxury-blue transition-colors">
                        {state.name}
                      </div>
                      <div className="text-xs text-luxury-black/40 mt-2 italic">
                        Coming soon
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Quick Links for Major States - Only show states with cities */}
        {statesWithCities.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12">
            <div className="text-center mb-6">
              <h3 className="text-xl font-display font-semibold text-luxury-black mb-4">
                Popular States
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['Texas', 'Florida', 'California', 'New York', 'Illinois', 'Pennsylvania'].map((stateName) => {
                  const state = statesWithCities.find(s => s.name === stateName);
                  if (!state) return null;
                  const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <Link
                      key={state.abbreviation}
                      href={`/${stateSlug}/network-cabling`}
                      className="px-6 py-2 bg-luxury-blue text-white rounded-lg hover:bg-luxury-blue/90 transition-colors font-medium"
                    >
                      {state.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

