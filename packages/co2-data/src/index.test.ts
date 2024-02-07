import Tap from 'tap';
// @ts-ignore
import electricityMapData from './data/json/13-9-2020--12.json';
import { getDataByCode } from './data/data-helpers';

Tap.test('should get the data based in an ISO code', (t) => {
  const clResult = getDataByCode(electricityMapData, 'CL');
  const atResult = getDataByCode(electricityMapData, 'AT');
  const usResult = getDataByCode(electricityMapData, 'US');
  const ausResult = getDataByCode(electricityMapData, 'AUS');
  const itResult = getDataByCode(electricityMapData, 'IT');
  const deResult = getDataByCode(electricityMapData, 'DE');
  const worldResult = getDataByCode(electricityMapData);
  t.equal(
    clResult.averageCo2Intensity,
    343.27340406847736,
    'The average CO2 intensity of Chile should be 343.27340406847736',
  );
  t.equal(
    atResult.averageCo2Intensity,
    122.81858052158728,
    'The average CO2 intensity of Austria should be 122.81858052158728',
  );
  t.equal(
    usResult.averageCo2Intensity,
    366.3342983189315,
    'The average CO2 intensity of United States should be 366.3342983189315',
  );
  t.equal(
    ausResult.averageCo2Intensity,
    511.5527537190717,
    'The average CO2 intensity of Australia should be 511.5527537190717',
  );
  t.equal(
    itResult.averageCo2Intensity,
    278.4551918454281,
    'The average CO2 intensity of Italy should be 278.4551918454281',
  );
  t.equal(
    deResult.averageCo2Intensity,
    141.647551297792,
    'The average CO2 intensity of Germany should be 141.647551297792',
  );
  t.equal(
    worldResult.averageCo2Intensity,
    329.5828620824485,
    'The average CO2 intensity of the World should be 329.5828620824485',
  );
  t.end();
});
