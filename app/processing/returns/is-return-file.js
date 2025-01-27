const { isGenesisReturnFile } = require('./is-genesis-return-file')
const { isGlosReturnFile } = require('./is-glos-return-file')
const { isImpsReturnFile } = require('./imps/is-imps-return-file')

const isReturnFile = (filename) => {
  return /^.*Return File.*\.csv$/.test(filename) ||
  isGenesisReturnFile(filename) ||
  isGlosReturnFile(filename) ||
  isImpsReturnFile(filename)
}

module.exports = {
  isReturnFile
}
