import Tap from 'tap';
import { byteToCo2 } from './index';

Tap.test('Integration test', (t) => {
  const defaultEurope = byteToCo2({
    byteSize: 1e6,
    isDataAdjusted: false,
  });
  const austria = byteToCo2({
    country: 'Austria',
    byteSize: 1e6,
    isDataAdjusted: false,
  });
  t.same(defaultEurope, 0.4972508177161217);
  t.same(austria, 0.14305626973509789);

  t.end();
});
