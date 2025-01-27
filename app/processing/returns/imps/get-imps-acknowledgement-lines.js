const db = require('../../../data')

const getImpsAcknowledgementLines = async (acknowledgements, sequence, transaction) => {
  const acknowledgementLines = []
  const batchNumbers = []
  const sequenceAcknowledgements = acknowledgements.filter(ack => parseInt(ack.batchNumber, 10) <= sequence)
  for (const acknowledgement of sequenceAcknowledgements) {
    const batchNumber = await db.impsBatchNumber.findOne({ where: { invoiceNumber: acknowledgement.invoiceNumber, frn: acknowledgement.frn }, attributes: ['batchNumber', 'trader'], transaction })
    if (batchNumber) {
      acknowledgementLines.push(`H,${batchNumber.batchNumber},04,${batchNumber.trader},${acknowledgement.invoiceNumber},${acknowledgement.success},,,,,,`)
      batchNumbers.push(batchNumber.batchNumber)
    }
  }
  return { acknowledgementLines, batchNumbers }
}

module.exports = {
  getImpsAcknowledgementLines
}
