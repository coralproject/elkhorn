var fs = require('fs')
var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
var compress = require('compression')
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')
var nodeResolve = require('rollup-plugin-node-resolve')
var uglify = require('rollup-plugin-uglify')
var postcss = require('rollup-plugin-postcss')

var app = express()
app.use(compress())
app.use(bodyParser.json())
app.use('/widgets', express.static('widgets'))

app.get('/preview.js', function(req, res) {
  try {
    var props = JSON.parse(req.query.props)
    buildWidget(props)
    .then(function(code){
      res.send(code)
    })
    .catch(function(err){ res.status(500).send(err.stack) })
  } catch (err) {
    res.status(400).send('Bad request')
  }
})

app.post('/create', function(req, res){
  buildWidget(req.body).then(function(code){
    fs.writeFile(path.join(__dirname, 'widgets', '1234.js'), code, function(err){
      res.send('ok')
    })
  })
  .catch(function(err){ res.status(500).send(err.stack) })
})

app.listen(4444)

function buildWidget(props) {
  return new Promise(function(resolve, reject){
    rollup.rollup({
      entry: 'main.js',
      plugins: [ 
        postcss(),
        babel(), 
        nodeResolve({jsnext: true, main: true}), 
        uglify({mangle: true})
      ],
    }).then(function(bundle){
      var result = bundle.generate({
        intro: 'var props = ' + JSON.stringify(props) + ';',
        format: 'iife'
      })
      resolve(result.code)
    }).catch(reject)
  })
}
