import OpenAI from 'openai';
import { City, Service } from './types';
import { generateExpertServiceContent } from './service-expertise';

// Lazy initialization of OpenAI client to avoid issues during module load
function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  try {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } catch (error) {
    console.error('Error initializing OpenAI client:', error);
    return null;
  }
}

export async function generateCityContent(city: City): Promise<{
  introduction: string;
  services: string;
  serviceArea: string;
}> {
  // Use persuasive business-focused template format
  // Format: "Get your {City} business online faster. JB Technologies provides reliable, certified network cabling that passes inspection the first time. Stop dealing with slow WiFi and messy server rooms—we keep {County} businesses connected and code-compliant."
  const primaryZipCode = city.zipCodes && city.zipCodes.length > 0 ? city.zipCodes[0] : 'local';
  const county = city.county || `${city.name} County`;
  
  // Exact format: Pain Point + Solution + Location
  const areaCode = city.areaCode || '';
  const locationText = areaCode ? `Serving the ${city.name} and ${areaCode} region.` : `Serving ${city.name} and the surrounding ${county} region.`;
  const introduction = `Get your ${city.name} business online faster. JB Technologies provides reliable, certified network cabling that passes inspection the first time. Stop dealing with slow WiFi and messy server rooms—we keep ${county} businesses connected and code-compliant. ${locationText}`;

  // Fallback content if OpenAI API is not configured
  const openai = getOpenAIClient();
  if (!openai) {
    return {
      introduction,
      services: `Stop losing productivity to network downtime. Our certified technicians install enterprise-grade Cat6 and fiber optic cabling that keeps ${city.name} businesses running smoothly. We handle everything from design to inspection—no headaches, no callbacks.`,
      serviceArea: `We proudly serve ${city.name} and surrounding areas including ${city.neighboringTowns?.slice(0, 3).join(', ') || 'nearby communities'}. Our service area covers zip codes ${city.zipCodes?.slice(0, 3).join(', ') || primaryZipCode} throughout ${city.state}.`,
    };
  }

  try {
    const introductionPrompt = `Write a 150-word introduction for a network cabling service page in ${city.name}, ${city.stateAbbr}. Mention specific challenges of wiring buildings near ${city.majorLandmark || 'downtown'}. Tone: Professional, Contractor-focused.`;

    const servicesPrompt = `List the top 5 neighborhoods in ${city.name} and confirm we service zip codes starting with ${city.areaCode || 'local'}. Format as a paragraph describing our service coverage.`;

    const [introductionResponse, servicesResponse] = await Promise.all([
      openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: introductionPrompt }],
        max_tokens: 200,
        temperature: 0.7,
      }),
      openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: servicesPrompt }],
        max_tokens: 150,
        temperature: 0.7,
      }),
    ]);

    return {
      introduction, // Always use the exact template format
      services: `Stop losing productivity to network downtime. Our certified technicians install enterprise-grade Cat6 and fiber optic cabling that keeps ${city.name} businesses running smoothly. We handle everything from design to inspection—no headaches, no callbacks.`,
      serviceArea: servicesResponse.choices[0]?.message?.content || `We proudly serve ${city.name} and surrounding areas including ${city.neighboringTowns?.slice(0, 3).join(', ') || 'nearby communities'}.`,
    };
  } catch (error) {
    console.error('Error generating content:', error);
    // Return fallback content on error (always use exact template format)
    return {
      introduction, // Always use the exact template format
      services: `Stop losing productivity to network downtime. Our certified technicians install enterprise-grade Cat6 and fiber optic cabling that keeps businesses running smoothly. We handle everything from design to inspection—no headaches, no callbacks.`,
      serviceArea: `We proudly serve ${city.name} and surrounding areas including ${city.neighboringTowns?.slice(0, 3).join(', ') || 'nearby communities'}.`,
    };
  }
}

/**
 * Generate service-specific content for a city-service combination
 * This creates unique content for each service vertical in each city
 */
