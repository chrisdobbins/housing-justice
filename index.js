'use strict';

const requestPromise = require('request-promise'),
      cheerio = require('cheerio'),
      fs = require('fs'),
      csv = require('fast-csv'),
      csvFileToWrite = fs.createWriteStream('./data.csv'),
      csvFileToRead = fs.createReadStream('./Harbour_ATL_addresses-CLEAN.csv');

let csvStream = createCsvWriteStream();

let textToWrite = [];

let createHeaderCallCounter = 0;

main();

function main() {
    // hardcoding this for now
    //
    // let parcelId = 1400050323;
    // scrapePage(parcelId);
    //
    csvStream.pipe(csvFileToWrite);
    read().on('data', (data) => {
      let parcelId = data.parcelId;
      scrapePage(formatForRequest(parcelId));
    })
    .on('end', () => {
    })
    .on('error', (err) => {
        console.log('error reading csv: ', err);
        csvStream.end();
    })
}

function createHeader(columnNamesText) {
  createHeaderCallCounter++;
  if (createHeaderCallCounter > 1) {
      return [];
  }
  let header = extractTableRow(columnNamesText);
  // taking advantage of the empty element at beginning of array
  header[0] = 'Parcel Number';
  // getting rid of empty element
  header.pop();
  return header;
}

function formatForRequest(parcelId) {
 // filter for: 14F0031
 // if true, then format like so: 14F0031++LL1544
 // filter for: 14F00 (not followed with 31)
 // if true, add no formatting
 //
 // filter for: 09F3
 // if true, add no formatting
 //
 // if all numeric, then
 // format like this: 17+024800070199//

    let testMatch;

    if (testMatch = parcelId.match(/(14F0031)(LL[0-9]+)/)) {
     return `${testMatch[1]}++${testMatch[2]}`;
    } else if (testMatch = parcelId.match(/(^[0-9]{2})([^a-zA-Z]+)/)) {
      return `${testMatch[1]}+${testMatch[2]}`;
    } else {
      return parcelId;
    }

}


function scrapePage(parcelIdQueryParam) {
const options = {
    uri: `http://qpublic9.qpublic.net/ga_display_dw.php?county=ga_fulton&KEY=${parcelIdQueryParam}`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0'
    }
  };
  requestPromise(options).then(data => {
    let $ = cheerio.load(data);
    let targetTable = $('tbody', '.table_class').eq(-3);

   // not using arrow fn here because of the
   // change in the context of `this`
    targetTable.children().first().siblings().each(function(idx){
      if (idx == 0) {
        // TODO: trim each element of this
        let header = createHeader($(this).text());
        if (header.length) {
          csvStream.write(header);
        }
      } else {
        let tableRow = extractTableRow($(this).text());

        let csvRow = tableRow.map((currVal) => {
            return isDollarAmount(currVal) ? cleanMoney(currVal) : currVal;
        });

        // taking advantage of the empty element at beginning of array
        csvRow[0] = extractParcelIdFrom(parcelIdQueryParam);

        // removing empty element
        csvRow.pop();
        csvStream.write(csvRow);
      }
    });
//console.log(textToWrite);
     // write(textToWrite);
      // csvStream.write(textToWrite);

  }, (err) => {
    console.log('scraping failed: ', err);
  });
}

function extractParcelIdFrom(queryParam) {
  return queryParam.replace(/[\+]+/, '');
}

function isDollarAmount(value) {
    return value.match(/[\$]/);
}

function cleanMoney(value) {
    return value.replace(/\$/, '').replace(',', '').trim();
}

function extractTableRow(text) {
    return makeSemicolonSeparated(text).split(';');
}

// opting for semicolons instead of commas due to
// commas in dollar figures
// this is a hacky way b/c of the newline
// @ start and end if each string
function makeSemicolonSeparated(text) {
  return text.replace(/[\n]/g, ';');
}

function createCsvWriteStream() {
    return csv.createWriteStream({headers: true});
}


function read(csvStream) {
    return csv.fromStream(csvFileToRead, {headers: ['parcelId','address']});
}

