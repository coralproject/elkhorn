
var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var nodeResolve = require('rollup-plugin-node-resolve');
//var uglify = require('rollup-plugin-uglify');
var postcss = require('rollup-plugin-postcss');
var replace = require('rollup-plugin-replace');
var babelConf = require('./babel.json');
var log = require('./logger');

module.exports = function buildWidget(props, isPreview) {
  log("Route /buildWidget: isPreview:" + isPreview);
  log(JSON.stringify(props));
  return new Promise(function(resolve, reject){
		log("Starting rollup");
    rollup.rollup({
      entry: 'main.js',
      plugins: [
        replace({
          __WIDGETS__: [...new Set(props.steps[0].widgets.map(widget => widget.component))].join(', ')
        }),
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
