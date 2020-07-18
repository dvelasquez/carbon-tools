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
      title: 'How much CO2 is emitted transmitting the data of this page',
      failureTitle: 'To improve your score, try to reduce the size of your assets.',
      description: 'To transmit data over the network electricity is needed and CO2 is released to the atmosphere. ',

      // The name of the artifact provides input to this audit.
      requiredArtifacts: ['devtoolsLogs'],
    };
  }

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
      displayValue: `This site emits ${footprint.toFixed(4)}g of CO2 on each visit.`,
    };

  }
}

module.exports = CarbonFootprintAudit;
