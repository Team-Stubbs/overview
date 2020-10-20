const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";
const dbName = 'stubbs';
let db;
let mongoClient;

MongoClient.connect(url, {useNewUrlParser:true, useUnifiedTopology:true},
  ( err, client ) => {
  if (err) {
    console.log('Connection error to mongodb:', err);
  } else {
    console.log('Connected to mongo database');
    mongoClient = client;
    db = client.db(dbName);
  }
});

const findProduct = (productId)=> {
  return new Promise((resolve, reject) => {
    db.collection('product').findOne({'id': productId}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  });
}

const findStyles = (productId)=> {
  return new Promise((resolve, reject) => {
    db.collection('styles').findOne({'productId': productId}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  });
}

const findSkus = (productId)=> {
  return new Promise((resolve, reject) => {
    db.collection('skus').findOne({'productId': productId}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  });
}

const findPhotos = (productId)=> {
  return new Promise((resolve, reject) => {
    db.collection('photos').findOne({'productId': productId}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  });
}

const findFeatures = (productId)=> {
  return new Promise((resolve, reject) => {
    db.collection('features').findOne({'productId': productId}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  });
}

const formatAllData = (dataArray) => {
  let product = dataArray[0];
  //if no product returned then it does not exist;
  if (!product) {
    return undefined;
  }
  let style = dataArray[1];
  let skus = dataArray[2];
  let photos = dataArray[3];
  let features = dataArray[4];
  if (!style) {
    style = {};
    style.stylesIds = [];
    style.totalStyles = 0;
    style.styles = {};
  } 
  if (!skus) {
    skus = {};
    skus.size = {};
    skus.totalSizes = 0;
  }
  if (!photos) {
    photos = {};
    photos.photos = {};
  }
  if (!features) {
    features = {};
    features.features = {};
    features.totalFeatures = 0;
  }
  let completeProductData = {
  productId: product.id,
  name: product.name,
  slogan: product.slogan,
  description: product.description,
  category: product.category,
  default_price: product.default_price,
  stylesIds: style.stylesIds,
  totalStyles: style.totalStyles,
  styles: style.styles,
  size: skus.size,
  totalSizes: skus.totalSizes,
  photos: photos.photos,
  features: features.features,
  totalFeatures: features.totalFeatures,
  schema_version: 1,
}
  return completeProductData;
}

const insertCompleteProduct = (data) => {
  return new Promise((resolve, reject) => {
    db.collection('productAll').updateOne({productId: data.productId}, {$set: data}, {upsert: true})
    .then((res) => {
      console.log('Inserted or Modified:', res.result );
    })
    .catch((err) => {
      console.log('Error inserting:', err );
    })
  });
}

const getProductData = (productId, callback) => {
  let id = parseInt(productId);
  let product = findProduct(id);
  let style = findStyles(id);
  let photos = findPhotos(id);
  let skus = findSkus(id);
  let features = findFeatures(id);
  Promise.all([product, style, skus, photos, features])
  .then((results) => {
    if (!results[0]) {
      throw new Error('No Product found');
    }
    //we insert into our database
    //then we send back data
    let formatted = formatAllData(results);
    insertCompleteProduct(formatted);
    callback(null, formatted);
  })
  .catch((err) => {
    callback(err, null);
  })
}

module.exports = {
  getProductData,
};