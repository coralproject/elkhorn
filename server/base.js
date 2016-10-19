var config = require('../config.json')

var isS3 = config.s3 && config.s3.bucket

// set base url
function getS3BaseURL () {
  return (config.s3.baseURL || 'https://s3.amazonaws.com/') + config.s3.bucket + '/'
}

function getLocalBaseURL() {
  if (config.published_base_url && config.published_base_url.length > 0) {
    return config.published_base_url;
  }

  return config.host + (config.port === 80 ? '' : ':' + config.port) + '/widgets/'
}

var base = isS3 ? getS3BaseURL() : getLocalBaseURL()

module.exports = base
