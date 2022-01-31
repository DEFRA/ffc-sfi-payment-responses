const { sendAcknowledgementMessages } = require('../messaging')
const blobStorage = require('../storage')
const parseAcknowledgementFile = require('./parse-acknowledgement-file')
const util = require('util')

const processAcknowledgement = async (filename) => {
  console.info(`Processing ${filename}`)
  const content = await blobStorage.downloadFile(filename)
  try {
    const messages = await parseAcknowledgementFile(content)
    if (messages.length) {
      await sendAcknowledgementMessages(messages)
      console.log('Acknowledgements published:', util.inspect(messages, false, null, true))
    }
    await blobStorage.archiveFile(filename, filename)
  } catch (err) {
    console.error(`Quarantining ${filename}, failed to parse file`, err)
    await blobStorage.quarantineFile(filename, filename)
  }
}

module.exports = processAcknowledgement
