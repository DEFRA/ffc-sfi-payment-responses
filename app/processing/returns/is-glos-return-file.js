const isGlosReturnFile = (filename) => {
  return /^.*FCAP.*RPA.*\.dat$/.test(filename)
}

module.exports = {
  isGlosReturnFile
}
