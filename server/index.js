var config = require('../config.json')
var log = require('./logger')
var request = require('./request')
var upload = require('./uploader')
var cors = require('cors')
var express = require('express')
var bodyParser = require('body-parser')
var compress = require('compression')
var builder = require('./builder')
var base = require('./base')

var publishAggregations = require('./aggregations/publish')

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

app.get('/publish/aggregations/form/:id', publishAggregations)


// create a form
app.post('/create', function (req, res) {
  log('Route /create: Forwarding form to the Ask service: ID: ' + req.body.id)

  // Inject base URL into form settings
  req.body.settings.baseUrl = base

  request(req)
    .post({
      uri: '/v1/form',
      body: req.body
    })
    .then(function (response) {
      log('Route /create: Askd responsed. Success: Saved Form ' + response.id)

      var extras = {}
      extras.id = response.id
      if (config.recaptcha && req.body.settings.recaptcha) {
        extras.recaptcha = config.recaptcha
      }

      return builder
        .buildWidget(Object.assign(req.body, extras), false)
        .then(code => Promise.all([
          upload(response.id, code, './templates/iframe-form.pug'),
          code
        ]))
        .then(results => {
          res.json({
            urls: results[0],
            data: response
          })
        })
        .catch(function (err) {
          log('Elkhorn: Write file error. Could not upload (publish) form ' + response.id)
          console.log(err)
          log(err.message)
          res.status(400).send(err.message)
        })
    })
    .catch(function (err) {
      log('Route /create: Askd responded with Error: ' + err.message)
      log('Could not save form ' + req.body.id)
      log(err)
      res.status(500).send(err.message)
    })
})

// publish a gallery
app.post('/gallery/:galleryId/publish', (req, res) => {
  log(`Publish Gallery: Route /gallery/${req.params.galleryId}/publish ` + req.body.id)

  req.body.config.baseUrl = base

  request(req)
    .put({
      uri: `/v1/form_gallery/${req.params.galleryId}`,
      body: req.body
    })
    .then(function (response) {
      log('Response from askd: Success. Gallery Saved: ' + response.id)

      return builder.buildGallery(req.body)
    })
    .then(build => Promise.all([
      upload(req.params.galleryId, build.code, './templates/iframe-gallery.pug'),
      build
    ])).then(results => {

      res.json({
        urls: results[0],
        build: results[1]
      })
    })
    .catch(function (err) {
      console.log(err)
      log('Error Publishing form ' + req.body.id)
      log(err.data.message)
      res.status(400).send(err.data.message)
    })
})

app.listen(config.port || 4444, function () {
  log('Running at port 4444')
  log('Ask service host: ' + config.askHost)
})
