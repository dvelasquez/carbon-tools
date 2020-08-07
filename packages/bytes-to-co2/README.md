# bytes-to-co2
Calculate the **co2 footprint** (carbon dioxide released to the atmosphere) 
of transmitting an `x` amount of bytes over the internet.

Transport data over the internet requires energy (datacenters, repeaters,
switches, etc) and how this energy is different from country to country. This
is known as the "co2 emission intensity". Each country have different ways to
produce electricity (solar, wind, coal, diesel, nuclear, etc) and each one
of this releases to the atmosphere a different amount of Carbon Dioxide (co2),
therefore transmit **x** amount of data will release a **y** amount of **co2**.

This module has the information of the [European energy grid](https://www.eea.europa.eu/data-and-maps/daviz/co2-emission-intensity-5#tab-chart_2)
from 1990 to 2016. More countries will be added later.

## Usage
Install the package using 
`yarn add bytes-to-co2` 
or 
`npm install bytes-to-co2`

Import the library and call the function as shown:
```javascript
import { byteToCo2 } from "bytes-to-co2";

//Only with asset size
const europeanUnion = byteToCo2({ byteSize: 1000000 }); // 0.4972508177161217
const uk = byteToCo2({ byteSize: 1000000, country: 'United Kingdom' }); // 0.47253957018256193
const sweden = byteToCo2({ byteSize: 1000000, country: 'Sweden' }); // 0.022357795387506485
const spain = byteToCo2({ byteSize: 1000000, country: 'Spain' }); // 0.4461472854018211
```
