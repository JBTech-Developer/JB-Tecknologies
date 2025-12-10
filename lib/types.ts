export interface City {
  name: string;
  state: string;
  stateAbbr: string;
  latitude: number;
  longitude: number;
  population: number;
  county: string; // Required: County name for dynamic content
  areaCode?: string;
  majorLandmark?: string;
  neighboringTowns?: string[];
  zipCodes: string[]; // Required: At least one zip code for dynamic content
}

export interface StateData {
  name: string;
  abbreviation: string;
  cities: City[];
}

export interface Service {
  category: string;
  service_name: string;
  slug: string;
  meta_desc_template: string;
  hero_overlay_text: string;
  description?: string;
  keywords?: string[];
}

export interface CityPageData {
  city: City;
  content: {
    introduction: string;
    services: string;
    serviceArea: string;
  };
  nearbyCities: City[];
}

export interface ServiceCityPageData {
  city: City;
  service: Service;
  content: {
    introduction: string;
    services: string;
    serviceArea: string;
  };
  nearbyCities: City[];
}

