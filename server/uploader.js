
var fs = require('fs')
var path = require('path')
var AWS = require('aws-sdk')
var log = require('./logger')
var config = require('../config.json')

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
var base = isS3 ? 'https://s3.amazonaws.com/' + config.s3.bucket + '/' : 'http://localhost:4444/widgets/'

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
  var key = id + '.js'
  var params = {Bucket: config.s3.bucket, Key: key, Body: code}
  s3bucket.upload(params, function (err, data) {
    if (err) {
      log('Error writing to s3')
      log(err)
      return reject(new Error('Error writing to s3'))
    }

    return resolve(`${base}${key}`)
  })
}

function fileUpload (id, code, resolve, reject) {
  var key = id + '.js'
  fs.writeFile(path.join(__dirname, key), code, function (err) {
    if (err) {
      log('Error writing to local file: ' + path.join(__dirname, key))
      log(err)
      return reject(new Error('Error while saving file to local filesystem'))
    }

    resolve(`${base}${key}`)
  })
}
