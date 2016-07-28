var config = require('../config.json')
var log = require('./logger')
var request = require('./request')
var upload = require('./uploader')
var cors = require('cors')
var express = require('express')
var bodyParser = require('body-parser')
var compress = require('compression')
var builder = require('./builder')

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
var base = isS3 ? 'https://s3.amazonaws.com/' + config.s3.bucket + '/' : '/widgets/' // relative

app.get('/iframe/:id', function (req, res) {
  res.render('iframe-form', { base: base, id: req.params.id })
})

app.get('/iframe-gallery/:id', (req, res) => {
  res.render('iframe-gallery', {base, id: req.params.id})
})

app.get('/preview.js', function (req, res) {
  try {
    var props = JSON.parse(req.query.props)
    props.preview = true
    builder.buildWidget(props, true)
    .then(function (code) {
      res.send(code)
    })
    .catch(function (err) { res.status(500).send(err.stack) })
  } catch (err) {
    res.status(400).send('Bad request')
  }
})

// create a form
app.post('/create', function (req, res) {
  log('Route /create: Forwarding form to pillar')
  request.post('/api/form', req.body)
    .then(function (response) {
      log('Response received from pillar:')
      log(response)

      builder.buildWidget(req.body, false).then(function (code) {
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

// publish a gallery
app.post('/gallery/:galleryId/publish', (req, res) => {
  log(`Route /gallery/${req.params.galleryId}/publish`)
  log(req.body)
  request.put(`/api/form_gallery/${req.params.galleryId}`, req.body)
  .then(function (response) {
    log('Response received from pillar:')
    log(response)

    builder.buildGallery(req.body).then(build => {
      return Promise.all([upload(req.params.galleryId, build.code), build])
    }).then(results => {
      const url = results[0]
      const build = results[1]

      res.json({url, build})
    })
    .catch(error => {
      console.error(error.stack)
    })
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
