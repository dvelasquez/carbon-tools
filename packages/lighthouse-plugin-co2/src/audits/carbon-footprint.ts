/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import { ranking } from '../helpers/ranking.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { bytesToCo2, countries } from 'bytes-to-co2';
import { Audit, NetworkRecords } from 'lighthouse';
import type { Artifacts } from 'lighthouse';
import * as LH from 'lighthouse/types/lh.js';

interface NetworkSize {
  transferSize: number;
  resourceSize: number;
}

interface CountryEmissionResult extends Record<string, string | number> {
  country: string;
  transferSize: number;
  resourceSize: number;
  co2Grams: string;
  score: number;
}

class CarbonFootprintAudit extends Audit {
  static get meta() {
    return {
      id: 'carbon-footprint',
      title: 'Estimated co2 emissions downloading the assets of the page',
      failureTitle:
        'Reducing the size of your site will improve ' +
        'the performance and will reduce the co2 released to the atmosphere',
      description:
        'Every byte transmitted over the network requires certain ' +
        'amount of electricity, which is produced ' +
        'using a mix of fossil fuel, solar, wind, etc., which releases ' +
        'co2 to the atmosphere.',
      requiredArtifacts: ['DevtoolsLog'] as Array<keyof LH.Artifacts>,
    };
  }

  private static round(value: number, decimals: number): number {
    return Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);
  }

  private static calculateNetworkSize(records: Artifacts.NetworkRequest[]): NetworkSize {
    return records.reduce(
      (accumulator: NetworkSize, current: Artifacts.NetworkRequest) => ({
        transferSize: accumulator.transferSize + current.transferSize,
        resourceSize: accumulator.resourceSize + current.resourceSize,
      }),
      { transferSize: 0, resourceSize: 0 }
    );
  }

  private static calculateEmissionScore(co2Amount: number): number {
    const closest = [...ranking].sort((a, b) => Math.abs(co2Amount - a) - Math.abs(co2Amount - b))[0];
    return this.round(1 - ranking.findIndex((value) => value === closest) / 100, 2);
  }

  private static calculateCountryEmissions(networkSize: NetworkSize): CountryEmissionResult[] {
    // Ensure 'World' is included in countries list
    if (!countries.find((c: { code: string }) => c.code === 'ZZ')) {
      countries.push({ code: 'ZZ', name: 'World' });
    }

    return countries.map((country: { code: string; name: string }) => {
      const co2 = bytesToCo2({
        byteSize: networkSize.transferSize,
        country: country.code,
        isDataAdjusted: false,
      });

      return {
        country: country.name,
        transferSize: networkSize.transferSize,
        resourceSize: networkSize.resourceSize,
        co2Grams: `${this.round(co2, 4)}`,
        score: this.calculateEmissionScore(co2),
      };
    });
  }

  private static getTableHeadings(): LH.Audit.Details.Table['headings'] {
    return [
      { key: 'country', valueType: 'text', label: 'Country' },
      {
        key: 'transferSize',
        valueType: 'bytes',
        displayUnit: 'kb',
        granularity: 1,
        label: 'Transfer Size',
      },
      {
        key: 'resourceSize',
        valueType: 'bytes',
        displayUnit: 'kb',
        granularity: 1,
        label: 'Resource Size',
      },
      {
        key: 'co2Grams',
        valueType: 'text',
        label: 'Grams of CO2',
      },
      {
        key: 'score',
        valueType: 'text',
        label: 'Score',
      },
    ];
  }

  static async audit(artifacts: Artifacts, context: LH.Audit.Context): Promise<LH.Audit.Product> {
    try {
      const networkRecords = await NetworkRecords.request(artifacts.DevtoolsLog, context);
      const networkSize = this.calculateNetworkSize(networkRecords);
      const emissionResults = this.calculateCountryEmissions(networkSize);
      
      const worldResult = emissionResults.find(({ country }) => country === 'World');
      const tableDetails = Audit.makeTableDetails(this.getTableHeadings(), emissionResults);

      return {
        score: worldResult?.score ?? null,
        details: tableDetails,
      };
    } catch (error) {
      console.error('Carbon footprint audit failed:', error);
      return {
        score: null,
        details: Audit.makeTableDetails(this.getTableHeadings(), []),
      };
    }
  }
}

export default CarbonFootprintAudit;
