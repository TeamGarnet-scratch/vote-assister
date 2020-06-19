const express = require('express');
const path = require('path');
const router = require('./routes/router');

// passing in the path to config here because we've got the .env file in the root folder
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

const app = express();
const port = 3000;

// used to parse JSON bodies
app.use(express.json());

// define route handlers
app.use('/api', router);

// serve up static assets
app.use(express.static(path.resolve(__dirname, '../dist')));

// catch-all route handler for any requests to an unknown route
app.get('*', (req, res) => {
  res.sendStatus(404);
});

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };

  // create an object and put into it the defaultErr overwritten with the err object parameter (if it was passed in)
  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);
  res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
