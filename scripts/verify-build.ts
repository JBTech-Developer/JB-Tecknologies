/**
 * Build Verification Script
 * 
 * This script verifies that the project is ready for production build.
 * Run: npm run verify-build
 * 
 * Checks:
 * - Environment variables
 * - City data availability
 * - API configurations
 * - Route structure
 */

import { getAllCitiesSync, getAllStates } from '../lib/cities';
import fs from 'fs';
import path from 'path';

interface VerificationResult {
  check: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const results: VerificationResult[] = [];

function addResult(check: string, status: 'pass' | 'fail' | 'warning', message: string) {
  results.push({ check, status, message });
}

async function verifyEnvironment() {
  console.log('🔍 Verifying environment variables...\n');
  
  const required = [
    'NEXT_PUBLIC_BASE_URL',
  ];
  
  const recommended = [
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
    'ZOHO_WEBHOOK_URL',
    'ZOHO_MAZZY_ID',
    'ZOHO_PRESTON_ID',
  ];
  
  // Check required
  required.forEach(key => {
    if (process.env[key]) {
      addResult(`Required: ${key}`, 'pass', 'Set');
    } else {
      addResult(`Required: ${key}`, 'fail', 'Missing - Set in .env.local');
    }
  });
  
  // Check recommended
  recommended.forEach(key => {
    if (process.env[key]) {
      addResult(`Recommended: ${key}`, 'pass', 'Set');
    } else {
      addResult(`Recommended: ${key}`, 'warning', 'Not set - Some features may not work');
    }
  });
}

function verifyCityData() {
  console.log('🔍 Verifying city data...\n');
  
  const cities = getAllCitiesSync();
  const states = getAllStates();
  
  if (cities.length === 0) {
    addResult('City Data', 'fail', 'No cities found. Load city data first.');
    return;
  }
  
  if (cities.length < 10) {
    addResult('City Data', 'warning', `Only ${cities.length} cities loaded. Consider adding more for production.`);
  } else {
    addResult('City Data', 'pass', `${cities.length} cities loaded`);
  }
  
  // Validate city structure
  const invalidCities = cities.filter(city => 
    !city.name || 
    !city.state || 
    !city.stateAbbr || 
    typeof city.latitude !== 'number' || 
    typeof city.longitude !== 'number' ||
    typeof city.population !== 'number'
  );
  
  if (invalidCities.length > 0) {
    addResult('City Data Structure', 'fail', `${invalidCities.length} cities have invalid data structure`);
  } else {
    addResult('City Data Structure', 'pass', 'All cities have valid structure');
  }
  
  addResult('States Coverage', 'pass', `${states.length} states covered`);
  
  // Check for JSON file
  const jsonPath = path.join(process.cwd(), 'data', 'cities.json');
  if (fs.existsSync(jsonPath)) {
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    addResult('JSON Data File', 'pass', `Found data/cities.json with ${jsonData.length} cities`);
  } else {
    addResult('JSON Data File', 'warning', 'No data/cities.json found. Using fallback data.');
  }
}

function verifyRoutes() {
  console.log('🔍 Verifying route structure...\n');
  
  const routeFiles = [
    'app/[state]-network-cabling/page.tsx',
    'app/[state]/[city]/page.tsx',
    'app/api/leads/route.ts',
    'app/api/og/route.tsx',
    'app/sitemap.ts',
    'app/sitemap-index/route.ts',
    'app/sitemap-[state]/route.ts',
  ];
  
  routeFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      addResult(`Route: ${file}`, 'pass', 'Exists');
    } else {
      addResult(`Route: ${file}`, 'fail', 'Missing');
    }
  });
}

function verifyComponents() {
  console.log('🔍 Verifying components...\n');
  
  const components = [
    'components/LeadForm.tsx',
    'components/MobileLeadButton.tsx',
    'components/Header.tsx',
    'components/Footer.tsx',
  ];
  
  components.forEach(comp => {
    const filePath = path.join(process.cwd(), comp);
    if (fs.existsSync(filePath)) {
      addResult(`Component: ${comp}`, 'pass', 'Exists');
    } else {
      addResult(`Component: ${comp}`, 'fail', 'Missing');
    }
  });
}

function verifyLibFiles() {
  console.log('🔍 Verifying library files...\n');
  
  const libFiles = [
    'lib/cities.ts',
    'lib/content-generator.ts',
    'lib/maps.ts',
    'lib/schema.ts',
    'lib/sitemap-splitter.ts',
  ];
  
  libFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      addResult(`Library: ${file}`, 'pass', 'Exists');
    } else {
      addResult(`Library: ${file}`, 'fail', 'Missing');
    }
  });
}

function printResults() {
  console.log('\n📋 Verification Results:\n');
  console.log('─'.repeat(60));
  
  const passes = results.filter(r => r.status === 'pass').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const fails = results.filter(r => r.status === 'fail').length;
  
  results.forEach(result => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} ${result.check}`);
    console.log(`   ${result.message}`);
    console.log('');
  });
  
  console.log('─'.repeat(60));
  console.log(`\nSummary: ${passes} passed, ${warnings} warnings, ${fails} failed\n`);
  
  if (fails > 0) {
    console.log('❌ Build verification failed. Please fix the issues above.\n');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('⚠️  Build verification passed with warnings. Review the warnings above.\n');
  } else {
    console.log('✅ Build verification passed! Ready for production.\n');
  }
}

async function main() {
  console.log('🚀 JB Technologies - Build Verification\n');
  console.log('='.repeat(60));
  console.log('');
  
  await verifyEnvironment();
  verifyCityData();
  verifyRoutes();
  verifyComponents();
  verifyLibFiles();
  printResults();
}

main().catch(console.error);

