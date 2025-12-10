import { redirect } from 'next/navigation';
import { getCityBySlugSync } from '@/lib/cities';

// Redirect old /[state]/[city]-network-cabling routes to new service structure
// Default service is "voice-data-cabling-installers" (Voice & Data Cabling)
export default async function OldCityPage({
  params,
}: {
  params: { state: string; city: string };
}) {
  // Extract city slug by removing '-network-cabling' suffix
  const citySlug = params.city.replace('-network-cabling', '');
  const city = getCityBySlugSync(params.state, citySlug);
  
  if (city) {
    // Redirect to default service page (Voice & Data Cabling)
    redirect(`/${params.state}/${citySlug}/voice-data-cabling-installers`);
  }
  
  // If city not found, redirect to state page
  redirect(`/${params.state}/network-cabling`);
}
