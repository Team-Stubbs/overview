const fs = require('fs');
const readStream = fs.createReadStream('/Users/milito/bigData/featuresJson.json');
// const writeStream = fs.createWriteStream('/Users/milito/bigData/featuresToMongo.json');
const readline = require('readline');

const rl = readline.createInterface({
    input: readStream,
    // crlfDelay: Infinity,
  });
  
let currentStyleId = 1;
let featuresDocument = {
  productId : 1,
  styleArray: [],
  features : {},
  totalFeatures : 0,
  schema_version: 1,
}
// {"id":"1","productId":"1","feature":"Fabric","value":"Canvas"},
const formatSkus = (data) => {
  let featureObject = {
    "feature": data.feature,
    "value": data.value,
  }
  if (parseInt(data.productId) === currentStyleId) {
    featuresDocument.styleArray.push(data.id);
    featuresDocument.features[data.id] = featureObject;
    featuresDocument.totalFeatures++;
    // rl.resume()
  } else {
    // console.log(featuresDocument);
    //lets write the file to JSON
    writeStream.write(JSON.stringify(featuresDocument)), () => {
    }
    currentStyleId = parseInt(data.productId);
    //reset the object
    featuresDocument = { 
      productId : currentStyleId,
      styleArray: [],
      features : {},
      totalFeatures: 0,
      schema_version: 1,
    }
    featuresDocument.totalFeatures++;
    featuresDocument.styleArray.push(data.id);
    featuresDocument.features[data.id] = featureObject;
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