import type { ElectricityMapDataResponse } from './electricity-map';
import { findKeysByCode } from './country-names';

export interface ElectricityMapResult {
  code: string;
  codeList: string[];
  co2Intensities: number[];
  averageCo2Intensity: number;
}

export const getDataByCode = (dataResponse: ElectricityMapDataResponse, code?: string): ElectricityMapResult => {
  const codesFound: string[] = findKeysByCode(code);
  const result: ElectricityMapResult = {
    code: code || 'ZZ',
    codeList: [],
    co2Intensities: [],
    averageCo2Intensity: 0,
  };
  codesFound.forEach((code) => {
    const countryData = dataResponse.data.countries[code];
    if (countryData?.co2intensity) {
      result.codeList.push(countryData.countryCode);
      result.co2Intensities.push(countryData.co2intensity);
    }
  });
  // Only reduce data from CountryCodes with data
  if (result.co2Intensities.length > 0) {
    result.averageCo2Intensity =
      result.co2Intensities.reduce((a: number, b: number) => a + b) / result.co2Intensities.length;
  }
  return result;
};

export const getFactor = (dataResponse: ElectricityMapDataResponse, code?: string): number => {
  const result = getDataByCode(dataResponse, code);
  return result.averageCo2Intensity;
};
