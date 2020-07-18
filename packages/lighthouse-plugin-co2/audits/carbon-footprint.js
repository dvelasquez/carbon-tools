/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const calculateCo2 = require('./carbon-calculator');
const ranking = require('./ranking')
const Audit = require('lighthouse').Audit;
const NetworkRecords = require('lighthouse/lighthouse-core/computed/network-records.js');

class CarbonFootprintAudit extends Audit {
  static get meta() {
    return {
      id: 'carbon-footprint',
      title: 'Preloaded requests have proper `as` attributes',
      failureTitle: 'Some preloaded requests do not have proper `as` attributes',
      description: '`<link rel=preload>` tags need an `as` attribute to specify the type of ' +
        'content being loaded.',

      // The name of the artifact provides input to this audit.
      requiredArtifacts: ['devtoolsLogs'],
    };
  }

  /*
    static async audit(artifacts, context) {
      // Check that all `<link rel=preload>` elements had a defined `as` attribute.
      const preloadLinks = artifacts.LinkElements.filter(el => el.rel === 'preload');
      const noAsLinks = preloadLinks.filter(el => !allowedTypes.has(el.as));

      // Audit passes if there are no missing attributes.
      const passed = noAsLinks.length === 0;

      const networkRequests = await this.networkRequests(artifacts, context);

      console.log(networkRequests)

      return {
        score: passed ? 1 : 0,
        displayValue: `Found ${noAsLinks.length} preload requests with missing \`as\` attributes`,
      };
    }
  */
  static async audit(artifacts, context) {
    const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
    const records = await NetworkRecords.request(devtoolsLog, context)
    const results = records.map(record => {
      return {
        url: record.url,
        transferSize: record.transferSize,
        resourceSize: record.resourceSize,
        mimeType: record.mimeType,
        resourceType: record.resourceType
      };
    });


    const transferredSize = results.reduce((accumulator, {transferSize}) => {
      return (accumulator + transferSize)
    }, 0);
    const footprint = calculateCo2(transferredSize);
    const closesRankedResult = ranking.reduce(function(prev, curr) {
      return (Math.abs(curr - footprint) < Math.abs(prev - footprint) ? curr : prev);
    });
    const score = (100 - ranking.indexOf(closesRankedResult))/100;
    return {
      score,
      displayValue: `This site emits ${footprint}g of CO2 on each visit.`,
    };

  }
}

module.exports = CarbonFootprintAudit;
