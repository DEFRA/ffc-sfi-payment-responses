const { sendAcknowledgementMessages } = require('../messaging')
const blobStorage = require('../storage')
const parseAcknowledgementFile = require('./parse-acknowledgement-file')

const processAcknowledgement = async (filename) => {
  console.info(`Processing ${filename}`)
  const buffer = await blobStorage.downloadPaymentFile(filename)
  try {
    const messages = await parseAcknowledgementFile(buffer)
    await sendAcknowledgementMessages(messages)
    await blobStorage.archivePaymentFile(filename, filename)
  } catch (err) {
    console.error(`Quarantining ${filename}, failed to parse file`, err)
    await blobStorage.quarantinePaymentFile(filename, filename)
  }
}

module.exports = processAcknowledgement
