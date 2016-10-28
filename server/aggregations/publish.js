// Aggregations/publish
//
// This module is a self contained module that publishes form
// aggregation data from the askd aggregation endpoints.
//
// It publishes two file types:
// 1. a digest (form digest, all aggregations, last 10 sumbissions approved)
// 2. a set of submissions broken down by group.

var log = require('../logger')
var request = require('../request')

// File publication requirements
var fs = require('fs')
var path = require('path')
var AWS = require('aws-sdk')
var config = require('../../config.json')


// writeJSON takes a filename and js object and publishes a .json file
// in accordance with elkhorn config.
const writeJSON = function (fileName, content) {

  // Support s3 or local filesystem depending on presence of bucket param.
  var isS3 = config.s3 && config.s3.bucket
  var s3bucket

  // If we are working with aws...
  if (isS3) {

    // Set AWS configuration from configuration.
    AWS.config.update({
      region: config.s3.region,
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: config.s3.secretAccessKey
    })
    
    // Init the AWS S3 for the bucket.
    s3bucket = new AWS.S3({params: {Bucket: config.s3.bucket}})

    // Gather the passed AWS configuration variables.
    var s3config = {
      Bucket: config.s3.bucket, 
      Key: fileName + ".json", 
      Body: JSON.stringify(content), 
      ContentType: 'application/json'
    }

    // Perform the upload.
    s3bucket.upload(s3config, function (err, data) {
      if (err) {
        log('Error writing js bundle to s3')
        log(err)
        return new Error('Error writing js bundle to s3')
      }

    })

  } 

  // If we are not writing to S3, write to the local filesystem.
  if (!isS3) {

    // All elkhorn files are written to the (root)/server/widgets folder.
    var pathFileName = path.join(__dirname, '../widgets', fileName + ".json")

    // Write the file.
    fs.writeFile(pathFileName, JSON.stringify(content), function (err) {

      if (err) {
        log('Error writing JSON file to local file: ' + path.join(__dirname, 'widgets', fileName))
        log(err)
        return new Error('Error while saving JSON file to local filesystem')
      }

    })
  }
}

// fetchAndWriteSubmissions pulls a set of submissions for a single form/group pair
// and writes them to dis.
var fetchAndWriteSubmissions = function (req, formId, groupId) {

  // Create the uri for the call.
  var uri = '/v1/form/' + formId + '/aggregate/' + groupId + '/submission?filterby=bookmarked&orderby=dsc&limit=250'

  // get the submissions for this group
  request(req)
    .get({
      uri: uri
    })
    .then(function (response) {
      log(uri + ': Success')
      
      writeJSON("form-"+formId+"-group-"+groupId+"-submissions", response)
      
    })
    .catch(function (response) {
      log(uri + ': Error')
      log("Catch: ", response)
    })

}

// ***************************************************
// Load Aggregations
//
// This section pulls data from the digest, aggregation and submission endpoints
// and builds an aggData digest for the main file. It also triggers
// fetchAndWriteSubmissions for each group.
//
// Note on style: this structure is basic and may benefit from being refactored
// using Promises or other methods of flow control.

module.exports = function (req, res) {
  log('Route /publish/aggregations/form/' + req.params.id)

  let formId = req.params.id,
      aggData = {}

  // Set a max timeout to buffer against stacking calls. By this point if no 500s
  // have been returned we can be confident of a success.
  setTimeout(function () {
    res.status(200).send({'Success': 'true'})
  }, 2000)

  // *************************  
  // Get the form digest
  request(req)
    .get({
      uri: '/v1/form/' + formId + '/digest'
    })
    .then(function (response) {
      log('Ask -> /v1/form/' + formId + '/digest: Success')

      // If digest returns an empty object it tells us that there is no aggregation
      // to be done on this form. Exit.
      if (! Object.keys(response.questions).length) {
        return;
      }

      // Set the contents into the questions key.
      aggData.questions = response.questions

      // *************************  
      // Get the form aggregations 
      request(req)
        .get({
          uri: '/v1/form/' + formId + '/aggregate'
        })
        .then(function (response) {
          log('Ask -> /v1/form/' + formId + '/aggregation: Success')
          aggData.aggregations = response.aggregations


          // *************************************************************************
          // Loop through the aggregations to get submissions for each Grouping answer

          var qId, oId
          // For each question...
          for (qId in aggData.questions) {

            // If this is a group_by question...
            if (aggData.questions[qId].group_by === true) {

              // Loop through each answer. 
              for (oId in aggData.questions[qId].options) {

                // These are the groups we want to query for.
                var groupId = aggData.questions[qId].options[oId].id

                // If this group aggregation does not exist, 
                // there are no submissions, so skip it.
                if (! aggData.aggregations[groupId]) {
                  continue;
                }

                var groupCount = aggData.aggregations[groupId].count

                fetchAndWriteSubmissions(req, formId, groupId)

              }

            }

          }



          // end loop for grouped submissions


      // *************************  
      // Get the form submissions 
      request(req)
        .get({
          uri: '/v1/form/' + formId + '/aggregate/all/submission?orderby=dsc&limit=30'
        })
        .then(function (response) {
          log('Ask -> /v1/form/' + formId + '/aggregate/all/submission: Success')
          
          // Append submissions to the aggData object.
          aggData.submissions = response

          // Write the aggData into the form digest.
          writeJSON("form-"+formId+"-aggregation-digest", aggData)
          
        })
        .catch(function (response) {
          console.log("Catch: ", response)
          log('Ask -> /v1/form/' + formId + '/aggregate/all/submission: Error')
        })
        
      })
      .catch(function (response) {
        log('Ask -> /v1/form/' + formId + '/aggregation: Error')
        console.log("Catch: ", response)
      })

    })
    .catch(function (response) {
      log('Ask -> /v1/form/' + formId + '/digest: Error')
      console.log("Catch: ", response)
    })

}


