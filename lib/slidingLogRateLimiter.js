// const { keyIn } = require("readline-sync");
// const HttpError = require("./httpError");

const WINDOW_SECONDS = 5;
const REQUESTS_PER_WINDOW = 3;
let requests = {};

function rateLimitReached(address) {
  if (!requests[address] || requests[address].length < REQUESTS_PER_WINDOW) {
    return false;
  } else {
    let windowOpening = new Date(Date.now() - (WINDOW_SECONDS * 1000));

    requests[address].filter(timestamp => timestamp > windowOpening);

    if (requests[address].length < REQUESTS_PER_WINDOW) {
      return false;
    } else return true;
  }
}

/**
 * values are arrays sorted by time
 *
 * When a request comes in, check the number of requests for that user
 *  if not over rate limit, respond
 *  if over over limit
 *      purge record of any requests outside of current window
 *      if still over rate limit
 *        deny
 *      else
 *        respond
 *
 */

function rateLimiter(req, res, next) {
  let address = req.ip;
  let timestamp = new Date();
  if (rateLimitReached(address)) {
    // throw new HttpError("Rate limit exceeded.", 429);
    res.status(429).send('You have exceeded the rate limit for requests to this API.');
  } else {
    if (requests[address]) {
      requests[address].push(timestamp);
    } else {
      requests[address] = [timestamp];
    }

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