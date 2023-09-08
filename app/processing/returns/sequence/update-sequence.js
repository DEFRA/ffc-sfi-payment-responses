const db = require('../../../data')

const updateSequence = async (sequence, transaction) => {
  await db.sequence.update({
    nextReturn: sequence.nextReturn
  }, {
    where: { schemeId: sequence.schemeId },
    transaction
  })
}

module.exports = {
  updateSequence
}
