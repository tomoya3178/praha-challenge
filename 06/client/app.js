const express = require('express')
const app = express()
const port = 3000
app.listen(port, function() {
  console.log('http://localhost:' + port);
})
app.use(express.static('public'))