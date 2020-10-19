/**DATABASE CONNECTION**/
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/stubbs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to Mongo Database!');
});

//a schema will define how our collection will look like
//since schema is already defined we can include an empty one
const productSchema = new mongoose.Schema({});
const Product = mongoose.model('Product', productSchema, 'product');

const findOneProduct = (productId, callback) => {
  Product.findOne({"id": productId}, (err, res) => {
    console.log(err, res);
    if (err) {
      callback(err, null);
    } else {
      callback(null, res);
    }
  })
}
// findOneProduct(1000000, (err, res) => {
//   console.log(res, 'find');
// })
const styleSchema = new mongoose.Schema({});
const Style = mongoose.model('Style', styleSchema, 'styles');

const findStyles = (productId, callback) => {
  Style.find({"productId": productId}, (err, res) => {
    if (err) {
      console.log('error:', err);
    } else {
      res.forEach((style) => {
        console.log(style);
      })
    }
  })
}
// findStyles(1000);
const skusSchema = new mongoose.Schema({});
const Skus = mongoose.model('Skus', skusSchema, 'skus');

const findSkus = (productId, callback) => {
  Skus.find({"id": productId}, (err, res) => {
    if (err) {
      // callback(err, null);
      console.log(err);
    } else {
      console.log(res);
      // callback(null, res);
    }
  })
}
findSkus(1000);



module.exports = {
  findOneProduct: findOneProduct,
  findStyles: findStyles,
};