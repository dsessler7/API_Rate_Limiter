const express = require('express');
const routes = require('./routes/api');
const { rateLimiter } = require('./lib/slidingLogRateLimiter');

const app = express();

app.use(rateLimiter);

app.use('/api', routes);

app.use((err, req, res, next) => {
  res.status(err.code || 500);
  res.json({ error: err.message || "An unknown error occured" });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000.');
});