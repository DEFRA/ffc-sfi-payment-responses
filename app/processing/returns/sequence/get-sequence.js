const db = require('../../../data')

const getSequence = async (schemeId, transaction) => {
  return db.sequence.findByPk(schemeId, {
    transaction,
    lock: true
  })
}

module.exports = {
  getSequence
}
