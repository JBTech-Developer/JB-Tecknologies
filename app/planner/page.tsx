import type { Metadata } from 'next';
import ProjectPlanner from '@/components/ProjectPlanner';

export const metadata: Metadata = {
  title: 'Project Planning Tool - Upload Plans for Free Quote | JB Technologies',
  description:
    'Upload your project plans for a free quote on low-voltage, structured cabling, DAS, ERCES, security, AV, or IT network installation. JB Technologies project planning tool for commercial facilities.',
  keywords:
    'upload project plans, low voltage quote, structured cabling estimate, DAS installation planning, commercial technology planning tool, project planning tool',
  openGraph: {
    title: 'Project Planning Tool - Upload Plans for Free Quote | JB Technologies',
    description:
      'Upload your project plans for a free quote on low-voltage, structured cabling, DAS, ERCES, security, AV, or IT network installation.',
    url: 'https://jbtechnologies.com/planner',
    type: 'website',
  },
};

export default function PlannerPage() {
  return <ProjectPlanner />;
}

