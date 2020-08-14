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

const { Audit } = require('lighthouse');
const NetworkRecords = require('lighthouse/lighthouse-core/computed/network-records.js');
const { byteToCo2 } = require('bytes-to-co2');
const { countries } = require('bytes-to-co2');
const ranking = require('../helpers/ranking');

class CarbonFootprintAudit extends Audit {
  static get meta() {
    return {
      id: 'carbon-footprint',
      title: 'Estimated co2 emissions downloading the assets of the page',
      failureTitle: 'Reducing the size of your site will improve '
        + 'the performance and will reduce the co2 released to the atmosphere',
      description: 'Every byte transmited over the network requires certain '
        + 'amount of electricity, which is produced '
        + 'using a mix of fossil fuel, solar, wind, etc., which releas co2'
        + ' to the atmosphere.',

      // The name of the artifact provides input to this audit.
      requiredArtifacts: ['devtoolsLogs'],
    };
  }

  static round(value, decimals) {
    return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
  }

  static audit(artifacts, context) {
    try {
      const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
      return NetworkRecords.request(devtoolsLog, context).then((records) => {
        const agregatedResult = records.reduce((accumulator, current) => ({
          transferSize: accumulator.transferSize + current.transferSize,
          resourceSize: accumulator.resourceSize + current.resourceSize,
        }));

        const resultByCountry = countries.map((country) => {
          const co2 = byteToCo2({ byteSize: agregatedResult.transferSize, country });
          const closest = [...ranking].sort((a, b) => Math.abs(co2 - a) - Math.abs(co2 - b))[0];
          const score = this.round(1 - (ranking.findIndex((value) => value === closest) / 100), 2);
          return {
            country,
            transferSize: agregatedResult.transferSize,
            resourceSize: agregatedResult.resourceSize,
            co2Grams: `${this.round(byteToCo2({ byteSize: agregatedResult.transferSize, country }), 4)}`,
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
          }, {
            key: 'score',
            itemType: 'text',
            text: 'Score',
          },
        ];

        const tableDetails = Audit.makeTableDetails(headings, resultByCountry);

        return {
          score: resultByCountry.find(({ country }) => country === 'European Union (current composition)').score,
          details: tableDetails,
        };
      });
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = CarbonFootprintAudit;
