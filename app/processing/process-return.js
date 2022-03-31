const { sendReturnMessages } = require('../messaging')
const blobStorage = require('../storage')
const parseReturnFile = require('./parse-return-file')
const util = require('util')
const { sendProcessReturnEvent } = require('../event')

const processReturn = async (filename) => {
  console.info(`Processing ${filename}`)
  const content = await blobStorage.downloadFile(filename)
  try {
    const messages = await parseReturnFile(content)
    if (messages.length) {
      await sendReturnMessages(messages)
      console.log('Returns published:', util.inspect(messages, false, null, true))
    }
    await blobStorage.archiveFile(filename, filename)
    await sendProcessReturnEvent()
  } catch (err) {
    console.error(`Quarantining ${filename}, failed to parse file`, err)
    await blobStorage.quarantineFile(filename, filename)
  }
}

module.exports = processReturn
