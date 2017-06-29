// script to extract ATL addresses from Harbour_addresses_v8.csv
'use strict';
const fs = require('fs'),
      csv = require('fast-csv'),
      csvFileToRead = fs.createReadStream('./Harbour_addresses_v8.csv'),
      csvFileToWrite = fs.createWriteStream('./Harbour_ATL_addresses.csv');

main();

function main() {
  let csvStream = createCsvWriteStream();
  csvStream.pipe(csvFileToWrite);

  read().on('data', (data) => {
            let address = filter(data.address, data.county);
            if (address) {
               csvStream.write({ParcelID: data.parcelId, Address: address});
            }
        })
        .on('end', () => {
            csvStream.end();
        })
        .on('error', (err) => {
            csvStream.end();
            console.log('error: ', err);
        });

  csvFileToWrite.on('finish', () => {
      console.log('csv file written');
  });
}


function read(csvStream) {
    return csv.fromStream(csvFileToRead, {headers: [, 'parcelId', , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,'address', , , , ,'county', ,]});
}

function createCsvWriteStream() {
    return csv.createWriteStream({headers: true});
}

function filter(address, county) {
    const atlAddressFilter = /Atlanta.*GA/;
    if (address.match(atlAddressFilter) && isInFulton(county)) {
       return address;
    }
    return "";
}

function isInFulton(county) {
    return (!county || county.match(/fulton/i))
}

