const sendBatchMessage = require('./send-batch-message')
const config = require('../config/mq-config')

const sendAcknowledgementMessages = async (payload) => {
  await sendBatchMessage(payload, 'uk.gov.pay.acknowledgement', config.acknowledgementTopic)
}

const sendReturnMessages = async (payload) => {
  await sendBatchMessage(payload, 'uk.gov.pay.return', config.returnTopic)
}

module.exports = {
  sendAcknowledgementMessages,
  sendReturnMessages
}
