const { sendAcknowledgementMessages } = require('../messaging')
const blobStorage = require('../storage')
const parseAcknowledgementFile = require('./parse-acknowledgement-file')

const processAcknowledgement = async (filename) => {
  console.info(`Processing ${filename}`)
  const buffer = await blobStorage.downloadFile(filename)
  try {
    const messages = await parseAcknowledgementFile(buffer)
    if (messages.length) {
      await sendAcknowledgementMessages(messages)
    }
    await blobStorage.archiveFile(filename, filename)
  } catch (err) {
    console.error(`Quarantining ${filename}, failed to parse file`, err)
    await blobStorage.quarantineFile(filename, filename)
  }
}

module.exports = processAcknowledgement
