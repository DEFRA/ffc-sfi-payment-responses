const db = require('../data')
const MAX_BATCH_SEQUENCE = 9999

const getAndIncrementSequence = async (schemeId, transaction) => {
  const sequence = await getSequence(schemeId, transaction)
  const nextSequence = sequence.nextReturn
  sequence.nextReturn = incrementSequence(sequence.nextReturn)
  await updateSequence(sequence, transaction)
  return nextSequence
}

const getSequence = async (schemeId, transaction) => {
  return db.sequence.findByPk(schemeId, {
    transaction,
    lock: true
  })
}

const incrementSequence = (currentSequence) => {
  // if sequence is already at maximum, then restart from 1
  return currentSequence < MAX_BATCH_SEQUENCE ? currentSequence + 1 : 1
}

const updateSequence = async (sequence, transaction) => {
  await db.sequence.update({
    nextReturn: sequence.nextReturn
  }, {
    where: { schemeId: sequence.schemeId },
    transaction
  })
}

module.exports = {
  getAndIncrementSequence
}
