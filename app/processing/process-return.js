const { sendReturnMessages } = require('../messaging')
const blobStorage = require('../storage')
const parseReturnFile = require('./parse-return-file')

const processReturn = async (filename) => {
  console.info(`Processing ${filename}`)
  const buffer = await blobStorage.downloadPaymentFile(filename)
  try {
    const messages = await parseReturnFile(buffer)
    await sendReturnMessages(messages)
    await blobStorage.archivePaymentFile(filename, filename)
  } catch (err) {
    console.error(`Quarantining ${filename}, failed to parse file`, err)
    await blobStorage.quarantinePaymentFile(filename, filename)
  }
}

module.exports = processReturn
