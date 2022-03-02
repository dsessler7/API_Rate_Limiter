// const HttpError = require("./httpError");

const WINDOW_SECONDS = 5;
const REQUESTS_PER_WINDOW = 3;
let requests = {};

function rateLimitReached(address) {
  if (requests[address] >= REQUESTS_PER_WINDOW) {
    return true;
  } else return false;
}

function rateLimiter(req, res, next) {
  let address = req.ip;
  if (rateLimitReached(address)) {
    // throw new HttpError("Rate limit exceeded.", 429);
    res.status(429).send('You have exceeded the rate limit for requests to this API.');
  } else {
    requests[address] = requests[address] ? requests[address] + 1 : 1;

    console.log('everybody to the limit: ', requests);
    next();
  }
}

setInterval(() => {
  requests = {};
  console.log(requests);
}, WINDOW_SECONDS * 1000);

module.exports = {
  rateLimiter
};