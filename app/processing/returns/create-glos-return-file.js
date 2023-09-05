const moment = require('moment')
const { FC } = require('../../constants/schemes')
const { getAndIncrementSequence } = require('./sequence/get-and-increment-sequence')
const { publishReturnFile } = require('./publish-return-file')

const createGlosReturnFile = async (content, filename, transaction) => {
  const { sequenceString } = await getAndIncrementSequence(FC, transaction)
  const currentDate = moment()

  const returnFilename = `FCAP_${sequenceString}_RPA_${currentDate.format('YYMMDDHHmmss')}.dat`
  const controlFilename = returnFilename.replace('.dat', '.ctl')
  content[0] = sequenceString
  const returnFileContent = content.join('\r\n')

  await publishReturnFile(returnFilename, returnFileContent, controlFilename)
}

module.exports = {
  createGlosReturnFile
}
