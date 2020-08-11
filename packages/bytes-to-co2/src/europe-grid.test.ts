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

Tap.test('Test valid factors', (t) => {
  const defaultEuropeFactor = getFactor();
  const austrianEuropeFactor = getFactor('Austria');
  const germanyEuropeFactor = getFactor('Germany', 2000);
  t.same(
    defaultEuropeFactor,
    {
      year: 2016,
      country: 'European Union (current composition)',
      co2Factor: 295.8,
    },
    'should match the default Europe Factor',
  );
  t.same(
    austrianEuropeFactor,
    {
      year: 2016,
      country: 'Austria',
      co2Factor: 85.1,
    },
    'should match the Factor for Austria',
  );
  t.same(
    germanyEuropeFactor,
    {
      year: 2000,
      country: 'Germany',
      co2Factor: 558.7,
    },
    'should match the Factor for Germany',
  );
  t.end();
});

Tap.test('Test invalid factors', (t) => {
  t.throws(() => getFactor('Japan'));
  t.end();
});
