const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000
app.listen(port, function() {
  console.log('http://localhost:' + port);
})
app.use(cors({
  // origin: 'http://localhost:3000',
  origin: 'https://4fe6-2001-268-c0e6-a72d-4ce9-6631-88f0-895b.ngrok.io',
  methods: 'POST'
}))
app.get('/', function(_, res) {
  res.send()
})
app.post('/', function(_, res) {
  res.send()
})
app.put('/', function(_, res) {
  res.send()
})