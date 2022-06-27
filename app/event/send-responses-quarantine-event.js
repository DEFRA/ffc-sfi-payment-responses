const { v4: uuidv4 } = require('uuid')
const raiseEvent = require('./raise-event')

const sendResponsesQuarantineEvent = async (filename) => {
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

module.exports = sendResponsesQuarantineEvent
