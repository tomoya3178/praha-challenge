const express = require('express');
const app = express();
const port = 3000
app.listen(port, function() {
  console.log('http://localhost:' + port);
});

app.use(express.json());

app.use(function(req, res, next) {
  if (!req.is('application/json')) {
    return res.status(400);
  }
  next();
});

app.get('/', function(req, res) {
  return res.status(200).json({
    text: 'hello world'
  });
});

app.post('/', function(req, res) {
  return res.status(201).json(req.body);
});
