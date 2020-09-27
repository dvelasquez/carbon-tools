import { ElectricityMapDataComputed } from '../source-data/electricity-map-data';

export const getFactor = (data: ElectricityMapDataComputed[], code?: string): number => {
  if (!code) code = 'ZZ';
  const result = data.find((countryData) => {
    if (countryData.code === code) return countryData;
  });
  return result?.dailyAverage || 0;
};
