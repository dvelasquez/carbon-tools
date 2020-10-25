import Tap from 'tap';
import { bytesToCo2 } from './index';

Tap.test('Integration test', (t) => {
  const defaultWorld = bytesToCo2({
    byteSize: 1e6,
    isDataAdjusted: false,
  });
  const austria = bytesToCo2({
    country: 'AT',
    byteSize: 1e6,
    isDataAdjusted: false,
  });
  const sweden = bytesToCo2({
    country: 'SE',
    byteSize: 1e6,
    isDataAdjusted: false,
  });
  const chile = bytesToCo2({
    country: 'CL',
    byteSize: 1e6,
    isDataAdjusted: false,
  });
  const greatBritain = bytesToCo2({
    country: 'GB',
    byteSize: 1e6,
    isDataAdjusted: false,
  });
  const spain = bytesToCo2({
    country: 'ES',
    byteSize: 1e6,
    isDataAdjusted: false,
  });
  t.same(defaultWorld, 0.539680558728753);
  t.same(austria, 0.2792960630573394);
  t.same(sweden, 0.06411629304105701);
  t.same(chile, 0.6572351823675561);
  t.same(greatBritain, 0.35021555843286817);
  t.same(spain, 0.8645596340163546);

  t.end();
});
