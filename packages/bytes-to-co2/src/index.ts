import { calculateCo2 } from './carbon-calculator';
import { co2Data, getCountries, getFactor } from 'co2-data';

export { calculateCo2 } from './carbon-calculator';

export interface ByteToCo2Props {
  byteSize: number;
  country?: string;
  year?: number;
  carbonFactor?: number;
  isDataAdjusted: boolean;
}

export const countries = getCountries();

export const bytesToCo2 = ({ byteSize, country, isDataAdjusted }: ByteToCo2Props): number => {
  const countryFactor = getFactor(co2Data, country);
  return calculateCo2({ byteSize, co2Factor: countryFactor, isDataAdjusted });
};
