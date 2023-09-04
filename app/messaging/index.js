const { MessageReceiver } = require('ffc-messaging')
const sendBatchMessage = require('./send-batch-message')
const { processSubmitMessage } = require('./process-submit-message')
const config = require('../config/mq-config')
const paymentReceivers = []

const start = async () => {
  for (let i = 0; i < config.submitSubscription.numberOfReceivers; i++) {
    let paymentReceiver  // eslint-disable-line
    const submitAction = message => processSubmitMessage(message, paymentReceiver)
    paymentReceiver = new MessageReceiver(config.submitSubscription, submitAction)
    paymentReceivers.push(paymentReceiver)
    await paymentReceiver.subscribe()
    console.info(`Receiver ${i + 1} ready to receive payment requests`)
  }
}

const stop = async () => {
  for (const paymentReceiver of paymentReceivers) {
    await paymentReceiver.closeConnection()
  }
}

const sendAcknowledgementMessages = async (payload) => {
  await sendBatchMessage(payload, 'uk.gov.defra.ffc.pay.acknowledgement', config.acknowledgementTopic)
}

const sendReturnMessages = async (payload) => {
  await sendBatchMessage(payload, 'uk.gov.defra.ffc.pay.return', config.returnTopic)
}

module.exports = {
  start,
  stop,
  sendAcknowledgementMessages,
  sendReturnMessages
}
