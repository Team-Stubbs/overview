const fs = require('fs');
const readline = require('readline');
const readStream = fs.createReadStream('');
// const writeStream = fs.createWriteStream('');


const rl = readline.createInterface({
  input: readStream,
  // crlfDelay: Infinity,
});

let currentProductId = 1;
let styleDocument = {
  productId : 1,
  stylesIds: [],
  styles : {},
  totalStyles: 0,
  schema_version: 1,
}

const formatStyles = (data) => {
  if (parseInt(data.productId) === currentProductId) {
    styleDocument.stylesIds.push(data.id);
    styleDocument.styles[data.id] = data;
    styleDocument.totalStyles++;
  } else {
    //lets write the file to JSON
    writeStream.write(JSON.stringify(styleDocument), () => {
    });
    currentProductId = parseInt(data.productId);
    //reset the object
    styleDocument = { 
      productId: parseInt(data.productId),
      stylesIds: [],
      styles: {},
      totalStyles: 0,
      schema_version: 1,
    }
    styleDocument.stylesIds.push(data.id);
    styleDocument.styles[data.id] = data;
    styleDocument.totalStyles++;
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
    //here we will write
    formatStyles(JSON.parse(line))
  }
})