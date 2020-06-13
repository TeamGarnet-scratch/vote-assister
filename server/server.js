const path = require('path');
const express = require('express');
const app = express();

const port = 3000;

app.use(express.static(path.resolve(__dirname, '../dist')));
//app.get('/', (req, res) => res.send('hello world'))
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
