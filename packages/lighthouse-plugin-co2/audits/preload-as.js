/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('lighthouse').Audit;
const NetworkRecords = require('lighthouse/lighthouse-core/computed/network-records.js');

/**
 * @fileoverview A fake additional check of the robots.txt file.
 */

// https://fetch.spec.whatwg.org/#concept-request-destination
const allowedTypes = new Set(['font', 'image', 'script', 'serviceworker', 'style', 'worker']);

class PreloadAsAudit extends Audit {
  static get meta() {
    return {
      id: 'preload-as',
      title: 'Preloaded requests have proper `as` attributes',
      failureTitle: 'Some preloaded requests do not have proper `as` attributes',
      description: '`<link rel=preload>` tags need an `as` attribute to specify the type of ' +
          'content being loaded.',

      // The name of the artifact provides input to this audit.
      requiredArtifacts: ['LinkElements', 'devtoolsLogs'],
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
  static audit(artifacts, context){
    const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
    return NetworkRecords.request(devtoolsLog, context).then(records => {
      const earliestStartTime = records.reduce(
          (min, record) => Math.min(min, record.startTime),
          Infinity
      );

      /** @param {number} time */
      const timeToMs = time => time < earliestStartTime || !Number.isFinite(time) ?
          undefined : (time - earliestStartTime) * 1000;

      const results = records.map(record => {
        const endTimeDeltaMs = record.lrStatistics && record.lrStatistics.endTimeDeltaMs;
        const TCPMs = record.lrStatistics && record.lrStatistics.TCPMs;
        const requestMs = record.lrStatistics && record.lrStatistics.requestMs;
        const responseMs = record.lrStatistics && record.lrStatistics.responseMs;

        return {
          url: URL.elideDataURI(record.url),
          startTime: timeToMs(record.startTime),
          endTime: timeToMs(record.endTime),
          finished: record.finished,
          transferSize: record.transferSize,
          resourceSize: record.resourceSize,
          statusCode: record.statusCode,
          mimeType: record.mimeType,
          resourceType: record.resourceType,
          lrEndTimeDeltaMs: endTimeDeltaMs, // Only exists on Lightrider runs
          lrTCPMs: TCPMs, // Only exists on Lightrider runs
          lrRequestMs: requestMs, // Only exists on Lightrider runs
          lrResponseMs: responseMs, // Only exists on Lightrider runs
        };
      });

      // NOTE(i18n): this audit is only for debug info in the LHR and does not appear in the report.
      /** @type {LH.Audit.Details.Table['headings']} */
      const headings = [
        {key: 'url', itemType: 'url', text: 'URL'},
        {key: 'startTime', itemType: 'ms', granularity: 1, text: 'Start Time'},
        {key: 'endTime', itemType: 'ms', granularity: 1, text: 'End Time'},
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
        {key: 'statusCode', itemType: 'text', text: 'Status Code'},
        {key: 'mimeType', itemType: 'text', text: 'MIME Type'},
        {key: 'resourceType', itemType: 'text', text: 'Resource Type'},
      ];

      const tableDetails = Audit.makeTableDetails(headings, results);

      return {
        score: 1,
        details: tableDetails,
      };
    });

  }
}

module.exports = PreloadAsAudit;
