'use strict';

const requestPromise = require('request-promise'),
      cheerio = require('cheerio'),
      fs = require('fs'),
      createCsvWriter = require('csv-writer').createArrayCsvWriter,
      path = './data.csv';


function main() {
  const options = {
    uri: 'http://qpublic9.qpublic.net/ga_display_dw.php?county=ga_fulton&KEY=14%20001400050323',
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0'
    }	  
  };
  requestPromise(options).then(data => {
    let $ = cheerio.load(data);
    let targetTable = $('tbody', '.table_class').eq(-3);
    let vals = "";
    let csvHeader = [];
   // not using arrow fn here because of the
   // change in `this`
    targetTable.children().each(function(idx){
      if (idx == 1) {
        csvHeader = $(this).text().trim().replace(/\n/g, ',').split(',');              
      } else {
        console.log($(this).text());               
        
      } 
      initCsv(csvHeader, path);
    });
  }, (err) => {
    console.log('scraping failed: ', err);
  });	
}

function initCsv(header, path) {
  const opts = {
    header: header,
    path: path
  };
   createCsvWriter(opts);
}

function writeCsvRow(record) {
  csvWriter.writeRecords(record).then( () => {
    console.log('yay!');
  });
}

main();

