const raiseEvent = require('./raise-event')

const sendProcessAckowledgementEvent = async () => {
  const event = {
    id: '',
    name: 'payment-response-processing-acknowledgement-event',
    type: 'info',
    message: 'process ackowledgement message',
    data: { }
  }
  await raiseEvent(event)
}

module.exports = sendProcessAckowledgementEvent
