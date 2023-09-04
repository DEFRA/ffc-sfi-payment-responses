const { sendAcknowledgementMessages } = require('../messaging')
const blobStorage = require('../storage')
const { createImpsResponseFile } = require('./create-imps-response-file')
const { isImpsReturnFile } = require('./is-imps-return-file')
const parseAcknowledgementFile = require('./parse-acknowledgement-file')
const quarantineFile = require('./quarantine-file')
const util = require('util')

const processAcknowledgement = async (filename, transaction) => {
  console.info(`Processing ${filename}`)
  const content = await blobStorage.downloadFile(filename)
  let messages
  try {
    messages = await parseAcknowledgementFile(content, filename)
  } catch (err) {
    await quarantineFile(filename, err)
  }
  if (messages?.length) {
    await sendAcknowledgementMessages(messages)
    if (isImpsReturnFile(filename)) {
      await createImpsResponseFile(content, filename, transaction)
    }
    console.log('Acknowledgements published:', util.inspect(messages, false, null, true))
    await blobStorage.archiveFile(filename, filename)
  }
}

module.exports = processAcknowledgement
