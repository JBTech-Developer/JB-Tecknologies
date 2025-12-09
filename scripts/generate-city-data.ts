/**
 * City Data Generator Script
 * 
 * This script helps generate a comprehensive city dataset for the project.
 * It can generate sample cities with realistic data or help import from external sources.
 * 
 * Usage:
 *   npm run generate-city-data -- --count=100 --output=data/cities.json
 *   npm run generate-city-data -- --import=path/to/cities.csv
 */

import fs from 'fs';
import path from 'path';
import { City } from '../lib/types';

// US States with abbreviations
const US_STATES = [
  { name: 'Alabama', abbr: 'AL' },
  { name: 'Alaska', abbr: 'AK' },
  { name: 'Arizona', abbr: 'AZ' },
  { name: 'Arkansas', abbr: 'AR' },
  { name: 'California', abbr: 'CA' },
  { name: 'Colorado', abbr: 'CO' },
  { name: 'Connecticut', abbr: 'CT' },
  { name: 'Delaware', abbr: 'DE' },
  { name: 'Florida', abbr: 'FL' },
  { name: 'Georgia', abbr: 'GA' },
  { name: 'Hawaii', abbr: 'HI' },
  { name: 'Idaho', abbr: 'ID' },
  { name: 'Illinois', abbr: 'IL' },
  { name: 'Indiana', abbr: 'IN' },
  { name: 'Iowa', abbr: 'IA' },
  { name: 'Kansas', abbr: 'KS' },
  { name: 'Kentucky', abbr: 'KY' },
  { name: 'Louisiana', abbr: 'LA' },
  { name: 'Maine', abbr: 'ME' },
  { name: 'Maryland', abbr: 'MD' },
  { name: 'Massachusetts', abbr: 'MA' },
  { name: 'Michigan', abbr: 'MI' },
  { name: 'Minnesota', abbr: 'MN' },
  { name: 'Mississippi', abbr: 'MS' },
  { name: 'Missouri', abbr: 'MO' },
  { name: 'Montana', abbr: 'MT' },
  { name: 'Nebraska', abbr: 'NE' },
  { name: 'Nevada', abbr: 'NV' },
  { name: 'New Hampshire', abbr: 'NH' },
  { name: 'New Jersey', abbr: 'NJ' },
  { name: 'New Mexico', abbr: 'NM' },
  { name: 'New York', abbr: 'NY' },
  { name: 'North Carolina', abbr: 'NC' },
  { name: 'North Dakota', abbr: 'ND' },
  { name: 'Ohio', abbr: 'OH' },
  { name: 'Oklahoma', abbr: 'OK' },
  { name: 'Oregon', abbr: 'OR' },
  { name: 'Pennsylvania', abbr: 'PA' },
  { name: 'Rhode Island', abbr: 'RI' },
  { name: 'South Carolina', abbr: 'SC' },
  { name: 'South Dakota', abbr: 'SD' },
  { name: 'Tennessee', abbr: 'TN' },
  { name: 'Texas', abbr: 'TX' },
  { name: 'Utah', abbr: 'UT' },
  { name: 'Vermont', abbr: 'VT' },
  { name: 'Virginia', abbr: 'VA' },
  { name: 'Washington', abbr: 'WA' },
  { name: 'West Virginia', abbr: 'WV' },
  { name: 'Wisconsin', abbr: 'WI' },
  { name: 'Wyoming', abbr: 'WY' },
];

// Common city name patterns and landmarks
const CITY_PATTERNS = [
  { prefix: 'New', suffix: ['York', 'Orleans', 'Haven', 'Port', 'London'] },
  { prefix: 'San', suffix: ['Francisco', 'Diego', 'Antonio', 'Jose'] },
  { prefix: 'Saint', suffix: ['Louis', 'Paul', 'Petersburg'] },
  { prefix: 'Fort', suffix: ['Worth', 'Wayne', 'Lauderdale'] },
  { prefix: 'Lake', suffix: ['City', 'View', 'Park'] },
  { prefix: 'Green', suffix: ['Bay', 'Valley', 'Springs'] },
  { prefix: 'Spring', suffix: ['Field', 'Hill', 'Valley'] },
  { prefix: 'Mount', suffix: ['Vernon', 'Pleasant', 'View'] },
];

const LANDMARKS = [
  'Downtown District',
  'City Center',
  'Main Street',
  'Historic District',
  'Business Park',
  'Industrial Area',
  'University Campus',
  'Medical Center',
  'Shopping Mall',
  'Airport',
  'Port',
  'Stadium',
  'Convention Center',
];

