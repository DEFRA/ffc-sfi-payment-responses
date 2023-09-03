const { isGenesisReturnFile } = require('./is-genesis-return-file')
const { isGlosReturnFile } = require('./is-glos-return-file')
const { isImpsReturnFile } = require('./is-imps-return-file')
const { createGenesisResponseFile } = require('./create-genesis-response-file')
const { createGlosResponseFile } = require('./create-glos-response-file')
const { createImpsResponseFile } = require('./create-imps-response-file')

const createResponseFile = async (content, filename, transaction) => {
  if (isGenesisReturnFile(filename)) {
    await createGenesisResponseFile(content, filename, transaction)
  }
  if (isGlosReturnFile(filename)) {
    await createGlosResponseFile(content, filename, transaction)
  }
  if (isImpsReturnFile(filename)) {
    await createImpsResponseFile(content, filename, transaction)
  }
}

module.exports = {
  createResponseFile
}
