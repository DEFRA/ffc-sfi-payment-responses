const util = require('util')

const processSubmitMessage = async (message, receiver) => {
  try {
    const paymentRequest = message.body
    console.log(`Submitted payment request received: ${util.inspect(paymentRequest)}`)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process payment request:', err)
  }
}

module.exports = {
  processSubmitMessage
}
