const MAX_BATCH_SEQUENCE = Number.MAX_SAFE_INTEGER

const incrementSequence = (currentSequence) => {
  // if sequence is already at maximum, then restart from 1
  return currentSequence < MAX_BATCH_SEQUENCE ? currentSequence + 1 : 1
}

module.exports = {
  incrementSequence
}
