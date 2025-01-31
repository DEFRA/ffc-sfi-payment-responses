const db = require('../../../../app/data')

const getImpsPendingAcknowledgements = async (sequence, transaction) => {
  const acknowledgements = await db.impsAcknowledgement.findAll({
    where: {
      exported: null
    },
    transaction
  })
  return acknowledgements.filter(ack => parseInt(ack.batchNumber, 10) <= sequence)
}

module.exports = {
  getImpsPendingAcknowledgements
}
