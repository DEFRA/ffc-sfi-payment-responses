const util = require('util')
const blobStorage = require('../storage')
const parseReturnFile = require('./parse-return-file')
const quarantineFile = require('./quarantine-file')
const { createResponseFile } = require('./create-response-file')
const { sendReturnMessages } = require('../messaging')

const processReturn = async (filename) => {
  console.info(`Processing ${filename}`)
  const content = await blobStorage.downloadFile(filename)
  let messages
  try {
    messages = parseReturnFile(content, filename)
  } catch (err) {
    await quarantineFile(filename, err)
  }
  if (messages?.length) {
    await createResponseFile(content, filename)
    await sendReturnMessages(messages)
    console.log('Returns published:', util.inspect(messages, false, null, true))
    await blobStorage.archiveFile(filename, filename)
  }
}

module.exports = processReturn
