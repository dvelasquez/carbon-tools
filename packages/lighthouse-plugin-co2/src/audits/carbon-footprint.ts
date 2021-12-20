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
import { ranking } from '../helpers/ranking';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { byteToCo2, countries } from 'bytes-to-co2';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import NetworkRecords from 'lighthouse/lighthouse-core/computed/network-records';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Audit, Artifacts } from 'lighthouse';

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
        'using a mix of fossil fuel, solar, wind, etc., which releas co2' +
        ' to the atmosphere.',

      // The name of the artifact provides input to this audit.
      requiredArtifacts: ['devtoolsLogs'],
    };
  }

  static round(value: number, decimals: number) {
    return Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);
  }

  static audit(artifacts: Artifacts, context: Audit.Context) {
    try {
      const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
      return NetworkRecords.request(devtoolsLog, context).then((records: NetworkRecords) => {
        const agregatedResult = records.reduce(
          (accumulator: Artifacts.NetworkRequest, current: Artifacts.NetworkRequest) => ({
            transferSize: accumulator.transferSize + current.transferSize,
            resourceSize: accumulator.resourceSize + current.resourceSize,
          }),
        );
        countries.push({ code: 'ZZ', name: 'World' });

        const resultByCountry = countries.map((country: { code: string; name: string }) => {
          const co2 = byteToCo2({
            byteSize: agregatedResult.transferSize,
            country: country.code,
            isDataAdjusted: false,
          });
          const closest = [...ranking].sort((a, b) => Math.abs(co2 - a) - Math.abs(co2 - b))[0];
          const score = this.round(1 - ranking.findIndex((value) => value === closest) / 100, 2);
          return {
            country: country.name,
            transferSize: agregatedResult.transferSize,
            resourceSize: agregatedResult.resourceSize,
            co2Grams: `${this.round(
              byteToCo2({ byteSize: agregatedResult.transferSize, country: country.code, isDataAdjusted: false }),
              4,
            )}`,
            score,
          };
        });

        const headings = [
          { key: 'country', itemType: 'text', text: 'Country' },
          {
            key: 'transferSize',
            itemType: 'bytes',
            displayUnit: 'kb',
            granularity: 1,
            text: 'Transfer Size',
          },
          {
            key: 'resourceSize',
            itemType: 'bytes',
            displayUnit: 'kb',
            granularity: 1,
            text: 'Resource Size',
          },
          {
            key: 'co2Grams',
            itemType: 'text',
            text: 'Grams of CO2',
          },
          {
            key: 'score',
            itemType: 'text',
            text: 'Score',
          },
        ];

        const tableDetails = Audit.makeTableDetails(headings, resultByCountry);

        return {
          score: resultByCountry.find(({ country }: { country: string }) => {
            return country === 'World'; // World average
          })?.score,
          details: tableDetails,
        };
      });
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = CarbonFootprintAudit;
