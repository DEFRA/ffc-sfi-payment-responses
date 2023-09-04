const util = require('util')
const { IMPS } = require('../constants/schemes')
const { saveImpsSubmission } = require('../processing/save-imps-submission')

const processSubmitMessage = async (message, receiver) => {
  try {
    const paymentRequest = message.body
    if (paymentRequest.schemeId === IMPS) {
      console.log(`Submitted IMPS payment request received: ${util.inspect(paymentRequest)}`)
      await saveImpsSubmission(paymentRequest)
    }
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process payment request:', err)
  }
}

module.exports = {
  processSubmitMessage
}
