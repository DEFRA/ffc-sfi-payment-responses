const { IMPS } = require('../../constants/schemes')
const { convertToPounds } = require('../../currency-convert')
const { getAndIncrementSequence } = require('./sequence/get-and-increment-sequence')
const { publishReturnFile } = require('./publish-return-file')
const { getImpsAcknowledgementLines } = require('./get-imps-acknowledgement-lines')
const { getImpsPendingReturns } = require('./get-imps-pending-returns')
const { getImpsPendingReturnLines } = require('./get-imps-pending-return-lines')
const { getImpsTotalValue } = require('./get-imps-total-value')

const createImpsReturnFile = async (acknowledgements, filename, transaction) => {
  const { sequenceString } = await getAndIncrementSequence(IMPS, transaction)

  const returnFilename = `RET_IMPS_AP_${sequenceString}.INT`
  const controlFilename = `CTL_${returnFilename}`

  const responseData = []

  const { acknowledgementLines, batchNumbers } = await getImpsAcknowledgementLines(acknowledgements, transaction, responseData)
  responseData.push(...acknowledgementLines)

  const pendingReturns = await getImpsPendingReturns(batchNumbers, transaction)
  const pendingReturnLines = await getImpsPendingReturnLines(pendingReturns, transaction)
  responseData.push(...pendingReturnLines)

  const totalValue = getImpsTotalValue(pendingReturns)
  responseData.unshift(`B,04,${sequenceString},${convertToPounds(totalValue)},${responseData.length},S,`)

  const returnFileContent = responseData.join('\r\n')

  await publishReturnFile(returnFilename, returnFileContent, controlFilename)
}

module.exports = {
  createImpsReturnFile
}
