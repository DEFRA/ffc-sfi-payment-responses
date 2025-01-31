const db = require('../../../data')

const setImpsAcknowledgementsExported = async (acknowledgements, transaction) => {
  const exportedIds = acknowledgements.map(ack => ack.impsAcknowledgementId)
  return db.impsAcknowledgement.update({
    exported: new Date()
  }, {
    where: { impsAcknowledgementId: exportedIds },
    transaction
  })
}

module.exports = {
  setImpsAcknowledgementsExported
}
