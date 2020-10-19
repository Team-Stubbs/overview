const express = require('express');
const app = express();
const PORT = 4000;
const dbMethods = require('../database/index.js');

app.use(express.json());
let CACHE = {};
let cacheCount = 0;

app.get('/:productId', (req, res) => {
  let id = req.params.productId;
  if (CACHE[id]) {
    res.send(CACHE[id]);
    console.log('In last cache');
    return;
  }
  dbMethods.getProductData(id, (err, result) => {
    if (err) {
      res.status(500).send('Product Not Found');
    } else {
      //allow up to 3 Caches
      cacheCount++;
      if (cacheCount > 3) {
        CACHE = {};
        cacheCount = 0;
      }
      CACHE[id] = result;
      res.send(result);
    }
  })
});


app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
