const isGenesisReturnFile = (filename) => {
  return /^.*GENESISPayConf.*\.gni$/.test(filename)
}

module.exports = {
  isGenesisReturnFile
}
