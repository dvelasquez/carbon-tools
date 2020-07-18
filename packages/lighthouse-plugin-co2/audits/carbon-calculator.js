/**
 * @todo double check this number
 * @desc This is the average energy spent in transfer and process 1gb of data
 * @type {number}
 */
const AVERAGE_KILO_WATT_HOUR_PER_GB = 1.805

/**
 * @todo get information of different energy grids
 * @desc This is the average amount of co2 grams created for every kWh of energy in the US energy grid
 * @type {number}
 */
const AVERAGE_CARBON_FACTOR_GRID = 475
/**
 * @desc 1gigabyte in bytes
 * @type {number}
 */
const GIGABYTE_TO_BYTES = 1073741824
/**
 * @desc formula to adjust the value of data transferred
 * Assuming that 25% of the users have already visited the page and have cached data, where
 * they have to download a 2% of the assets.
 * Ported from: https://gitlab.com/wholegrain/carbon-api-2-0/blob/master/helpers/statistics.php#L25
 * @param {number} val
 * @returns {number}
 */
const adjustDataTransfer = (val) => {
    return val * 0.75 + 0.02 * val * 0.25
}
/**
 * @desc formula to calculate the energy consumption of a website given his byte size
 * Ported from: https://gitlab.com/wholegrain/carbon-api-2-0/blob/master/helpers/statistics.php#L33
 * @param {number} bytes
 * @returns {number}
 */
const energyConsumption = (bytes) => {
    return bytes * (AVERAGE_KILO_WATT_HOUR_PER_GB / GIGABYTE_TO_BYTES)
}
/**
 * @desc formula to calculate the co2 emitted to create this amount of energy
 * @param {number} energy
 * @returns {number} as grams of co2
 */
const getCo2Grid = (energy) => {
    return energy * AVERAGE_CARBON_FACTOR_GRID
}

const calculateCo2 = (assetsTotalSize) => getCo2Grid(energyConsumption(adjustDataTransfer(assetsTotalSize)))

module.exports = calculateCo2;