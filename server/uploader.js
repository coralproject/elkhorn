
var fs = require('fs')
var path = require('path')
var AWS = require('aws-sdk')
var log = require('./logger')
var config = require('../config.json')
var base = require('./base')
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

// expose the uploader
module.exports = function (fileName, code, template) {
  return new Promise(function (resolve, reject) {
    if (isS3) {
      return s3Upload(fileName, code, resolve, reject, template)
    } else {
      return fileUpload(fileName, code, resolve, reject, template)
    }
  })
}

function s3Upload (fileName, code, resolve, reject, template) {
  var jsKey = fileName + '.js'
  var jsParams = {Bucket: config.s3.bucket, Key: jsKey, Body: code, ContentType: 'text/html'}
  var iframeContent = pug.renderFile(template, { code })
  var iframeKey = fileName + '.html'
  var iframeParams = {Bucket: config.s3.bucket, Key: iframeKey, Body: iframeContent, ContentType: 'text/html'}

  var jsPromise = new Promise((resolve, reject) => {
    s3bucket.upload(jsParams, function (err, data) {
      if (err) {
        log('Error writing js bundle to s3')
        log(err)
        return reject(new Error('Error writing js bundle to s3'))
      }
      return resolve()
    })
  })

  var htmlPromise = new Promise((resolve, reject) => {
    s3bucket.upload(iframeParams, function (err, data) {
      if (err) {
        log('Error writing html file to s3')
        log(err)
        return reject(new Error('Error writing html file to s3'))
      }
      return resolve()
    })
  })

  return Promise.all([jsPromise, htmlPromise]).then(value => {
    return resolve({ bundle: `${base}${jsKey}`, iframe: `${base}${iframeKey}` })
  }, reason => {
    log('Error while uploading files to S3')
    log(reason)
    return reject(new Error('Error while uploading files'))
  })
}

function fileUpload (fileName, code, resolve, reject, template) {
  var jsFile = fileName + '.js'
  var iframeContent = pug.renderFile(template, { code })
  var iframeFile = fileName + '.html'

  var jsPromise = new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, 'widgets', jsFile), code, function (err) {
      if (err) {
        log('Error writing JS bundle to local file: ' + path.join(__dirname, 'widgets', jsFile))
        log(err)
        return reject(new Error('Error while saving JS bundle to local filesystem'))
      }
      return resolve()
    })
  })

  var htmlPromise = new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, 'widgets', iframeFile), iframeContent, function (err) {
      if (err) {
        log('Error writing iframe template to local file: ' + path.join(__dirname, 'widgets', iframeFile))
        log(err)
        return reject(new Error('Error while saving iframe template to local filesystem'))
      }
      return resolve()
    })
  })

  return Promise.all([jsPromise, htmlPromise]).then(value => {
    return resolve({ bundle: `${base}${jsFile}`, iframe: `${base}${iframeFile}` })
  }, reason => {
    log('Error while saving local files')
    log(reason)
    return reject(new Error('Error while uploading files'))
  })
}
