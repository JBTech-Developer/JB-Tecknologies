#!/usr/bin/env node

/**
 * Utility script to view states and cities in your data
 * Usage: node scripts/view-states-cities.js [state-name]
 * Example: node scripts/view-states-cities.js California
 * Example: node scripts/view-states-cities.js (shows all states)
 */

const fs = require('fs');
const path = require('path');

const citiesPath = path.join(__dirname, '..', 'data', 'cities.json');

if (!fs.existsSync(citiesPath)) {
  console.error('❌ cities.json not found at:', citiesPath);
  process.exit(1);
}

const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf-8'));

// Group cities by state
const stateMap = new Map();

cities.forEach(city => {
  const key = city.state;
  if (!stateMap.has(key)) {
    stateMap.set(key, []);
  }
  stateMap.get(key).push(city);
});

// Convert to array and sort
const states = Array.from(stateMap.entries())
  .map(([stateName, stateCities]) => ({
    name: stateName,
    abbr: stateCities[0].stateAbbr,
    cities: stateCities.sort((a, b) => b.population - a.population),
    count: stateCities.length
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

// Get command line argument
const searchState = process.argv[2];

if (searchState) {
  // Show cities for a specific state
  const state = states.find(s => 
    s.name.toLowerCase().includes(searchState.toLowerCase()) ||
    s.abbr.toLowerCase() === searchState.toLowerCase()
  );

  if (!state) {
    console.error(`❌ State "${searchState}" not found.\n`);
    console.log('Available states:');
    states.forEach(s => {
      console.log(`  - ${s.name} (${s.abbr})`);
    });
    process.exit(1);
  }

  console.log(`\n📍 ${state.name} (${state.abbr}) - ${state.count} cities\n`);
  console.log('Top cities by population:');
  console.log('─'.repeat(80));
  
  state.cities.slice(0, 50).forEach((city, index) => {
    const slug = city.name.toLowerCase().replace(/\s+/g, '-');
    const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
    console.log(`${(index + 1).toString().padStart(3)}. ${city.name.padEnd(25)} | Pop: ${city.population.toLocaleString().padStart(10)} | URL: /${stateSlug}/${slug}/network-cabling`);
  });

  if (state.cities.length > 50) {
    console.log(`\n... and ${state.cities.length - 50} more cities`);
  }

  console.log(`\n📍 View state page: /${state.name.toLowerCase().replace(/\s+/g, '-')}/network-cabling`);
  console.log(`📍 Map will show all ${state.count} cities\n`);

} else {
  // Show all states summary
  console.log('\n🗺️  STATES AND CITIES OVERVIEW\n');
  console.log('─'.repeat(80));
  
  states.forEach(state => {
    const stateSlug = state.name.toLowerCase().replace(/\s+/g, '-');
    console.log(`${state.name.padEnd(20)} (${state.abbr}) | ${state.count.toString().padStart(4)} cities | /${stateSlug}/network-cabling`);
  });

  console.log('─'.repeat(80));
  console.log(`\n📊 Total: ${states.length} states, ${cities.length} cities\n`);
  console.log('💡 To see cities for a specific state, run:');
  console.log('   node scripts/view-states-cities.js [state-name]');
  console.log('   Examples:');
  console.log('   node scripts/view-states-cities.js California');
  console.log('   node scripts/view-states-cities.js TX');
  console.log('   node scripts/view-states-cities.js New York\n');
}

