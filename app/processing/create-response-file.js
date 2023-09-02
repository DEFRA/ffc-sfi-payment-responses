const { isGenesisReturnFile } = require('./is-genesis-return-file')
const { isGlosReturnFile } = require('./is-glos-return-file')
const { isImpsReturnFile } = require('./is-imps-return-file')
const { createGenesisResponseFile } = require('./create-genesis-response-file')
const { createGlosResponseFile } = require('./create-glos-response-file')
const { createImpsResponseFile } = require('./create-imps-response-file')

const createResponseFile = async (content, filename) => {
  if (isGenesisReturnFile(filename)) {
    await createGenesisResponseFile(content, filename)
  }
  if (isGlosReturnFile(filename)) {
    await createGlosResponseFile(content, filename)
  }
  if (isImpsReturnFile(filename)) {
    await createImpsResponseFile(content, filename)
  }
}

module.exports = {
  createResponseFile
}
