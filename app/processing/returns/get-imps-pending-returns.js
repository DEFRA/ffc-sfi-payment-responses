const db = require('../../../app/data')

const getImpsPendingReturns = async (batchNumbers, transaction) => {
  const where = { exported: null }
  if (batchNumbers.length) {
    where.batchNumber = { [db.Sequelize.Op.not.in]: batchNumbers }
  }
  return db.impsReturn.findAll({
    where,
    transaction,
    lock: true,
    skipLocked: true
  })
}

module.exports = {
  getImpsPendingReturns
}
