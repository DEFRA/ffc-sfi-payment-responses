const db = require('../../../data')

const allImpsAcknowledgementsReceived = async (acknowledgements, sequence, transaction) => {
  const batchNumber = sequence.toString()
  const sequenceAcknowledgements = acknowledgements.filter(ack => ack.batchNumber === batchNumber)
  const invoicesForSequence = await db.impsBatchNumber.findAll({ where: { batchNumber }, transaction })
  if (sequenceAcknowledgements.length !== invoicesForSequence.length) {
    return false
  }
  return true
}

module.exports = {
  allImpsAcknowledgementsReceived
}
