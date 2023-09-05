const isAcknowledgementFile = (filename) => {
  return /^.*Ack\.xml$/.test(filename)
}

module.exports = {
  isAcknowledgementFile
}
