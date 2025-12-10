import { Service } from './types';
import fs from 'fs';
import path from 'path';

/**
 * Load services from JSON file
 */
let cachedServices: Service[] | null = null;

export function getAllServicesSync(): Service[] {
  if (cachedServices) {
    return cachedServices;
  }

  try {
    const jsonPath = path.join(process.cwd(), 'data', 'services.json');
    if (fs.existsSync(jsonPath)) {
      const fileContents = fs.readFileSync(jsonPath, 'utf-8');
      const services: Service[] = JSON.parse(fileContents);
      
      // Validate service structure
      const validServices = services.filter(service => 
        service.service_name && 
        service.slug &&
        service.category &&
        service.meta_desc_template &&
        service.hero_overlay_text &&
        typeof service.service_name === 'string' &&
        typeof service.slug === 'string'
      );
      
      if (validServices.length === 0) {
        console.warn('No valid services found in services.json, using fallback');
      } else {
        console.log(`Loaded ${validServices.length} services from services.json`);
      }
      
      cachedServices = validServices.length > 0 ? validServices : null; // Set to null to use fallback
      return validServices.length > 0 ? validServices : getFallbackServices();
    } else {
      console.warn('services.json not found, using fallback services');
    }
  } catch (error) {
    console.error('Error loading services from JSON:', error);
  }
  
  return getFallbackServices();
}

function getFallbackServices(): Service[] {
  // Fallback to default services (using new structure)
  const fallback: Service[] = [
    {
      category: 'Structured Cabling',
      service_name: 'Voice & Data Cabling (Cat6/Cat6A)',
      slug: 'voice-data-cabling-installers',
      meta_desc_template: 'Certified Cat5e, Cat6, and Cat6A structured cabling installers in {City}. We provide low-voltage wiring for offices, warehouses, and new construction.',
      hero_overlay_text: 'Data Cabling: {City}',
      keywords: ['Cat6', 'Cat6a', 'structured cabling', 'data cabling', 'network cabling'],
    },
    {
      category: 'Structured Cabling',
      service_name: 'Fiber Optic Cabling (Single/Multi-Mode)',
      slug: 'fiber-optic-cabling-installation',
      meta_desc_template: 'Fiber optic backbone cabling in {City}. We install OS2 Single-mode and OM3/OM4 Multi-mode fiber for campus networks and server rooms.',
      hero_overlay_text: 'Fiber Optics: {City}',
      keywords: ['fiber optic', 'fiber splicing', 'fiber installation', 'fiber repair'],
    },
  ];
  
  return fallback;
}

export function getServiceBySlug(slug: string): Service | null {
  const services = getAllServicesSync();
  return services.find(service => service.slug === slug) || null;
}

