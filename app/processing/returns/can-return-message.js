const canReturnMessage = (filename) => {
  return /^(?!.*NO_RETURN_MESSAGE).*$/.test(filename)
}

module.exports = {
  canReturnMessage
}
