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
  // Use exact template format as specified by client
  // Template: "JB Technologies provides certified low voltage cabling for businesses in {City} and the surrounding {County} region. We actively serve the {Zip_Code} area."
  const primaryZipCode = city.zipCodes && city.zipCodes.length > 0 ? city.zipCodes[0] : 'local';
  const county = city.county || `${city.name} County`;
  
  const introduction = `JB Technologies provides certified low voltage cabling for businesses in ${city.name} and the surrounding ${county} region. We actively serve the ${primaryZipCode} area.`;

  // Fallback content if OpenAI API is not configured
  const openai = getOpenAIClient();
  if (!openai) {
    return {
      introduction,
      services: `We offer comprehensive low-voltage solutions including Cat6 data cabling, fiber optic installation, and network infrastructure design. Our team serves ${city.name} businesses with reliable, code-compliant installations.`,
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
      services: `We offer comprehensive low-voltage solutions including Cat6 data cabling, fiber optic installation, and structured cabling systems for businesses in ${city.name}.`,
      serviceArea: servicesResponse.choices[0]?.message?.content || `We proudly serve ${city.name} and surrounding areas including ${city.neighboringTowns?.slice(0, 3).join(', ') || 'nearby communities'}.`,
    };
  } catch (error) {
    console.error('Error generating content:', error);
    // Return fallback content on error (always use exact template format)
    return {
      introduction, // Always use the exact template format
      services: `We offer comprehensive low-voltage solutions including Cat6 data cabling, fiber optic installation, and network infrastructure design.`,
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
  
  // Use generic template format: "JB Technologies provides [service] for businesses in {City} and the surrounding {County} region. We actively serve the {Zip_Code} area."
  // This ensures uniqueness while maintaining the required format
  const serviceNameLower = service.service_name.toLowerCase();
  const introduction = `JB Technologies provides ${serviceNameLower} for businesses in ${city.name} and the surrounding ${county} region. We actively serve the ${primaryZipCode} area.`;

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

