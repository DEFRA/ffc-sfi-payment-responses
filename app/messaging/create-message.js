const { SOURCE } = require('../constants/source')

function createMessage (body, type) {
  return {
    body,
    type,
    source: SOURCE
  }
}

module.exports = createMessage
