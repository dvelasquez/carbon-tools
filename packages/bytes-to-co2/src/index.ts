import { getFactor } from './get-factor';
import { calculateCo2 } from './carbon-calculator';
import { electricityMapData, getCountries } from 'co2-data';

export { calculateCo2 } from './carbon-calculator';

export interface ByteToCo2Props {
  byteSize: number;
  country?: string;
  year?: number;
  carbonFactor?: number;
  isDataAdjusted: boolean;
}

export const countries = getCountries();

export const byteToCo2 = ({ byteSize, country, isDataAdjusted }: ByteToCo2Props) => {
  const countryFactor = getFactor(electricityMapData, country);
  return calculateCo2({ byteSize, co2Factor: countryFactor, isDataAdjusted });
};

export default byteToCo2;
