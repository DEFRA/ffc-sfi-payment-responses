function createMessage (body, type) {
  return {
    body,
    type,
    source: 'ffc-sfi-payment-responses'
  }
}

module.exports = createMessage
