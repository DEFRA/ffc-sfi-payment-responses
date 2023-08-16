const crypto = require('crypto')

const createHash = (value) => {
  const hasher = crypto.createHmac('md5', value)
  return hasher.digest('hex')
}

module.exports = {
  createHash
}
