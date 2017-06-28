'use strict';

const requestPromise = require('request-promise'),
      cheerio = require('cheerio'),
      fs = require('fs'),
      csv = require('fast-csv'),
      path = './data.csv';

     const stream = fs.createWriteStream(path);

function main() {
    // hardcoding this for now
    //
    let parcelNumber = 1400050323;
  const options = {
    uri: 'http://qpublic9.qpublic.net/ga_display_dw.php?county=ga_fulton&KEY=14%20001400050323',
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0'
    }
  };
  requestPromise(options).then(data => {
    let $ = cheerio.load(data);
    let targetTable = $('tbody', '.table_class').eq(-3); 
    let textToWrite = [];
   // not using arrow fn here because of the
   // change in the context of `this`
    targetTable.children().first().siblings().each(function(idx){
      if (idx == 0) {
        // TODO: trim each element of this
       let tableHeader = makeSemicolonSeparated($(this).text()).split(';');
       // taking advantage of the empty element at beginning of array
       tableHeader.unshift('Parcel Number');
       textToWrite.push(tableHeader);
      } else {
        // TODO: clean this input
        let tableRowText = makeSemicolonSeparated($(this).text());
        let tableRow = tableRowText.split(';');
        let csvRow = tableRow.map((currVal) => {
            let isDollarAmount = currVal.match(/[\$]/);
            if (isDollarAmount) {
              return currVal.replace(/\$/, '').replace(',', '').trim();
            }
            return currVal;
        });

        // taking advantage of the empty element at beginning of array
        csvRow.unshift(parcelNumber);
        textToWrite.push(csvRow);
      }
    });
     csv.writeToStream(stream, textToWrite, {headers: true});
      console.log(textToWrite);
  }, (err) => {
    console.log('scraping failed: ', err);
  });
}

// opting for semicolons instead of commas due to
// commas in dollar figures
function makeSemicolonSeparated(data) {
  return data.replace(/[\n]/g, ';');
}


function writeCsvRow(record) {
}

main();

