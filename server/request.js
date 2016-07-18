
var axios = require('axios')
var config = require('../config.json')

// Configure axios
axios.defaults.baseURL = config.pillarHost
axios.defaults.headers.common['Authorization'] = config.basicAuthorization

module.exports = axios
