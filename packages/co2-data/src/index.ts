import { getCountries } from './country-names';
import { co2Data } from './data/co2-data';
import type {
  ElectricityMapDataResponse,
  ElectricityMapDataComputed,
  ElectricityMapCountry,
  CountryNames,
  EnergySources,
  ElectricityMapResult,
  EnergyDataSources,
  Co2Data,
} from './types';

const getFactor = (co2Data: Co2Data[], code?: string): number => {
  if (!code) code = 'ZZ';
  const result = co2Data.find((countryData) => {
    if (countryData.code === code) return countryData;
  });
  return result?.co2Intensity || 0;
};

export {
  co2Data,
  getFactor,
  getCountries,
  ElectricityMapDataResponse,
  ElectricityMapDataComputed,
  ElectricityMapCountry,
  CountryNames,
  EnergySources,
  ElectricityMapResult,
  EnergyDataSources,
  Co2Data,
};
