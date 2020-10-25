# bytes-to-co2
[![npm](https://badgen.net/npm/v/bytes-to-co2)](https://www.npmjs.com/package/bytes-to-co2)
[![bundlephobia-min](https://badgen.net/bundlephobia/min/bytes-to-co2)](https://bundlephobia.com/result?p=bytes-to-co2)
[![bundlephobia-min-gzip](https://badgen.net/bundlephobia/minzip/bytes-to-co2)](https://bundlephobia.com/result?p=bytes-to-co2)
[![bundlephobia-tree-shaking](https://badgen.net/bundlephobia/tree-shaking/bytes-to-co2)](https://bundlephobia.com/result?p=bytes-to-co2)

Calculate the **co2 footprint** (carbon dioxide released to the atmosphere) 
of transmitting an `x` amount of bytes over the internet.

Transport data over the internet requires energy (datacenters, repeaters,
switches, etc) and how this energy is different from country to country. This
is known as the "co2 emission intensity". Each country have different ways to
produce electricity (solar, wind, coal, diesel, nuclear, etc) and each one
of these releases to the atmosphere a different amount of Carbon Dioxide (co2),
therefore transmit **x** amount of data will release a **y** amount of **co2**.

This module gets the information from [Electricity Maps](https://www.electricitymap.org/) through the 
[co2-data library](../co2-data).
I downloaded the results every hour for 1 day and averaged them by country.

## Usage
Install the package using 
`yarn add bytes-to-co2` 
or 
`npm install bytes-to-co2`

Import the library and call the function as shown:
```javascript
import { bytesToCo2 } from "bytes-to-co2";

const uk = bytesToCo2({ byteSize: 1000000, country: 'GB' }); // 0.35021555843286817
const sweden = bytesToCo2({ byteSize: 1000000, country: 'SE' }); // 0.06411629304105701
const spain = bytesToCo2({ byteSize: 1000000, country: 'ES' }); // 0.4461472854018211
const world = bytesToCo2({ byteSize: 1000000, country: 'ZZ' }); // 0.539680558728753
```

## Contributing
If anything in the way I'm calculating the footprint looks odd to you, please feel free to open an issue or PR.
Any feedback or improvements in the way the co2 is calculated is welcomed.

## Special thanks

- [Wholegrain Digital](https://www.wholegraindigital.com/): They were very helpful explaining to me how the carbon
calculation is made.
- [Electricity Map](https://www.electricitymap.org/map): They were very kind in allowing me to use their data for this
library. Without them I would still be using very outdated data.
