const sendBatchMessage = require('./send-batch-message')
const config = require('../config/mq-config')

const sendAcknowledgementMessages = async (payload) => {
  await sendBatchMessage(payload, 'uk.gov.sfi.payment.acknowledgement', config.acknowledgementTopic)
}

const sendReturnMessages = async (payload) => {
  await sendBatchMessage(payload, 'uk.gov.sfi.payment.return', config.returnTopic)
}

module.exports = {
  sendAcknowledgementMessages,
  sendReturnMessages
}
