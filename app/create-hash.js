const crypto = require('crypto')

const createHash = (values) => {
  const hasher = crypto.createHmac('md5', values)
  return hasher.digest('hex')
}

module.exports = {
  createHash
}
