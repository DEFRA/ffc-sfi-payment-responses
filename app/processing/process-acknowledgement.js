const { sendAcknowledgementMessages } = require('../messaging')
const blobStorage = require('../storage')
const parseAcknowledgementFile = require('./parse-acknowledgement-file')
const quarantineFile = require('./quarantine-file')
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
    await quarantineFile(filename)
  }
}

module.exports = processAcknowledgement
