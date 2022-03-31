const raiseEvent = require('./raise-event')

const sendProcessReturnEvent = async () => {
  const event = {
    id: '',
    name: 'payment-response-processing-return-event',
    type: 'info',
    message: 'processing return message',
    data: { }
  }
  await raiseEvent(event)
}

module.exports = sendProcessReturnEvent
