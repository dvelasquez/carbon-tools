(async () => {
    // const bytesToCo2Src = chrome.runtime.getURL('browser-esm/bytes-to-co2.min.js')
    // const byteToCo2 = await import(bytesToCo2Src)
    const broadcastMetrics = (networkTransferred) => {
        // run only on the active tab
        if (!document.hidden) {
            chrome.runtime.sendMessage({
                networkTransferred
            }, (response) => response)
        }

    }

    const computeResourcesSize = () => {
        if (performance) {
            const resources = performance.getEntriesByType('resource')
            resources.push(performance.getEntriesByType('navigation')[0])
            let networkTransferred = 0
            resources.forEach((entry) => {
                networkTransferred += entry.transferSize;
            })
            broadcastMetrics(networkTransferred);
        }
    }
    // setInterval(computeResourcesSize, 5000)
    computeResourcesSize()
})();



