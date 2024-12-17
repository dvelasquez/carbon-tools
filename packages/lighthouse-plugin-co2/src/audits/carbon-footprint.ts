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
import { bytesToCo2, countries } from 'bytes-to-co2';
import { Audit, NetworkRecords } from 'lighthouse';
import type { Artifacts,  } from 'lighthouse';
import * as LH from 'lighthouse/types/lh.js';
// import NetworkRecords from "lighthouse/core/computed/network-records"

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
      requiredArtifacts: ['DevtoolsLog'] as Array<keyof LH.Artifacts>,
    };
  }

  static round(value: number, decimals: number) {
    return Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);
  }

  static audit(artifacts: Artifacts, context: LH.Audit.Context) {
    try {
      const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return NetworkRecords.request(devtoolsLog, context).then((records: any) => {
        const agregatedResult = records.reduce(
          (accumulator: Artifacts.NetworkRequest, current: Artifacts.NetworkRequest) => ({
            transferSize: accumulator.transferSize + current.transferSize,
            resourceSize: accumulator.resourceSize + current.resourceSize,
          }),
        );
        countries.push({ code: 'ZZ', name: 'World' });

        const resultByCountry = countries.map((country: { code: string; name: string }) => {
          const co2 = bytesToCo2({
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
              bytesToCo2({ byteSize: agregatedResult.transferSize, country: country.code, isDataAdjusted: false }),
              4,
            )}`,
            score,
          };
        });

        const headings:LH.Audit.Details.Table["headings"] = [
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
