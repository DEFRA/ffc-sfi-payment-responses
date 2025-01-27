const moment = require('moment')
const db = require('../../../../app/data')
const { convertToPounds } = require('../../../../app/currency-convert')

const getImpsPendingReturnLines = async (pendingReturns, acknowledgedBatchNumbers, transaction) => {
  const pendingReturnLines = []
  let totalValue = 0
  for (const pendingReturn of pendingReturns) {
    const batchNumber = await db.impsBatchNumber.findOne({ where: { invoiceNumber: pendingReturn.invoiceNumber, trader: pendingReturn.trader }, attributes: ['batchNumber'], transaction })
    if (batchNumber && !acknowledgedBatchNumbers.includes(batchNumber.batchNumber)) {
      pendingReturnLines.push(`H,${batchNumber.batchNumber},04,${pendingReturn.trader},${pendingReturn.invoiceNumber},${pendingReturn.status},${pendingReturn.paymentReference},${convertToPounds(pendingReturn.valueGBP)},${pendingReturn.paymentType},${pendingReturn.dateSettled},${pendingReturn.valueEUR},`)
      totalValue += pendingReturn.valueGBP
      await pendingReturn.update({ exported: moment() }, { transaction })
    }
  }
  return {
    pendingReturnLines,
    totalValue
  }
}

module.exports = {
  getImpsPendingReturnLines
}