export async function generateServiceCityContent(city: City, service: Service): Promise<{
  introduction: string;
  services: string;
  serviceArea: string;
  overview: string;
  technicalSpecs: string[];
  useCases: string[];
  benefits: string[];
  installationProcess: string;
  certifications: string[];
  whyChooseUs: string;
}> {
  const primaryZipCode = city.zipCodes && city.zipCodes.length > 0 ? city.zipCodes[0] : 'local';
  const county = city.county || `${city.name} County`;
  const areaCode = city.areaCode || '';
  
  // New persuasive template: Pain Point + Solution + Location
  // Format: "Get your {City} business online faster. JB Technologies provides reliable, certified network cabling that passes inspection the first time. Stop dealing with slow WiFi and messy server rooms—we keep {County} businesses connected and code-compliant."
  
  // Determine pain points and solutions based on service category
  const getPainPointsAndSolutions = (service: Service) => {
    const category = service.category?.toLowerCase() || '';
    const serviceName = service.service_name.toLowerCase();
    
    if (category.includes('cabling') || serviceName.includes('cabling')) {
      return {
        pain: 'slow WiFi and messy server rooms',
        solution: 'reliable, certified network cabling that passes inspection the first time',
        benefit: 'connected and code-compliant'
      };
    } else if (category.includes('wireless') || serviceName.includes('wifi') || serviceName.includes('wireless')) {
      return {
        pain: 'dead zones and dropped connections',
        solution: 'enterprise-grade WiFi installation that keeps your team productive',
        benefit: 'connected and productive'
      };
    } else if (category.includes('security') || serviceName.includes('cctv') || serviceName.includes('camera')) {
      return {
        pain: 'security blind spots and unreliable monitoring',
        solution: 'professional security camera systems with remote access that protect your assets',
        benefit: 'secure and protected'
      };
    } else if (category.includes('access control')) {
      return {
        pain: 'key management headaches and security gaps',
        solution: 'modern access control systems with mobile credentials that streamline operations',
        benefit: 'secure and streamlined'
      };
    } else if (category.includes('fire alarm') || serviceName.includes('fire')) {
      return {
        pain: 'code compliance worries and false alarms',
        solution: 'NICET-certified fire alarm systems that pass inspection the first time',
        benefit: 'code-compliant and safe'
      };
    } else if (category.includes('audio visual') || serviceName.includes('video') || serviceName.includes('audio')) {
      return {
        pain: 'outdated meeting rooms and poor audio quality',
        solution: 'professional AV installation that enhances collaboration',
        benefit: 'productive and professional'
      };
    } else {
      return {
        pain: 'downtime and unreliable systems',
        solution: `certified ${service.service_name.toLowerCase()} that keeps your business running smoothly`,
        benefit: 'operational and efficient'
      };
    }
  };
  
  const { pain, solution, benefit } = getPainPointsAndSolutions(service);
  
  // Exact format: Pain Point + Solution + Location
  // "Get your {City} business online faster. JB Technologies provides [solution]. Stop dealing with [pain]—we keep {County} businesses [benefit]. Serving the {City} and {Area_Code} region."
  const locationText = areaCode ? `Serving the ${city.name} and ${areaCode} region.` : `Serving ${city.name} and the surrounding ${county} region.`;
  const introduction = `Get your ${city.name} business online faster. JB Technologies provides ${solution}. Stop dealing with ${pain}—we keep ${county} businesses ${benefit}. ${locationText}`;

  // Get expert service content
  const expertise = generateExpertServiceContent(service, {
    name: city.name,
    stateAbbr: city.stateAbbr,
    county: city.county,
    zipCodes: city.zipCodes
  });

  // Fallback content if OpenAI API is not configured
  const openai = getOpenAIClient();
  if (!openai) {
    return {
      introduction,
      services: expertise.overview,
      serviceArea: `We proudly serve ${city.name} and surrounding areas including ${city.neighboringTowns?.slice(0, 3).join(', ') || 'nearby communities'}. Our service area covers zip codes ${city.zipCodes?.slice(0, 3).join(', ') || primaryZipCode} throughout ${city.state}.`,
      overview: expertise.overview,
      technicalSpecs: expertise.technicalSpecs,
      useCases: expertise.useCases,
      benefits: expertise.benefits,
      installationProcess: expertise.installationProcess,
      certifications: expertise.certifications,
      whyChooseUs: expertise.whyChooseUs,
    };
  }

  try {
    // Enhanced prompts for better content generation
    const servicesPrompt = `Write a detailed 200-word description of ${service.service_name} services in ${city.name}, ${city.stateAbbr}. Include technical details, common applications, and benefits. Tone: Professional, Expert-level.`;

    const serviceAreaPrompt = `List the top 5 neighborhoods in ${city.name} where we provide ${service.service_name.toLowerCase()} and confirm we service zip codes starting with ${city.areaCode || 'local'}. Format as a paragraph describing our service coverage.`;

    const [servicesResponse, serviceAreaResponse] = await Promise.all([
      openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: servicesPrompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
      openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: serviceAreaPrompt }],
        max_tokens: 150,
        temperature: 0.7,
      }),
    ]);

    return {
      introduction, // Always use the template format with city, county, zip code
      services: servicesResponse.choices[0]?.message?.content || expertise.overview,
      serviceArea: serviceAreaResponse.choices[0]?.message?.content || `We proudly serve ${city.name} and surrounding areas including ${city.neighboringTowns?.slice(0, 3).join(', ') || 'nearby communities'}.`,
      overview: expertise.overview,
      technicalSpecs: expertise.technicalSpecs,
      useCases: expertise.useCases,
      benefits: expertise.benefits,
      installationProcess: expertise.installationProcess,
      certifications: expertise.certifications,
      whyChooseUs: expertise.whyChooseUs,
    };
  } catch (error) {
    console.error('Error generating content:', error);
    // Return fallback content on error (always use template format)
    return {
      introduction, // Always use the template format
      services: expertise.overview,
      serviceArea: `We proudly serve ${city.name} and surrounding areas including ${city.neighboringTowns?.slice(0, 3).join(', ') || 'nearby communities'}.`,
      overview: expertise.overview,
      technicalSpecs: expertise.technicalSpecs,
      useCases: expertise.useCases,
      benefits: expertise.benefits,
      installationProcess: expertise.installationProcess,
      certifications: expertise.certifications,
      whyChooseUs: expertise.whyChooseUs,
    };
  }
}

