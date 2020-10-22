import { ElectricityMapDataComputed } from 'co2-data';

export const getFactor = (electricityMapData: ElectricityMapDataComputed[], code?: string): number => {
  if (!code) code = 'ZZ';
  const result = electricityMapData.find((countryData) => {
    if (countryData.code === code) return countryData;
  });
  return result?.dailyAverage || 0;
};
