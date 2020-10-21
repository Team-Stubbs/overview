const LRU = require('lru-cache');
const cache = new LRU({max: 250})
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = 4000;
const dbMethods = require('../database/index.js');

app.use(cors());
app.use(express.json());

app.get('/product/:productId', (req, res) => {
  let id = req.params.productId;
  let inCache = cache.get(id)
  if (inCache) {
    res.send(inCache);
    return;
  }
  dbMethods.getProductData(id, (err, result) => {
    if (err) {
      res.status(500).send('Product Not Found');
    } else {
      cache.set(id, result);
      res.send(result);
    }
  })
});
3
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
