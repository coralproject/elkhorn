var config = require('../config.json')
var log = require('./logger')
var request = require('./request')
var upload = require('./uploader')
var cors = require('cors')
var express = require('express')
var bodyParser = require('body-parser')
var compress = require('compression')
var buildWidget = require('./builder')

var AWS = require('aws-sdk')

var isS3 = config.s3 && config.s3.bucket

// Config aws
if (isS3) {
  AWS.config.update({
    region: config.s3.region,
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey
  })

  new AWS.S3({params: {Bucket: config.s3.bucket}})
}

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')

  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
}

var app = express()
app.use(cors())
app.use(allowCrossDomain) // explicit header sets for cors
app.use(compress())
app.use(bodyParser.json())
app.use('/widgets', express.static('widgets'))
app.set('view engine', 'pug')
app.set('views', './templates')

// set base url
var base = isS3 ? 'https://s3.amazonaws.com/' + config.s3.bucket + '/' : 'http://localhost:4444/widgets/'

app.get('/iframe/:id', function (req, res) {
  res.render('iframe', { base: base, id: req.params.id })
})

app.get('/preview.js', function (req, res) {
  try {
    var props = JSON.parse(req.query.props)
    buildWidget(props, true)
    .then(function (code) {
      res.send(code)
    })
    .catch(function (err) { res.status(500).send(err.stack) })
  } catch (err) {
    res.status(400).send('Bad request')
  }
})

app.post('/create', function (req, res) {
  log('Route /create: Forwarding form to pillar')
  request.post('/api/form', req.body)
    .then(function (response) {
      log('Response received from pillar:')
      log(response)

      buildWidget(req.body, false).then(function (code) {
        return upload(response.data.id, code)
      })
      .then(function () {
        res.send(response.data)
      })
      .catch(function (err) { res.status(500).send(err.message) })
    })
    .catch(function (err) {
      console.log(err)
      log('Error saving form to Pillar')
      log(err.data.message)
      res.status(400).send(err.data.message)
    })
})

app.listen(4444, function () {
  log('Running at port 4444')
  log('Pillar host: ' + config.pillarHost)
})
