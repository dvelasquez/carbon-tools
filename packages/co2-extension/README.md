# CO2-extension (WORK IN PROGRESS)
This is a Chrome Extension that calculates the amount of co2 released to the atmosphere by transferring
the page assets over the network.

## How it works
1. Injects a small script that uses the Performance API, getting information about the transferSize of the assets in 
the page with `performance.getEntriesByType('resource')`
2. Sums only the `transferSize` of each entry in the Performance API
3. Once a day checks the user location with based on the IP address, using the `https://freegeoip.app/json/` API.
In this case, we only need the Country Code.
4. Using the library [bytes-to-co2](https://github.com/dvelasquez/bytes-to-co2) we calculate the CO2 based
on the Country the user is and the size of the page.

## Caveats
CORS: It only get the `transferSize` for assets with CORS or are in the same domain you are visiting.
Due to this, almost all the 3rd parties don't get reported nor evaluated.

## TODO
- [ ] Refactor code
- [ ] Create tests
- [ ] Create Icons
- [ ] Setup deploy pipeline
- [ ] Make it available in the Chrome Store

## Contributing
If you have ideas, know how to fix one of the caveats or want to help with icons, badges or documentation
please feel free to contact me, open an issue or make a PR.
