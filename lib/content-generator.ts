import OpenAI from 'openai';
import { City } from './types';

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
  // Fallback content if OpenAI API is not configured
  const openai = getOpenAIClient();
  if (!openai) {
    return {
      introduction: `JB Technologies provides professional network cabling services in ${city.name}, ${city.stateAbbr}. Our certified technicians specialize in structured cabling installations for businesses throughout the ${city.name} metropolitan area.`,
      services: `We offer comprehensive low-voltage solutions including Cat6 data cabling, fiber optic installation, and network infrastructure design. Our team serves ${city.name} businesses with reliable, code-compliant installations.`,
      serviceArea: `We proudly serve ${city.name} and surrounding areas including ${city.neighboringTowns?.slice(0, 3).join(', ') || 'nearby communities'}. Our service area covers zip codes starting with ${city.areaCode || 'local'} throughout ${city.state}.`,
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
      introduction: introductionResponse.choices[0]?.message?.content || '',
      services: `We offer comprehensive low-voltage solutions including Cat6 data cabling, fiber optic installation, and structured cabling systems for businesses in ${city.name}.`,
      serviceArea: servicesResponse.choices[0]?.message?.content || '',
    };
  } catch (error) {
    console.error('Error generating content:', error);
    // Return fallback content on error
    return {
      introduction: `JB Technologies provides professional network cabling services in ${city.name}, ${city.stateAbbr}. Our certified technicians specialize in structured cabling installations for businesses throughout the ${city.name} metropolitan area.`,
      services: `We offer comprehensive low-voltage solutions including Cat6 data cabling, fiber optic installation, and network infrastructure design.`,
      serviceArea: `We proudly serve ${city.name} and surrounding areas including ${city.neighboringTowns?.slice(0, 3).join(', ') || 'nearby communities'}.`,
    };
  }
}

