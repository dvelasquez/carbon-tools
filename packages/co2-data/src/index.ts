import { getCountries } from './country-names';
import { electricityMapData } from './data/electricity-map-data';
import type {
  ElectricityMapDataResponse,
  ElectricityMapDataComputed,
  ElectricityMapCountry,
  CountryNames,
  EnergySources,
  ElectricityMapResult,
  EnergyDataSources,
} from './types';

const getFactor = (electricityMapData: ElectricityMapDataComputed[], code?: string): number => {
  if (!code) code = 'ZZ';
  const result = electricityMapData.find((countryData) => {
    if (countryData.code === code) return countryData;
  });
  return result?.dailyAverage || 0;
};

export {
  electricityMapData,
  getFactor,
  ElectricityMapDataResponse,
  ElectricityMapDataComputed,
  ElectricityMapCountry,
  CountryNames,
  EnergySources,
  ElectricityMapResult,
  EnergyDataSources,
  getCountries,
};
