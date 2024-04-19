const db = require('../../../app/data')
const { convertToPounds } = require('../../../app/currency-convert')

const getImpsPendingReturnLines = async (pendingReturns, acknowledgedBatchNumbers, transaction) => {
  const lines = []
  for (const pendingReturn of pendingReturns) {
    const batchNumber = await db.impsBatchNumber.findOne({ where: { invoiceNumber: pendingReturn.invoiceNumber, trader: pendingReturn.trader }, attributes: ['batchNumber'], transaction })
    if (batchNumber && !acknowledgedBatchNumbers.includes(batchNumber.batchNumber)) {
      lines.push(`H,${pendingReturn.trader},${batchNumber.batchNumber},${pendingReturn.invoiceNumber},${pendingReturn.status},${pendingReturn.paymentReference},${convertToPounds(pendingReturn.valueGBP)},${pendingReturn.paymentType},${pendingReturn.dateSettled},${pendingReturn.valueEUR},`)
      await pendingReturn.update({ exported: true }, { transaction })
    }
  }
  return lines
}

module.exports = {
  getImpsPendingReturnLines
}
