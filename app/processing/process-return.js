const blobStorage = require('../storage')
const parseAcknowledgementFile = require('./parse-acknowledgement-file')

const processReturn = async (filename) => {
  console.info(`Processing ${filename}`)
  const buffer = await blobStorage.downloadPaymentFile(filename)
  const parseSuccess = await parseAcknowledgementFile(buffer)

  if (parseSuccess) {
    await blobStorage.archivePaymentFile(filename, filename)
  } else {
    console.log(`Quarantining ${filename}, failed to parse file`)
    await blobStorage.quarantinePaymentFile(filename, filename)
  }
}

module.exports = processReturn
