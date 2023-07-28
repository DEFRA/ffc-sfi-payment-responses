const util = require('util')
const blobStorage = require('../storage')
const { sendReturnMessages } = require('../messaging')
const parseReturnFile = require('./parse-return-file')
const quarantineFile = require('./quarantine-file')

const processReturn = async (filename) => {
  console.info(`Processing ${filename}`)
  const content = await blobStorage.downloadFile(filename)
  let messages
  try {
    messages = await parseReturnFile(content, filename)
  } catch (err) {
    await quarantineFile(filename, err)
  }
  if (messages?.length) {
    await sendReturnMessages(messages)
    console.log('Returns published:', util.inspect(messages, false, null, true))
    await blobStorage.archiveFile(filename, filename)
  }
}

module.exports = processReturn
