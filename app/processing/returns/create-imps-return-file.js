const { IMPS } = require('../../constants/schemes')
const { convertToPounds } = require('../../currency-convert')
const { getAndIncrementSequence } = require('./sequence/get-and-increment-sequence')
const { publishReturnFile } = require('./publish-return-file')
const { getImpsAcknowledgementLines } = require('./get-imps-acknowledgement-lines')
const { getImpsPendingReturns } = require('./get-imps-pending-returns')
const { getImpsPendingReturnLines } = require('./get-imps-pending-return-lines')

const createImpsReturnFile = async (acknowledgements, filename, transaction) => {
  const { sequenceString } = await getAndIncrementSequence(IMPS, transaction)

  const returnFilename = `RET_IMPS_AP_${sequenceString}.INT`
  const controlFilename = `CTL_${returnFilename}`

  const responseData = []

  const { acknowledgementLines, batchNumbers } = await getImpsAcknowledgementLines(acknowledgements, transaction, responseData)
  responseData.push(...acknowledgementLines)

  const pendingReturns = await getImpsPendingReturns(transaction)
  const { pendingReturnLines, totalValue } = await getImpsPendingReturnLines(pendingReturns, batchNumbers, transaction)
  responseData.push(...pendingReturnLines)

  responseData.unshift(`B,04,${sequenceString},${responseData.length},${convertToPounds(totalValue)},S`)

  const returnFileContent = responseData.join('\r\n')

  await publishReturnFile(returnFilename, returnFileContent, controlFilename, null)
}

module.exports = {
  createImpsReturnFile
}
