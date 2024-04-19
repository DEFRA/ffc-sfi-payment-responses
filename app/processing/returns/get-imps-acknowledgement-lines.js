const db = require('../../../app/data')

const getImpsAcknowledgementLines = async (acknowledgements, transaction) => {
  const acknowledgementLines = []
  const batchNumbers = []
  for (const acknowledgement of acknowledgements) {
    const batchNumber = await db.impsBatchNumber.findOne({ where: { invoiceNumber: acknowledgement.invoiceNumber, frn: acknowledgement.frn }, attributes: ['batchNumber', 'trader'], transaction })
    if (batchNumber) {
      acknowledgementLines.push(`H,${batchNumber.trader},${batchNumber.batchNumber},${acknowledgement.invoiceNumber},${acknowledgement.success ? 'I' : 'R'},,,,,,`)
      batchNumbers.push(batchNumber.batchNumber)
    }
  }
  return { acknowledgementLines, batchNumbers }
}

module.exports = {
  getImpsAcknowledgementLines
}
