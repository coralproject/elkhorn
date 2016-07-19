
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')
var nodeResolve = require('rollup-plugin-node-resolve')
// var uglify = require('rollup-plugin-uglify')
var postcss = require('rollup-plugin-postcss')
var replace = require('rollup-plugin-replace')
var commonjs = require('rollup-plugin-commonjs')
var babelConf = require('./babel.json')
var log = require('./logger')

var defaultBundle
createBundle().then(function (bundle) {
  defaultBundle = bundle
})

function getDefaultBundle () {
  return new Promise(function (resolve, reject) { resolve(defaultBundle) })
}

function createBundle (props) {
  return rollup.rollup({
    entry: 'main.js',
    plugins: [
      replace({
        __WIDGETS__: props ? `{ ${[...new Set(props.steps[0].widgets.map(widget => widget.component))].join(', ')} }` : 'types'
      }),
      postcss(),
      babel(Object.assign({exclude: 'node_modules/**', babelrc: false}, babelConf)),
      nodeResolve({jsnext: true, main: true}),
      commonjs({})/*,
      isPreview && uglify({mangle: true})*/
    ]
  })
}

module.exports = function buildWidget (props, isPreview) {
  log('Route /buildWidget: isPreview:' + isPreview)
  log(JSON.stringify(props))
  return new Promise(function (resolve, reject) {
    log('Starting rollup')
    var getBundle = isPreview ? getDefaultBundle : createBundle
    getBundle(props)
    .then(function (bundle) {
      log('Built bundle')
      log(bundle)
      var result = bundle.generate({
        intro: 'var props = ' + JSON.stringify(props) + ', renderTarget = "' + (props.target || '#ask-form') + '"',
        format: 'iife'
      })
      resolve(result.code)
    }).catch(reject)
  })
}
