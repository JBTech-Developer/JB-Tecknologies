import { NextRequest, NextResponse } from 'next/server';

const SALES_EMAIL = 'sales@jbtecknologies.com';
const CRM_PARSER_EMAIL = 'mxh4xqc@parser.zohocrm.com';
const FORM_ENDPOINT_BASE = 'https://formsubmit.co/ajax/';

interface FileInfo {
  name: string;
  size: number;
}

interface SubmissionPayload {
  project: {
    projectType: string;
    location: string;
    timeline: string;
    budget: string;
    services: string[];
    rfpFile: FileInfo | null;
  };
  contact: {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;
    projectNotes: string;
    projectDetails: string;
  };
  newsletter: boolean;
}

function buildPlannerPayload({ project, contact, newsletter }: SubmissionPayload) {
  const servicesSelected = project.services.length ? project.services.join(', ') : 'Not specified';
  const contactName = [contact.firstName, contact.lastName].filter(Boolean).join(' ') || 'Not specified';
  const rfpName = project.rfpFile ? project.rfpFile.name : 'No attachment';
  const rfpSize = project.rfpFile ? `${(project.rfpFile.size / 1024 / 1024).toFixed(2)} MB` : '—';

  return {
    _subject: 'Project Planning Tool Submission',
    _template: 'table',
    _captcha: 'false',
    'Project Type': project.projectType || 'Not specified',
    'Project Location': project.location || 'Not specified',
    Timeline: project.timeline || 'Not specified',
    Budget: project.budget || 'Not specified',
    'Requested Services': servicesSelected,
    'Attachment Name': rfpName,
    'Attachment Size': rfpSize,
    'Contact Name': contactName,
    Organization: contact.company || 'Not specified',
    Email: contact.email || 'Not specified',
    Phone: contact.phone || 'Not specified',
    'Working Title / Facility': contact.projectNotes || 'Not provided',
    'Project Details': contact.projectDetails || 'Not provided',
    'Newsletter Opt-In': newsletter ? 'Yes' : 'No',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmissionPayload = await request.json();

    // Validate required fields
    if (!body.contact?.email || !body.contact?.firstName || !body.contact?.lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payload = buildPlannerPayload(body);
    const recipients = [SALES_EMAIL, CRM_PARSER_EMAIL];

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    };

    // Send to all recipients
    const results = await Promise.allSettled(
      recipients.map((email) =>
        fetch(`${FORM_ENDPOINT_BASE}${encodeURIComponent(email)}`, requestOptions).then((response) => {
          if (!response.ok) {
            throw new Error(`Submission failed for ${email}`);
          }
          return response.json();
        })
      )
    );

    // Check if at least one submission succeeded
    const hasSuccess = results.some((result) => result.status === 'fulfilled');

    if (!hasSuccess) {
      console.error('All planner submissions failed:', results);
      return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Submission received' });
  } catch (error) {
    console.error('Planner submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

