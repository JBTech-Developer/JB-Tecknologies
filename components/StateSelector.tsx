'use client';

import Link from 'next/link';
import { getAllStates } from '@/lib/cities';
import { useState, useMemo } from 'react';

export default function StateSelector() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const states = useMemo(() => {
    try {
      return getAllStates().sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error loading states:', error);
      return [];
    }
  }, []);

  const filteredStates = useMemo(() => {
    if (!searchTerm) return states;
    const term = searchTerm.toLowerCase();
    return states.filter(state => 
      state.name.toLowerCase().includes(term) || 
      state.abbreviation.toLowerCase().includes(term)
    );
  }, [states, searchTerm]);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4 text-luxury-black">
            Select Your State
          </h2>
          <p className="text-lg text-luxury-black/70 max-w-2xl mx-auto mb-8">
            Find network cabling services in your area. We serve businesses nationwide.
          </p>
          
          {/* Search Input */}
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search by state name or abbreviation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-luxury-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-blue focus:border-transparent text-luxury-black"
            />
          </div>
        </div>

        {/* States Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {filteredStates.map((state) => {
            const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
            return (
              <Link
                key={state.abbreviation}
                href={`/${stateSlug}/network-cabling`}
                className="border border-luxury-beige rounded-lg p-4 bg-white luxury-shadow hover-lift transition-all duration-300 group text-center"
              >
                <div className="text-2xl font-bold text-luxury-black group-hover:text-luxury-blue transition-colors mb-1">
                  {state.abbreviation}
                </div>
                <div className="text-sm text-luxury-black/70 group-hover:text-luxury-blue transition-colors">
                  {state.name}
                </div>
                <div className="text-xs text-luxury-black/50 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {state.cities.length} {state.cities.length === 1 ? 'city' : 'cities'}
                </div>
              </Link>
            );
          })}
        </div>

        {filteredStates.length === 0 && searchTerm && (
          <div className="text-center mt-8 text-luxury-black/70">
            No states found matching "{searchTerm}"
          </div>
        )}
      </div>
    </section>
  );
}

