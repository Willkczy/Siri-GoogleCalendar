// index.js
const express = require('express');
const todayEventsHandler = require('./api/today-events');

const app = express();
const port = 3000;

app.get('/api/today-events', todayEventsHandler);

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}/api/today-events`);
});
