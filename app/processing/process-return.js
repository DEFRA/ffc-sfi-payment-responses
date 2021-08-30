const { sendReturnMessages } = require('../messaging')
const blobStorage = require('../storage')
const parseReturnFile = require('./parse-return-file')

const processReturn = async (filename) => {
  console.info(`Processing ${filename}`)
  const buffer = await blobStorage.downloadFile(filename)
  try {
    const messages = await parseReturnFile(buffer)
    if (messages.length) {
      await sendReturnMessages(messages)
    }
    await blobStorage.archiveFile(filename, filename)
  } catch (err) {
    console.error(`Quarantining ${filename}, failed to parse file`, err)
    await blobStorage.quarantineFile(filename, filename)
  }
}

module.exports = processReturn
