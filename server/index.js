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
//var uglify = require('rollup-plugin-uglify')
var postcss = require('rollup-plugin-postcss')
var babelConf = require('./babel.json')
var axios = require('axios')

// simple logging stub to house permanent logging integration
var log = function (message) {
  console.log(message);
  return message;
}

// Configure axios
var config = require('../config.json')
axios.defaults.baseURL = config.pillarHost
axios.defaults.headers.common['Authorization'] = config.basicAuthorization

log("Pillar host: " + config.pillarHost);

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

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

var app = express()
app.use(cors())
app.use(allowCrossDomain) // explicit header sets for cors
app.use(compress())
app.use(bodyParser.json())
app.use('/widgets', express.static('widgets'))
app.set('view engine', 'pug')
app.set('views', './templates')

var base = isS3 ? 'https://s3.amazonaws.com/' + config.s3.bucket + '/' : 'http://localhost:4444/widgets/';
app.get('/iframe/:id', function(req, res) {
  res.render('iframe', { base: base, id: req.params.id })
})

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
  log("Route /create: Forwarding form to pillar");
  axios.post('/api/form', req.body)
    .then(function(response) {
    	
      log("Response received from pillar:");
      log(response);
      
      buildWidget(req.body, false).then(function(code) {
        var key = response.data.id + '.js'
        if (isS3) {
          var params = {Bucket: config.s3.bucket, Key: key, Body: code}
          s3bucket.upload(params, function(err, data) {
            if(err) {
              log("Error writing to s3");
              log(err)
              return res.status(500).send('Error while uploading to s3')
            }

            res.send(response.data)
          })
        } else {
          fs.writeFile(path.join(__dirname, 'widgets', key), code, function(err) {
            if (err) {
              log("Error writing to local file: " + path.join(__dirname, 'widgets', key));
              log(err);
              return res.status(500).send('Error while saving file to local filesystem')
            }

            res.json(response.data)
          })
        }
      })
      .catch(function(err){ res.status(500).send(err.stack) })
    })
    .catch(function(err){ 
      log("Error saving form to Pillar");
      log(err.data.message);
      res.status(400).send(err.data.message) 
    })
})

app.listen(4444)

function buildWidget(props, isPreview) {
  log("Route /buildWidget: isPreview:" + isPreview);
  log(JSON.stringify(props));
  return new Promise(function(resolve, reject){

		log("Starting rollup");

    rollup.rollup({
      entry: 'main.js',
      plugins: [
        postcss(),
        babel(Object.assign({exclude: 'node_modules/**', babelrc: false}, babelConf)),
        nodeResolve({jsnext: true, main: true})/*,
        isPreview && uglify({mangle: true})*/
      ],
    }).then(function(bundle){
    	
      log("Built bundle");
      log(bundle)

      var result = bundle.generate({
        intro: 'var props = ' + JSON.stringify(props) + ', renderTarget = "' + (props.target || '#ask-form') + '";',
        format: 'iife'
      })
      resolve(result.code)
    }).catch(reject)
  })
}
