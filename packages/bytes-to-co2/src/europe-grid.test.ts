import Tap from 'tap';
import { countries, years, getFactor } from './europe-grid';

Tap.test('Check countries', (t) => {
  t.equals(countries.length, 29, `should have ${countries.length} countries`);
  t.end();
});

Tap.test('Check years', (t) => {
  t.equals(years.length, 27, `should have ${years.length} years`);
  t.end();
});

Tap.test('Check factors', (t) => {
  const defaultEuropeFactor = getFactor();
  t.same(
    defaultEuropeFactor,
    {
      year: 2016,
      country: 'European Union (current composition)',
      co2Factor: 295.8,
    },
    'should match the default Europe Factor',
  );
  t.end();
});
