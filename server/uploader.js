
var fs = require('fs')
var path = require('path')
var AWS = require('aws-sdk')
var log = require('./logger')
var config = require('../config.json')
var pug = require('pug')

var isS3 = config.s3 && config.s3.bucket
var s3bucket

// Config aws
if (isS3) {
  AWS.config.update({
    region: config.s3.region,
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey
  })
  s3bucket = new AWS.S3({params: {Bucket: config.s3.bucket}})
}

// set base url
var base = isS3 ? 'https://s3.amazonaws.com/' + config.s3.bucket + '/' : '/widgets/'

// expose the uploader
module.exports = function (id, code) {
  return new Promise(function (resolve, reject) {
    if (isS3) {
      return s3Upload(id, code, resolve, reject)
    } else {
      return fileUpload(id, code, resolve, reject)
    }
  })
}

function s3Upload (id, code, resolve, reject) {
  var jsKey = id + '.js'
  var jsParams = {Bucket: config.s3.bucket, Key: jsKey, Body: code, ContentType: 'text/html'}
  var iframeContent = pug.renderFile('./templates/iframe-form.pug', { code })
  var iframeKey = id + '.html'
  var iframeParams = {Bucket: config.s3.bucket, Key: iframeKey, Body: iframeContent, ContentType: 'text/html'}

  var jsPromise = new Promise((resolve, reject) => {
    s3bucket.upload(jsParams, function (err, data) {
      if (err) {
        log('Error writing js bundle to s3')
        log(err)
        return reject(new Error('Error writing js bundle to s3'))
      }
      return resolve(`${base}${jsKey}`)
    })
  })

  var htmlPromise = new Promise((resolve, reject) => {
    s3bucket.upload(iframeParams, function (err, data) {
      if (err) {
        log('Error writing html file to s3')
        log(err)
        return reject(new Error('Error writing html file to s3'))
      }
      return resolve(`${base}${iframeKey}`)
    })
  })

  return Promise.all([jsPromise, htmlPromise]).then(value => {
    return resolve(`${base}${jsKey}`)
  }, reason => {
    log('Error while uploading files to S3')
    log(reason)
    return reject(new Error('Error while uploading files'))
  })
}

function fileUpload (id, code, resolve, reject) {
  var jsFile = id + '.js'
  var iframeContent = pug.renderFile('./templates/iframe-form.pug', { code })
  var iframeFile = id + '.html'

  var jsPromise = new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, 'widgets', jsFile), code, function (err) {
      if (err) {
        log('Error writing JS bundle to local file: ' + path.join(__dirname, 'widgets', jsFile))
        log(err)
        return reject(new Error('Error while saving JS bundle to local filesystem'))
      }
      return resolve(`${base}${jsFile}`)
    })
  })

  var htmlPromise = new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, 'widgets', iframeFile), iframeContent, function (err) {
      if (err) {
        log('Error writing iframe template to local file: ' + path.join(__dirname, 'widgets', iframeFile))
        log(err)
        return reject(new Error('Error while saving iframe template to local filesystem'))
      }
      return resolve(`${base}${iframeFile}`)
    })
  })

  return Promise.all([jsPromise, htmlPromise]).then(value => {
    return resolve(`${base}${jsFile}`)
  }, reason => {
    log('Error while saving local files')
    log(reason)
    return reject(new Error('Error while uploading files'))
  })
}
