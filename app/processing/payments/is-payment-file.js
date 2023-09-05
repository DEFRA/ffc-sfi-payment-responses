const isPaymentFile = (filename) => {
  return /^FFC.*(?=_AP_|_AR_).*csv$/.test(filename)
}

module.exports = {
  isPaymentFile
}
