const { v4: uuidv4 } = require('uuid')
const raiseEvent = require('./raise-event')
const config = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')

const sendResponsesQuarantineEvent = async (filename, error) => {
  if (config.useV1Events) {
    await sendV1ResponsesQuarantineEvent(filename)
  }
  if (config.useV2Events) {
    await sendV2ResponsesQuarantineEvent(filename, error)
  }
}

const sendV1ResponsesQuarantineEvent = async (filename) => {
  const event = {
    id: uuidv4(),
    name: 'responses-processing-quarantine-error',
    type: 'error',
    message: `Quarantined ${filename}`,
    data: {
      filename
    }
  }
  await raiseEvent(event, 'error')
}

const sendV2ResponsesQuarantineEvent = async (filename, error) => {
  const event = {
    source: 'ffc-pay-responses',
    type: 'uk.gov.defra.ffc.pay.warning.response.rejected',
    subject: filename,
    data: {
      message: error.message,
      filename
    }
  }
  const eventPublisher = new EventPublisher(config.eventsTopic)
  await eventPublisher.publishEvent(event)
}

module.exports = sendResponsesQuarantineEvent
