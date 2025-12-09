export interface City {
  name: string;
  state: string;
  stateAbbr: string;
  latitude: number;
  longitude: number;
  population: number;
  areaCode?: string;
  majorLandmark?: string;
  neighboringTowns?: string[];
  zipCodes?: string[];
}

export interface StateData {
  name: string;
  abbreviation: string;
  cities: City[];
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

