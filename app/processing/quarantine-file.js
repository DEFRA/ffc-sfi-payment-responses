const blobStorage = require('../storage')
const sendResponsesQuarantineEvent = require('../event/send-responses-quarantine-event')

const quarantineFile = async (filename) => {
  console.error(`Quarantining ${filename}, failed to parse file`)
  await sendResponsesQuarantineEvent(filename)
  return blobStorage.quarantineFile(filename, filename)
}

module.exports = quarantineFile
