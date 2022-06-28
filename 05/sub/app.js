const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const port = 5000
app.listen(port, function() {
  console.log('http://localhost:' + port);
})
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(cookieParser())
app.use(function(req, res, next) {
  console.log('sub:' + req.cookies.sub)
  res.cookie('sub', 'sub', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  })
  next()
})
app.get('/', function(req, res) {
  res.send()
})
