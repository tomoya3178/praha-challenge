const express = require('express')
const cacheControl = require('express-cache-controller');
const fs = require('fs')

const app = express()
const port = 3000
app.listen(port, function() {
  console.log('http://localhost:' + port);
})
app.use(cacheControl())

app.get('/image', (_, res) => {
  fs.readFile('./reiwa.png', (_, data) => {
    res.type('png');
    res.send(data);
  });
});

app.get('/cached', (_, res) => {
  res.cacheControl = {
    maxAge: 600
  }
  fs.readFile('./reiwa.png', (_, data) => {
    res.type('png');
    res.send(data);
  });
});
