const isImpsAcknowledgementFile = (filename) => {
  return /^.*IMPS.*Ack\.xml$/.test(filename)
}

module.exports = {
  isImpsAcknowledgementFile
}
