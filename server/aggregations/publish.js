var log = require('../logger')
var request = require('../request')
var upload = require('../uploader')


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

		      res.status(200).send(aggData)
		      
		    })
		    .catch(function (response) {
		      log('Ask -> /v1/form/' + formId + '/aggregate/all/submission: Error')
		      res.status(500).send(response)
		    })

	      
	    })
	    .catch(function (response) {
	      log('Ask -> /v1/form/' + formId + '/aggregation: Error')
	      res.status(500).send(response)
	    })
//      res.status(200).send(response)
    })
    .catch(function (response) {
      log('Ask -> /v1/form/' + formId + '/digest: Error')
      res.status(500).send(response)
    })


}

let loadDigest = function (formId) {

}

