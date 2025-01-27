const db = require('../../../data')

const allImpsAcknowledgementsReceived = async (acknowledgements, sequence, transaction) => {
  const batchNumber = sequence.toString()
  const sequenceAcknowledgements = acknowledgements.filter(ack => ack.batchNumber === batchNumber)
  const invoicesForSequence = await db.impsBatchNumber.findAll({ where: { batchNumber }, transaction })
  return sequenceAcknowledgements.length >= invoicesForSequence.length ?? false
}

module.exports = {
  allImpsAcknowledgementsReceived
}
