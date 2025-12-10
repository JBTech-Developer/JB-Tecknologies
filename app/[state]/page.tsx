import { redirect } from 'next/navigation';
import { getStateBySlug } from '@/lib/cities';

// Redirect old /[state] routes to /[state]/network-cabling for backwards compatibility
export default async function OldStatePage({
  params,
}: {
  params: Promise<{ state: string }> | { state: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const stateData = getStateBySlug(resolvedParams.state);
  
  if (stateData) {
    const stateSlug = stateData.name.toLowerCase().replace(/\s+/g, '-');
    redirect(`/${stateSlug}/network-cabling`);
  }
  
  // If state not found, redirect to home
  redirect('/');
}
