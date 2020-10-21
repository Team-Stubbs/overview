const fs = require('fs');
const readStream = fs.createReadStream('/Users/milito/bigData/photosToJson.json');
// const writeStream = fs.createWriteStream('/Users/milito/bigData/photosToMongo.json');
const readline = require('readline');

const rl = readline.createInterface({
    input: readStream,
    // crlfDelay: Infinity,
  });
  
let currentStyleId = 1;
let photoDocument = {
  productId : 1,
  styleArray: [],
  photos : {},
  totalStyles : 0,
  schema_version: 1,
}
// {"id":"1","styleId":"1","url":"https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
// "thumbnail_url":"https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80"}

const formatSkus = (data) => {
  let urlObject = {
    "url": data.url,
    "thumbnail_url": data.thumbnail_url,
  }
  if (parseInt(data.styleId) === currentStyleId) {
    photoDocument.styleArray.push(data.id);
    photoDocument.photos[data.id] = urlObject;
    photoDocument.totalStyles++;
    // rl.resume()
  } else {
    console.log(photoDocument);
    //lets write the file to JSON
    // writeStream.write(JSON.stringify(photoDocument)), () => {
    // }
    currentStyleId = parseInt(data.styleId);
    //reset the object
    photoDocument = { 
      productId : currentStyleId,
      styleArray: [],
      photos : {},
      totalStyles: 0,
      schema_version: 1,
    }
    photoDocument.totalStyles++;
    photoDocument.styleArray.push(data.id);
    photoDocument.photos[data.id] = urlObject;
  }
    
}
  
let processCorrectly = 1;
rl.on('line', (line) => {
  line = line.trim();

  if (line.charAt(line.length -1) === ',') {
    line = line.substr(0, line.length - 1);
  }

  if (line.charAt(0) === '{') {
    processCorrectly++;
   
    formatSkus(JSON.parse(line))
  }
})

writeStream.on('error', () => {
  console.log('WRITE STREAM ERROR');
  rl.close();
})
readStream.on('end', () => {
  console.log('Completed');
})