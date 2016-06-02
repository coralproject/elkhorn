var fs = require('fs')
var path = require('path')
var cors = require('cors')
var express = require('express')
var bodyParser = require('body-parser')
var compress = require('compression')
var AWS = require('aws-sdk')
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')
var nodeResolve = require('rollup-plugin-node-resolve')
var uglify = require('rollup-plugin-uglify')
var postcss = require('rollup-plugin-postcss')
var babelConf = require('./babel.json')
var axios = require('axios')

// Configure axios
var config = require('../config.json')
axios.defaults.baseURL = config.pillarHost
axios.defaults.headers.common['Authorization'] = config.basicAuthorization

var isS3 = config.s3 && config.s3.bucket
var s3bucket
if (isS3) {
  AWS.config.update({
    region: config.s3.region,
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey
  })
  s3bucket = new AWS.S3({params: {Bucket: config.s3.bucket}});
}

var app = express()
app.use(cors())
app.use(compress())
app.use(bodyParser.json())
app.use(express.static('public'))
app.use('/widgets', express.static('widgets'))

app.get('/preview.js', function(req, res) {
  try {
    var props = JSON.parse(req.query.props)
    buildWidget(props, true)
    .then(function(code){
      res.send(code)
    })
    .catch(function(err){ res.status(500).send(err.stack) })
  } catch (err) {
    res.status(400).send('Bad request')
  }
})

app.post('/create', function(req, res) {
  axios.post('/api/form', req.body)
    .then(function(response) {
      buildWidget(response.data, false).then(function(code) {
        var key = response.data.id + '.js'
        if (isS3) {
          var params = {Bucket: config.s3.bucket, Key: key, Body: code}
          s3bucket.upload(params, function(err, data) {
            if(err) {
              console.log(err)
              return res.status(500).send('Error while uploading to s3')
            }

            res.send(response.data)
          })
        } else {
          fs.writeFile(path.join(__dirname, 'widgets', key), code, function(err) {
            if (err) {
              return res.status(500).send('Error while saving file')
            }

            res.json(response.data)
          })
        }
      })
      .catch(function(err){ res.status(500).send(err.stack) })
    })
    .catch(function(err){ res.status(400).send(err.data.message) })
})

app.listen(4444)

function buildWidget(props, isPreview) {
  return new Promise(function(resolve, reject){
    rollup.rollup({
      entry: 'main.js',
      plugins: [
        postcss(),
        babel(Object.assign({exclude: 'node_modules/**', babelrc: false}, babelConf)),
        nodeResolve({jsnext: true, main: true}),
        !isPreview && uglify({mangle: true})
      ],
    }).then(function(bundle){
      var result = bundle.generate({
        intro: 'var props = ' + JSON.stringify(props) + ', renderTarget = "' + (props.target || '#ask-form') + '";',
        format: 'iife'
      })
      resolve(result.code)
    }).catch(reject)
  })
}
