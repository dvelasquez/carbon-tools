(async () => {
    const bytesToCo2Src = chrome.runtime.getURL('browser-esm/bytes-to-co2.min.js')
    const {byteToCo2} = await import(bytesToCo2Src)

    const ONE_DAY_MS = 8.64e+7;

    function isObjectEmpty(object) {
        for (let i in object) return false;
        return true
    }

    /**
     * @param {PositionOptions} options
     * @returns {Promise<Position>}
     */
    function getPosition(options) {
        return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options))
    }

    function setStoredData(data) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set(data, () => {
                if (chrome.runtime.lastError !== undefined) {
                    reject(chrome.runtime.lastError)
                }
                resolve()
            })
        })
    }

    function getStoredData(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(key, (data) => {
                if (chrome.runtime.lastError !== undefined) {
                    reject(chrome.runtime.lastError)
                }
                resolve(data)
            })
        })
    }

    async function getCountryData(currentDate) {
        try {
            const currentDateInMs = currentDate.getTime()
            const {lastUpdate, locationData} = await getStoredData(['lastUpdate', 'locationData'])
            if (!lastUpdate || isObjectEmpty(locationData) || ((currentDateInMs - lastUpdate) > ONE_DAY_MS)) {
                const location = await getCountry();
                await setStoredData({location})
                await setStoredData({lastUpdate: new Date().getTime()})
                return location
            } else {
                return locationData;
            }
        } catch (e) {
            console.error(e);
        }
    }

    function getCountry() {
        return new Promise((resolve, reject) => {
            return fetch('https://freegeoip.app/json/',
                {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(resolve)
                .catch(reject)
        })

    }

    function runExtension(tabId) {
        chrome.tabs.executeScript({
            file: 'co2-extension-runner.js'
        }, function (result) {
            if (chrome.runtime.lastError !== undefined) {
                console.error('co2-extension', chrome.runtime.lastError)
            }
        })
    }

// User has navigated to a new URL in a tab
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        const tabIdKey = tabId.toString();

        if (tab.active) {
            chrome.storage.local.set({[tabIdKey]: false});
        } else {
            chrome.storage.local.set({[tabIdKey]: true}); // tab was loaded in background
        }

        if (
            changeInfo.status == 'complete' &&
            tab.url.startsWith('http') &&
            tab.active
        ) {
            runExtension(tabId);
        }
    });

// User has made a new or existing tab visible
    chrome.tabs.onActivated.addListener(({tabId, windowId}) => {
        runExtension(tabId);
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('received message', request, sender);
        getCountryData(new Date())
            .then(async ({country_code}) => {
                const co2Footprint = byteToCo2({
                    byteSize: request.networkTransferred,
                    country: country_code,
                    isDataAdjusted: false
                })
                await setStoredData({co2Footprint})
                console.info('Calculated CO2 footprint', co2Footprint)
                chrome.browserAction
                    .setBadgeText(
                        {text: ''+co2Footprint.toFixed(2), tabId: sender.tab.id},
                        ()=>{
                            sendResponse();
                            return true;
                        })
            })
    })
})()

