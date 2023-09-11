const storage = require('../storage')
const { sendResponsesQuarantineEvent } = require('../event/send-responses-quarantine-event')

const quarantineFile = async (filename, error) => {
  console.error(`Quarantining ${filename}, failed to parse file`)
  await sendResponsesQuarantineEvent(filename, error)
  return storage.quarantineFile(filename)
}

module.exports = {
  quarantineFile
}
