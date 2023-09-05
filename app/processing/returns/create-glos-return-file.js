const moment = require('moment')
const { FC } = require('../../constants/schemes')
const { getAndIncrementSequence } = require('../get-and-increment-sequence')
const { getReturnBlobClient } = require('../../storage')

const createGlosReturnFile = async (content, filename, transaction) => {
  const sequence = await getAndIncrementSequence(FC, transaction)
  const sequenceString = sequence.toString().padStart(4, '0')
  const date = moment()
  const returnFilename = `FCAP_${sequenceString}_RPA_${date.format('YYMMDDHHmmss')}.dat`
  const controlFilename = returnFilename.replace('.dat', '.ctl')
  content[0] = sequenceString
  const responseContent = content.join('\r\n')

  const blobClient = await getReturnBlobClient(returnFilename)
  await blobClient.upload(responseContent, responseContent.length)
  console.info(`Published ${returnFilename}`)

  const controlBlobClient = await getReturnBlobClient(controlFilename)
  await controlBlobClient.upload('', 0)
  console.info(`Published ${controlFilename}`)
}

module.exports = {
  createGlosReturnFile
}
