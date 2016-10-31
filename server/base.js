var config = require('../config.json')

var isS3 = config.s3 && config.s3.bucket

// config.s3.baseURL is sourced from https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region

// set base url
function getS3BaseURL () {
  return `https://${config.s3.baseURL || 's3.amazonaws.com'}/${config.s3.bucket}/`
}

function getLocalBaseURL() {
  if (config.published_base_url && config.published_base_url.length > 0) {
    return config.published_base_url;
  }

  return config.host + (config.port === 80 ? '' : ':' + config.port) + '/widgets/'
}

var base = isS3 ? getS3BaseURL() : getLocalBaseURL()

module.exports = base
