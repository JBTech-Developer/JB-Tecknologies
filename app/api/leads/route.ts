import { NextRequest, NextResponse } from 'next/server';

interface LeadData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  projectDetails: string;
  facilityType: string;
  city: string;
  state: string;
}

// Lead Routing Logic
function routeLead(projectDetails: string, facilityType: string) {
  // Check for enterprise indicators in project details
  const projectDetailsLower = projectDetails.toLowerCase();
  const hasEnterpriseKeywords = 
    projectDetailsLower.includes('200+') ||
    projectDetailsLower.includes('enterprise') ||
    projectDetailsLower.includes('multiple locations') ||
    projectDetailsLower.includes('campus') ||
    projectDetailsLower.includes('data center') ||
    facilityType === 'Warehouse';

  // Check for small business indicators
  const hasSmallBusinessKeywords =
    projectDetailsLower.includes('1-10') ||
    projectDetailsLower.includes('small') ||
    projectDetailsLower.includes('single location') ||
    projectDetailsLower.includes('office');

  if (hasEnterpriseKeywords) {
    return {
      owner: process.env.ZOHO_PRESTON_ID || 'Preston_Brown_ID',
      tag: 'Enterprise_Opp_High_Value',
      priority: 'Urgent',
    };
  } else if (hasSmallBusinessKeywords) {
    return {
      owner: process.env.ZOHO_MAZZY_ID || 'Mazzy_ID',
      tag: 'Small_Business_Lead',
      priority: 'Normal',
    };
  }

  // Default routing
  return {
    owner: process.env.ZOHO_DEFAULT_OWNER || 'Default_ID',
    tag: 'General_Lead',
    priority: 'Normal',
  };
}

export async function POST(request: NextRequest) {
  try {
    const data: LeadData = await request.json();

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.projectDetails || !data.facilityType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Route the lead based on business logic
    const routing = routeLead(data.projectDetails, data.facilityType);

    // Prepare Zoho payload
    const zohoPayload = {
      First_Name: data.firstName,
      Last_Name: data.lastName,
      Company: data.companyName,
      Email: data.email,
      Phone: data.phone,
      Project_Details: data.projectDetails,
      Facility_Type: data.facilityType,
      City: data.city,
      State: data.state,
      Owner: routing.owner,
      Tag: routing.tag,
      Priority: routing.priority,
      Lead_Source: 'Website',
      Description: `Lead from ${data.city}, ${data.state}. Facility Type: ${data.facilityType}. Project Details: ${data.projectDetails}`,
    };

    // Send to Zoho CRM
    const zohoWebhookUrl = process.env.ZOHO_WEBHOOK_URL;
    
    if (zohoWebhookUrl) {
      try {
        const zohoResponse = await fetch(zohoWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(zohoPayload),
        });

        if (!zohoResponse.ok) {
          console.error('Zoho webhook error:', await zohoResponse.text());
          // Still return success to user, but log the error
        }
      } catch (error) {
        console.error('Error calling Zoho webhook:', error);
        // Still return success to user, but log the error
      }
    } else {
      console.log('Zoho webhook URL not configured. Lead data:', zohoPayload);
    }

    return NextResponse.json({ success: true, routing });
  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

