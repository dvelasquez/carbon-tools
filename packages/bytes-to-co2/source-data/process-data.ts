import fs from 'fs';
import path from 'path';
import { ESLint } from 'eslint';
import { ElectricityMapDataResponse } from './electricity-map';
import { getCountries } from './country-names';
import { ElectricityMapResult, getDataByCode } from './index';

interface ElectricityMapResultAveraged extends ElectricityMapResult {
  co2List: number[];
  dailyAverage: number | null;
}

(async () => {
  const fsPromise = fs.promises;
  const PAYLOAD_FOLDER = './source-data/json';
  const OUTPUT_FILE = './source-data/electricity-map-data.ts';
  const filesInDirectory = await fsPromise.readdir(path.resolve(PAYLOAD_FOLDER));

  const files = filesInDirectory.filter((file) => {
    return file.includes('.json');
  });
  const resultList: { filename: string; payload: ElectricityMapDataResponse }[] = await Promise.all(
    files.map(
      async (file): Promise<{ filename: string; payload: ElectricityMapDataResponse }> => ({
        filename: file,
        payload: JSON.parse((await fsPromise.readFile(path.resolve(`${PAYLOAD_FOLDER}/${file}`))).toString()),
      }),
    ),
  );

  const countryList = getCountries();
  const groupedData = resultList.map((result) => {
    const averagesByCode = countryList.map(({ code }) => {
      return getDataByCode(result.payload, code);
    });
    return { filename: result.filename, averagesByCode };
  });
  const averagedResult: ElectricityMapResultAveraged[] = JSON.parse(JSON.stringify(groupedData[0].averagesByCode));
  groupedData.forEach(({ averagesByCode }, index) => {
    if (index === 0) {
      averagesByCode.forEach((value: ElectricityMapResult) => {
        averagedResult.forEach((result: ElectricityMapResult, current) => {
          averagedResult[current].co2List = averagedResult[current].co2List || [];
        });
      });
    } else {
      averagesByCode.forEach((value: ElectricityMapResult) => {
        averagedResult.forEach((countryValue) => {
          if (countryValue.code === value.code && value.averageCo2Intensity > 0)
            countryValue.co2List.push(value.averageCo2Intensity);
        });
      });
    }
  });
  // Create world average
  let worldSum = 0;
  let countriesWithValues = 0;
  averagedResult.forEach((resultAveraged) => {
    const dailyAverage =
      resultAveraged.co2List.reduce((a, b) => a + b, 0) / resultAveraged.co2List.filter((value) => value > 0).length;
    resultAveraged.dailyAverage = dailyAverage;

    if (dailyAverage) {
      worldSum += dailyAverage;
      countriesWithValues++;
    }
  });
  console.log('countries: ', countriesWithValues, ' worldSum: ', worldSum);
  // Add world average
  averagedResult.push({
    code: 'ZZ', // Unknown or unspecified country
    co2List: [],
    averageCo2Intensity: 0,
    co2Intensities: [],
    codeList: [],
    dailyAverage: worldSum / countriesWithValues,
  });
  const typescriptFile = `
  import { ElectricityMapResult } from './index';
  
  export interface ElectricityMapDataComputed extends ElectricityMapResult {
    co2List: number[];
    dailyAverage: number | null;
  }
  export const electricityMapData: ElectricityMapDataComputed[] = ${JSON.stringify(averagedResult)}
  `;
  await fsPromise.writeFile(OUTPUT_FILE, typescriptFile, { encoding: 'utf-8' });
  const eslint = new ESLint({ fix: true });
  const results = await eslint.lintFiles(OUTPUT_FILE);
  await ESLint.outputFixes(results);
  const formatter = await eslint.loadFormatter('stylish');
  const resultText = formatter.format(results);
  console.debug(resultText);
})();
