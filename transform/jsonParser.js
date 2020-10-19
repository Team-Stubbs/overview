const csvJson = require('csvtojson');
const fs = require('fs');
//CHANGES DEPENDING ON CSV

const readStream = fs.createReadStream('/Users/milito/bigData/photos.csv');
// const writeStream = fs.createWriteStream('/Users/milito/bigData/photosToJson.json');
readStream.pipe(csvJson({downstreamFormat: 'array'})).pipe(writeStream);
readStream.on('end', () => {
  console.log('Finished');
})