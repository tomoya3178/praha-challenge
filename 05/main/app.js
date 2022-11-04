const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const port = 3000
app.listen(port, function() {
  console.log('http://localhost:' + port);
})
app.use(cookieParser())
app.use(function(req, res, next) {
  console.log('main:' + req.cookies.main)
  res.cookie('main', 'main', { httpOnly:true })
  next()
})
app.use(express.static('public'))
