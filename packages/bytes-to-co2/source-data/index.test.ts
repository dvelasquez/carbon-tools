import Tap from 'tap';
import { electricityMap } from './electricity-map';
import { getDataByCode } from './index';

Tap.test('should get the data based in an ISO code', (t) => {
  const clResult = getDataByCode(electricityMap, 'CL');
  const atResult = getDataByCode(electricityMap, 'AT');
  const usResult = getDataByCode(electricityMap, 'US');
  const ausResult = getDataByCode(electricityMap, 'AUS');
  const itResult = getDataByCode(electricityMap, 'IT');
  const deResult = getDataByCode(electricityMap, 'DE');
  const worldResult = getDataByCode(electricityMap);
  t.equals(
    clResult.averageCo2Intensity,
    464.87935536090714,
    'The average CO2 intensity of Chile should be 464.87935536090714',
  );
  t.equals(
    atResult.averageCo2Intensity,
    153.66773908309952,
    'The average CO2 intensity of Austria should be 153.66773908309952',
  );
  t.equals(
    usResult.averageCo2Intensity,
    360.58550172069704,
    'The average CO2 intensity of United States should be 360.58550172069704',
  );
  t.equals(
    ausResult.averageCo2Intensity,
    525.3130358127518,
    'The average CO2 intensity of Australia should be 525.3130358127518',
  );
  t.equals(
    itResult.averageCo2Intensity,
    350.11639315108954,
    'The average CO2 intensity of Italy should be 350.11639315108954',
  );
  t.equals(
    deResult.averageCo2Intensity,
    253.86741598466617,
    'The average CO2 intensity of Germany should be 253.86741598466617',
  );
  t.equals(
    worldResult.averageCo2Intensity,
    345.47693931581165,
    'The average CO2 intensity of the World should be 253.86741598466617',
  );
  t.end();
});
