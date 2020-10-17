import { getFactor } from './get-factor';
import { calculateCo2 } from './carbon-calculator';
import { electricityMapData } from '../source-data/electricity-map-data';
import { getCountries } from '../source-data/country-names';

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
