const getImpsTotalValue = (pendingReturns) => {
  return pendingReturns.reduce((total, pendingReturn) => total + pendingReturn.valueGBP, 0)
}

module.exports = {
  getImpsTotalValue
}
