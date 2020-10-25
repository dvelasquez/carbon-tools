# co2-data

Small library that extracts the average carbon intensity from json requests from the [Electricity Map API](https://www.electricitymap.org/map).

This project reads the api responses and consolidates the results in a single lightweight file that is exported.

24kb / 5kb gzip

## Getting started

- Install the library using `npm install co2-data` or `yarn add co2-data`
- Import the function you want to use:

```javascript
import { 
    co2Data,      // Raw javascript array with the country iso code and the average carbon intensity 
    getFactor,    // Function to get the average carbon intensity by country code
    getCountries  // List of country codes and sub-codes
} from 'co2-data';

getFactor(co2Data, 'CL'); // Average for Chile: 343.27340406847736
getCountries(); // Array with the ISO code and the name of the countries [{code: 'CL', 'Chile'},...]
```

## Credits
- [Electricity Map](https://www.electricitymap.org/map)
