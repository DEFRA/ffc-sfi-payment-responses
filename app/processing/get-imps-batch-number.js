const getImpsBatchNumber = (batch) => {
  return Number(batch.substr(12, 4))
}

module.exports = {
  getImpsBatchNumber
}
