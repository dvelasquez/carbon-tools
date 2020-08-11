import Tap from 'tap';
import { calculateCo2 } from './carbon-calculator';

Tap.test('Test co2 calculations with manual factors', (t) => {
  const testWith100Factor = calculateCo2({ byteSize: 100000, co2Factor: 100, isDataAdjusted: false });
  t.same(testWith100Factor, 0.016810372471809387);
  const testWithDataAdjusted = calculateCo2({ byteSize: 100000, co2Factor: 100, isDataAdjusted: true });
  t.same(testWithDataAdjusted, 0.012691831216216087);
  const testWithoutCo2Factor = calculateCo2({ byteSize: 100000, isDataAdjusted: true });
  t.same(testWithoutCo2Factor, 0.060286198277026415);
  t.end();
});
