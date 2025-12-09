import { redirect } from 'next/navigation';
import { getStateBySlug } from '@/lib/cities';

// Redirect old /[state] routes to /[state]-network-cabling for backwards compatibility
export default async function OldStatePage({
  params,
}: {
  params: { state: string };
}) {
  const stateData = getStateBySlug(params.state);
  
  if (stateData) {
    const stateSlug = stateData.name.toLowerCase().replace(/\s+/g, '-');
    redirect(`/${stateSlug}-network-cabling`);
  }
  
  // If state not found, redirect to home
  redirect('/');
}
