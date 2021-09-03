const isReturnFile = (filename) => {
  return /^.*Return File.*\.csv$/.test(filename)
}

module.exports = isReturnFile
