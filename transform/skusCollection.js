const fs = require('fs');
const readline = require('readline');
const readStream = fs.createReadStream('/Users/milito/bigData/skusToJson.json')
// const writeStream = fs.createWriteStream('/Users/milito/bigData/mongoSkus.json');


const rl = readline.createInterface({
    input: readStream,
    // crlfDelay: Infinity,
  });
  
let currentStyleId = 1;
let skusDocument = {
  productId : 1,
  sizeArray: [],
  size : {},
  totalSizes : 0,
  schema_version: 1,
}

const formatSkus = (data) => {
  let sizeObject = {
    "quantity": data.quantity,
  }
  if (parseInt(data.styleId) === currentStyleId) {
    skusDocument.sizeArray.push(data.size);
    skusDocument.size[data.size] = sizeObject;
    skusDocument.totalSizes++;
    // rl.resume()
  } else {
    //lets write the file to JSON
    writeStream.write(JSON.stringify(skusDocument)), () => {
      //
    }
    currentStyleId = parseInt(data.styleId);
    //reset the object
    skusDocument = { 
      productId : currentStyleId,
      sizeArray: [],
      size : {},
      totalSizes: 0,
      schema_version: 1,
    }
    skusDocument.totalSizes++;
    skusDocument.sizeArray.push(data.size);
    skusDocument.size[data.size] = sizeObject;
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