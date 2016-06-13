
/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');
var compress = require('compression');
var AWS = require('aws-sdk');
var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var nodeResolve = require('rollup-plugin-node-resolve');
//var uglify = require('rollup-plugin-uglify')
var postcss = require('rollup-plugin-postcss');
var babelConf = require('./babel.json');
var axios = require('axios');
var config = require('../config.json');

/**
 * HTTP client configuration for basic auth and pillar host
 */

axios.defaults.baseURL = config.pillarHost;
axios.defaults.headers.common['Authorization'] = config.basicAuthorization;

/**
 * Set S3 configuration if present
 */

var isS3 = config.s3 && config.s3.bucket;
var base = 'http://localhost:4444/widgets/';
var s3bucket;

if (isS3) {
  AWS.config.update({
    region: config.s3.region,
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey
  });
  s3bucket = new AWS.S3({params: {Bucket: config.s3.bucket} });
  base = 'https://s3.amazonaws.com/' + config.s3.bucket + '/';
}

/**
 * Configure the web server
 */

var app = express();
app.use(cors());
app.use(compress());
app.use(bodyParser.json());
app.use('/widgets', express.static('widgets'));
app.set('view engine', 'pug');
app.set('views', './templates');

// Deliver the iframe mode
// TODO: Move this to s3 if applies
app.get('/iframe/:id', function(req, res) {
  res.render('iframe', { base: base, id: req.params.id });
});

// Load ask config from a props querystring property,
// build it using rollup and return the code for preview
app.get('/preview.js', function(req, res) {
  try {
    var props = JSON.parse(req.query.props);
    buildWidget(props, true)
    .then(function(code){
      res.send(code);
    })
    .catch(function(err){ res.status(500).send(err.stack) });
  } catch (err) {
    res.status(400).send('Bad request');
  }
})

// Create or update an ask into pillar, build using rollup overriding
// if exists and return the pillar response
app.post('/create', function(req, res) {
  axios.post('/api/form', req.body)
    .then(function(response) {
      buildWidget(req.body, false).then(function(code) {
        var key = response.data.id + '.js'

        // If we have a s3 configuration, upload to s3
        if (isS3) {
          var params = {Bucket: config.s3.bucket, Key: key, Body: code};
          s3bucket.upload(params, function(err, data) {
            if(err) {
              console.log(err);
              return res.status(500).send('Error while uploading to s3');
            }

            res.send(response.data);
          })

        // Otherwise save to file in disk
        } else {
          fs.writeFile(path.join(__dirname, 'widgets', key), code, function(err) {
            if (err) {
              return res.status(500).send('Error while saving file');
            }

            res.json(response.data);
          })
        }
      })
      .catch(function(err){ res.status(500).send(err.stack) });
    })
    .catch(function(err){ res.status(400).send(err.data.message) });
});

// Listen at port 4444
// TODO: make this configurable
app.listen(4444);

// Build a new ask using rollup and the given properties
function buildWidget(props, isPreview) {
  return new Promise(function(resolve, reject) {
    rollup.rollup({
      entry: 'main.js',
      plugins: [
        postcss(),
        babel(Object.assign({exclude: 'node_modules/**', babelrc: false}, babelConf)),
        nodeResolve({jsnext: true, main: true})/*,
        isPreview && uglify({mangle: true})*/
      ]
    }).then(function(bundle) {
      var result = bundle.generate({
        intro: 'var props = ' + JSON.stringify(props) + ', renderTarget = "' + (props.target || '#ask-form') + '";',
        format: 'iife'
      });
      resolve(result.code);
    }).catch(reject);
  });
}

// Catch uncaught errors preventing a server crash
// TODO: deal better with the errors
process.on('uncaughtException', function (error) {
  console.log(error);
});
proces
