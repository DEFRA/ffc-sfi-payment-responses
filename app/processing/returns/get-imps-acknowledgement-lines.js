const db = require('../../../app/data')

const getImpsAcknowledgementLines = async (acknowledgements, transaction) => {
  const lines = []
  for (const acknowledgement of acknowledgements) {
    const batchNumber = await db.impsBatchNumber.findOne({ where: { invoiceNumber: acknowledgement.invoiceNumber, frn: acknowledgement.frn }, attributes: ['batchNumber', 'trader'], transaction })
    if (batchNumber) {
      lines.push(`H,${batchNumber.trader},${batchNumber.batchNumber},${acknowledgement.invoiceNumber},${acknowledgement.success ? 'I' : 'R'},,,,,,`)
    }
  }
  return lines
}

module.exports = {
  getImpsAcknowledgementLines
}
