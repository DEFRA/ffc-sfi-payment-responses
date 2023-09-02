const isImpsReturnFile = (filename) => {
  return /^RET_IMPS.*\.INT$/.test(filename)
}

module.exports = {
  isImpsReturnFile
}