const AREA_CODES: Record<string, string[]> = {
  'AL': ['205', '251', '256', '334'],
  'AK': ['907'],
  'AZ': ['480', '520', '602', '623', '928'],
  'AR': ['479', '501', '870'],
  'CA': ['209', '213', '310', '323', '408', '415', '510', '530', '559', '562', '619', '626', '650', '661', '707', '714', '760', '805', '818', '831', '858', '909', '916', '925', '949', '951'],
  'CO': ['303', '719', '970'],
  'CT': ['203', '860'],
  'DE': ['302'],
  'FL': ['305', '321', '352', '386', '407', '561', '727', '754', '772', '786', '813', '850', '863', '904', '941', '954'],
  'GA': ['229', '404', '470', '478', '678', '706', '762', '770', '912'],
  'HI': ['808'],
  'ID': ['208'],
  'IL': ['217', '224', '309', '312', '618', '630', '708', '773', '815', '847'],
  'IN': ['219', '260', '317', '574', '765', '812'],
  'IA': ['319', '515', '563', '641', '712'],
  'KS': ['316', '620', '785', '913'],
  'KY': ['270', '502', '606', '859'],
  'LA': ['225', '318', '337', '504', '985'],
  'ME': ['207'],
  'MD': ['240', '301', '410', '443'],
  'MA': ['339', '351', '413', '508', '617', '774', '781', '857', '978'],
  'MI': ['231', '248', '269', '313', '517', '586', '616', '734', '810', '906', '989'],
  'MN': ['218', '320', '507', '612', '651', '763', '952'],
  'MS': ['228', '601', '662', '769'],
  'MO': ['314', '417', '573', '636', '660', '816'],
  'MT': ['406'],
  'NE': ['308', '402', '531'],
  'NV': ['702', '775'],
  'NH': ['603'],
  'NJ': ['201', '551', '609', '732', '848', '856', '862', '908', '973'],
  'NM': ['505', '575'],
  'NY': ['212', '315', '347', '516', '518', '585', '607', '631', '646', '716', '718', '845', '914', '917'],
  'NC': ['252', '336', '704', '828', '910', '919', '980', '984'],
  'ND': ['701'],
  'OH': ['216', '330', '419', '440', '513', '567', '614', '740', '937'],
  'OK': ['405', '539', '580', '918'],
  'OR': ['458', '503', '541', '971'],
  'PA': ['215', '267', '272', '412', '484', '570', '610', '717', '724', '814', '878'],
  'RI': ['401'],
  'SC': ['803', '843', '854', '864'],
  'SD': ['605'],
  'TN': ['423', '615', '731', '865', '901', '931'],
  'TX': ['210', '214', '254', '281', '325', '361', '409', '430', '432', '469', '512', '713', '737', '806', '817', '830', '832', '903', '915', '936', '940', '956', '972', '979'],
  'UT': ['385', '435', '801'],
  'VT': ['802'],
  'VA': ['276', '434', '540', '571', '703', '757', '804'],
  'WA': ['206', '253', '360', '425', '509'],
  'WV': ['304', '681'],
  'WI': ['262', '414', '534', '608', '715', '920'],
  'WY': ['307'],
};

/**
 * Generate a random city with realistic data
 */
function generateCity(state: { name: string; abbr: string }, index: number): City {
  const cityNames = [
    `${state.name} City ${index + 1}`,
    `North ${state.name.substring(0, 5)}`,
    `South ${state.name.substring(0, 5)}`,
    `East ${state.name.substring(0, 5)}`,
    `West ${state.name.substring(0, 5)}`,
  ];

  const name = cityNames[Math.floor(Math.random() * cityNames.length)];
  
  // Generate realistic coordinates within state bounds (simplified)
  const latitude = 25 + (Math.random() * 25); // Rough US latitude range
  const longitude = -125 + (Math.random() * 60); // Rough US longitude range
  
  // Generate population (10k to 500k)
  const population = Math.floor(10000 + Math.random() * 490000);
  
  // Get area code for state
  const areaCodes = AREA_CODES[state.abbr] || ['555'];
  const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
  
  // Generate landmark
  const landmark = LANDMARKS[Math.floor(Math.random() * LANDMARKS.length)];
  
  // Generate neighboring towns
  const numNeighbors = 3 + Math.floor(Math.random() * 3);
  const neighboringTowns: string[] = [];
  for (let i = 0; i < numNeighbors; i++) {
    neighboringTowns.push(`Neighbor ${i + 1}`);
  }
  
  // Generate zip codes
  const zipCodes: string[] = [];
  const baseZip = Math.floor(10000 + Math.random() * 90000);
  for (let i = 0; i < 3; i++) {
    zipCodes.push(String(baseZip + i));
  }

  return {
    name,
    state: state.name,
    stateAbbr: state.abbr,
    latitude,
    longitude,
    population,
    areaCode,
    majorLandmark: landmark,
    neighboringTowns,
    zipCodes,
  };
}

/**
 * Generate cities for all states
 */
function generateCities(countPerState: number = 10): City[] {
  const cities: City[] = [];
  
  US_STATES.forEach((state, stateIndex) => {
    for (let i = 0; i < countPerState; i++) {
      cities.push(generateCity(state, i));
    }
  });
  
  return cities;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const options: { count?: number; output?: string; import?: string } = {};
  
  args.forEach(arg => {
    if (arg.startsWith('--count=')) {
      options.count = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--output=')) {
      options.output = arg.split('=')[1];
    } else if (arg.startsWith('--import=')) {
      options.import = arg.split('=')[1];
    }
  });

  if (options.import) {
    console.log('Import mode not yet implemented. Use scripts/import-cities.ts instead.');
    process.exit(1);
  }

  const countPerState = options.count || 10;
  const outputPath = options.output || path.join(process.cwd(), 'data', 'cities.json');
  
  console.log(`Generating ${countPerState} cities per state (${US_STATES.length} states = ${countPerState * US_STATES.length} total cities)...`);
  
  const cities = generateCities(countPerState);
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write to file
  fs.writeFileSync(outputPath, JSON.stringify(cities, null, 2));
  
  console.log(`✅ Generated ${cities.length} cities`);
  console.log(`✅ Saved to ${outputPath}`);
  console.log(`\nStatistics:`);
  console.log(`- Total cities: ${cities.length}`);
  console.log(`- States covered: ${US_STATES.length}`);
  console.log(`- Average population: ${Math.round(cities.reduce((sum, c) => sum + c.population, 0) / cities.length).toLocaleString()}`);
  console.log(`\nNext steps:`);
  console.log(`1. Review the generated cities in ${outputPath}`);
  console.log(`2. Replace with real city data from a reliable source`);
  console.log(`3. Run: npm run build`);
}

main().catch(console.error);

