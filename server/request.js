const request = require('request-promise')
const config = require('../config.json')

module.exports = (req) => {
  let headers = {}

  let authorizationHeader = req.get('Authorization')
  if (authorizationHeader && authorizationHeader.length > 0) {
    headers['Authorization'] = authorizationHeader
  }

  return request.defaults({
    baseUrl: config.askHost,
    headers: headers,
    json: true
  })
}
