const sendBatchMessage = require('./send-batch-message')
const config = require('../config/mq-config')

const sendAcknowledgementMessages = async (payload) => {
  await sendBatchMessage(payload, 'uk.gov.sfi.payment.send', config.acknowledgementTopic)
}

const sendReturnMessages = async (payload) => {
  await sendBatchMessage(payload, 'uk.gov.sfi.payment.send', config.acknowledgementTopic)
}

module.exports = {
  sendAcknowledgementMessages,
  sendReturnMessages
}
