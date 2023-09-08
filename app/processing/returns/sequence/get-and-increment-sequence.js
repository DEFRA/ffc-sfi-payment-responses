const { getSequence } = require('./get-sequence')
const { incrementSequence } = require('./increment-sequence')
const { updateSequence } = require('./update-sequence')

const getAndIncrementSequence = async (schemeId, transaction) => {
  const sequence = await getSequence(schemeId, transaction)
  const nextSequence = sequence.nextReturn
  sequence.nextReturn = incrementSequence(sequence.nextReturn)
  await updateSequence(sequence, transaction)
  return {
    sequence: nextSequence,
    sequenceString: nextSequence.toString().padStart(4, '0')
  }
}

module.exports = {
  getAndIncrementSequence
}
