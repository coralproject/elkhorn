var log = require('../logger')
var request = require('../request')


// File publication requirements
var fs = require('fs')
var path = require('path')
var AWS = require('aws-sdk')
var config = require('../../config.json')




const writeJSON = function (fileName, content) {

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

    var s3config = {
      Bucket: config.s3.bucket, 
      Key: fileName + ".json", 
      Body: JSON.stringify(content), 
      ContentType: 'application/json'
    }

    s3bucket.upload(s3config, function (err, data) {
      if (err) {
        log('Error writing js bundle to s3')
        log(err)
        return reject(new Error('Error writing js bundle to s3'))
      }

    })

  } else {

    var pathFileName = path.join(__dirname, '../widgets', fileName, ".json")


    fs.writeFile(pathFileName, JSON.stringify(content), function (err) {
      console.log("in write", err)
      if (err) {
        log('Error writing JSON file to local file: ' + path.join(__dirname, 'widgets', fileName))
        log(err)
        return new Error('Error while saving JSON file to local filesystem')
      }
    })
 

  }


}





module.exports = function (req, res) {
  log('Route /publish/aggregations/form/' + req.params.id)

  let formId = req.params.id,
      aggData = {}


  request(req)
    .get({
      uri: '/v1/form/' + formId + '/digest'
    })
    .then(function (response) {
      log('Ask -> /v1/form/' + formId + '/digest: Success')

      if (! Object.keys(response.questions).length) {
        res.status(200).send({"success": "Form loaded. No data to publish."})
      }

      aggData.questions = response.questions

    request(req)
      .get({
        uri: '/v1/form/' + formId + '/aggregate'
      })
      .then(function (response) {
        log('Ask -> /v1/form/' + formId + '/aggregation: Success')
        aggData.aggregations = response.aggregations


      request(req)
        .get({
          uri: '/v1/form/' + formId + '/aggregate/all/submission?orderby=dsc&limit=10'
        })
        .then(function (response) {
          log('Ask -> /v1/form/' + formId + '/aggregate/all/submission: Success')
          aggData.submissions = response

          writeJSON("form-"+formId+"-aggregation-digest", aggData)

          res.status(200).send(aggData)
          
        })
        .catch(function (response) {
          console.log("Catch: ", response)
          log('Ask -> /v1/form/' + formId + '/aggregate/all/submission: Error')
          res.status(500).send(response)
        })

        
      })
      .catch(function (response) {
        log('Ask -> /v1/form/' + formId + '/aggregation: Error')
        res.status(500).send(response)
      })

    })
    .catch(function (response) {
      log('Ask -> /v1/form/' + formId + '/digest: Error')
      res.status(500).send(response)
    })


}

let loadDigest = function (formId) {

}

