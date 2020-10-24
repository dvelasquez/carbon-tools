import { Co2Data } from 'co2-data';

export const getFactor = (co2Data: Co2Data[], code?: string): number => {
  if (!code) code = 'ZZ';
  const result = co2Data.find((countryData) => {
    if (countryData.code === code) return countryData;
  });
  return result?.co2Intensity || 0;
};
