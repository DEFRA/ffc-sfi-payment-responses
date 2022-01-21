function createMessage (body, type) {
  return {
    body,
    type,
    source: 'ffc-pay-responses'
  }
}

module.exports = createMessage
