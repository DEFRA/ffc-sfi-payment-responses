const getImpsBatchNumber = (batch) => {
  return Number(batch.substring(batch.lastIndexOf('_') + 1, batch.lastIndexOf('.')))
}

module.exports = {
  getImpsBatchNumber
}
