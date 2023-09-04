const db = require('../data')

const getExistingImpsSubmission = async (invoiceNumber, frn, batch, transaction) => {
  return db.imps.findOne({
    transaction,
    lock: true,
    where: {
      invoiceNumber,
      frn,
      batch
    }
  })
}

module.exports = {
  getExistingImpsSubmission
}
