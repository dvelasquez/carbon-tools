import Tap from 'tap';
import { findKeysByCode, getCountries } from './country-names';

Tap.test('should get a list with all the countries in the data', (t) => {
  const countries = getCountries();
  t.equal(countries.length, 87, 'There should be 87 countries');
  t.end();
});

Tap.test('should find all the records that match the code', (t) => {
  const US = findKeysByCode('US');
  const AUSTRIA = findKeysByCode('AT');
  const CHILE = findKeysByCode('CL');

  t.equal(US.length, 98, 'There should be 98 record for US');
  t.equal(AUSTRIA.length, 1, 'There should be 1 record for AUSTRIA');
  t.equal(CHILE.length, 2, 'There should be 2 record for CHILE');

  t.end();
});
