import Tap from 'tap';
import { findKeysByCode, getCountries } from './country-names';

Tap.test('should get a list with all the countries in the data', (t) => {
  const countries = getCountries();
  t.equals(countries.length, 87, 'There should be 87 countries');
  t.end();
});

Tap.test('should find all the records that match the code', (t) => {
  const US = findKeysByCode('US');
  const AUSTRIA = findKeysByCode('AT');
  const CHILE = findKeysByCode('CL');

  t.end();
});
