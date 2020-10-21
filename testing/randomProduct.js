
module.exports = {
  randomProductId,
}

function randomProductId(requestParams, context, ee, next) {
  // Math.floor(Math.random() * (1000000 - 500000) + 500000);
  //from 5-hundred-thousand to 1 million
  let randomNumber = Math.floor(Math.random() * 500000);
  requestParams.url = requestParams.url + randomNumber;
  return next();
}