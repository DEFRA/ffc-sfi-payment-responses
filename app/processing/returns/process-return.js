const util = require('util')
const { downloadFile, archiveFile } = require('../../storage')
const { parseReturnFile } = require('../parse-return-file')
const { quarantineFile } = require('../quarantine-file')
const { createResponseFile } = require('../create-response-file')
const { sendReturnMessages } = require('../../messaging')
const { isImpsReturnFile } = require('./is-imps-return-file')
const { saveImpsReturns } = require('../save-imps-returns')

const processReturn = async (filename, transaction) => {
  console.info(`Processing ${filename}`)
  const data = await downloadFile(filename)
  const content = data.trim().split(/\r?\n/)
  let messages
  try {
    messages = parseReturnFile(content, filename)
  } catch (err) {
    await quarantineFile(filename, err)
  }
  if (messages?.length) {
    if (isImpsReturnFile(filename)) {
      await saveImpsReturns(content, transaction)
    }
    await sendReturnMessages(messages)
    await createResponseFile(content, filename, transaction)
    console.log('Returns published:', util.inspect(messages, false, null, true))
    await archiveFile(filename, filename)
  }
}

module.exports = processReturn
