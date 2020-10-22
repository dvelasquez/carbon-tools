export interface EnergySources {
  gas?: number | null;
  oil?: number | null;
  coal?: number | null;
  wind?: number | null;
  hydro?: number | null;
  solar?: number | null;
  biomass?: number | null;
  nuclear?: number | null;
  unknown?: number | null;
  geothermal?: number | null;
  'hydro storage'?: number | null;
  'hydro-storage'?: number | null;
  'battery storage'?: number | null;
  battery?: number | null;
}
export interface EnergyDataSources {
  gas?: string;
  oil?: string;
  coal?: string;
  wind?: string;
  hydro?: string;
  solar?: string;
  biomass?: string;
  nuclear?: string;
  unknown?: string;
  geothermal?: string;
  battery?: string;
}

export interface ElectricityMapCountry {
  source?: string;
  storage?: EnergySources;
  production: EnergySources;
  schemaVersion?: number | null;
  exchange?: {
    [key: string]: number | number[];
  };
  exchangeCapacities?: {
    [key: string]: number | number[];
  };
  price?: { currency: string; value: number };
  countryCode: string;
  _isFinestGranularity?: boolean;
  capacity?: EnergySources;
  maxProduction: number | null;
  totalProduction: number | null;
  maxDischarge: number | null;
  maxStorage: number | null;
  totalStorage: number | null;
  totalDischarge: number | null;
  totalImport: number | null;
  totalExport: number | null;
  maxExport: number | null;
  maxImport: number | null;
  totalNetExchange?: number | null;
  totalConsumption: number | null;
  consumption?: number | null;
  maxCapacity: number | null;
  maxStorageCapacity: number | null;
  maxExportCapacity: number | null;
  maxImportCapacity: number | null;
  co2intensity?: number | null;
  productionCo2Intensities: EnergySources;
  productionCo2IntensitySources: EnergyDataSources;
  dischargeCo2Intensities: EnergySources;
  dischargeCo2IntensitySources: EnergyDataSources;
  fossilFuelRatio?: number | null;
  renewableRatio?: number | null;
  co2intensityProduction?: number | null;
  fossilFuelRatioProduction?: number | null;
  renewableRatioProduction?: number | null;
  exchangeCo2Intensities: { [key: string]: number };
  totalCo2Production: number | null;
  totalCo2Discharge: number | null;
  totalCo2Storage: number | null;
  totalCo2Import: number | null;
  totalCo2Export: number | null;
  totalCo2NetExchange?: number | null;
}

export interface ElectricityMapDataResponse {
  status: string;
  data: {
    countries: {
      [key: string]: ElectricityMapCountry;
    };
    exchanges: {
      [key: string]: {
        source: string;
        netFlow: number;
        schemaVersion: number;
        sortedCountryCodes: string;
        countryCodes: string[];
        co2intensity: number;
        capacity?: number | number[];
      };
    };
    datetime: string;
    createdAt: string;
    _disclaimer: string;
    callerLocation: number[];
    callerZone: string;
  };
  took: string;
  cached: boolean;
}

export interface ElectricityMapResult {
  code: string;
  codeList: string[];
  co2Intensities: number[];
  averageCo2Intensity: number;
}

export interface CountryNames {
  [key: string]: { zoneName: string; countryName?: string };
}

export interface ElectricityMapDataComputed extends ElectricityMapResult {
  co2List: number[];
  dailyAverage: number | null;
}
