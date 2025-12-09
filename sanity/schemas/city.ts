/**
 * Sanity.io Schema Definition for City Content Type
 * 
 * To use this schema:
 * 1. Install Sanity CLI: npm install -g @sanity/cli
 * 2. Run: sanity init
 * 3. Create schemas/city.ts in your Sanity studio
 * 4. Copy this schema definition
 */

export default {
  name: 'city',
  title: 'City',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'City Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'state',
      title: 'State Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'stateAbbr',
      title: 'State Abbreviation',
      type: 'string',
      validation: (Rule: any) => Rule.required().max(2),
    },
    {
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(-90).max(90),
    },
    {
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(-180).max(180),
    },
    {
      name: 'population',
      title: 'Population',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'areaCode',
      title: 'Area Code',
      type: 'string',
      description: 'Primary area code for this city',
    },
    {
      name: 'majorLandmark',
      title: 'Major Landmark',
      type: 'string',
      description: 'Famous landmark or location in the city',
    },
    {
      name: 'neighboringTowns',
      title: 'Neighboring Towns',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Nearby cities or towns',
    },
    {
      name: 'zipCodes',
      title: 'Zip Codes',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Primary zip codes served',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'state',
    },
  },
};

