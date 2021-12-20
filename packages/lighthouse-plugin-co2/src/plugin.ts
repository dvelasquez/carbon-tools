/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
import Config from 'lighthouse/types/config';

const plugin: Config.Plugin = {
  // Additional audit to run on information Lighthouse gathered.
  audits: [
    {
      path: 'lighthouse-plugin-co2/lib/audits/carbon-footprint.js',
    },
  ],

  // A new category in the report for the new audit's output.
  category: {
    title: 'Carbon Footprint',
    description: 'Score represent how better this page performs compared to others.',
    auditRefs: [{ id: 'carbon-footprint', weight: 1 }],
  },
};
module.exports = plugin;
