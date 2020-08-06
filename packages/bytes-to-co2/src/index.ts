import { getFactor } from './europe-grid';
import { calculateCo2 } from './carbon-calculator';

export { calculateCo2 } from './carbon-calculator';
export * from './europe-grid';

export interface ByteToCo2Props {
  byteSize: number;
  country?: string;
  year?: number;
  carbonFactor: number;
  isDataAdjusted: boolean;
}

export const byteToCo2 = ({ byteSize, country, year, isDataAdjusted }: ByteToCo2Props) => {
  const countryFactor = getFactor(country, year);
  return calculateCo2({ byteSize, co2Factor: countryFactor?.co2Factor, isDataAdjusted });
};

export default byteToCo2;
