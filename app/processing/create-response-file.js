const { isGenesisReturnFile } = require('./returns/is-genesis-return-file')
const { isGlosReturnFile } = require('./returns/is-glos-return-file')
const { createGenesisResponseFile } = require('./create-genesis-response-file')
const { createGlosResponseFile } = require('./create-glos-response-file')

const createResponseFile = async (content, filename, transaction) => {
  if (isGenesisReturnFile(filename)) {
    await createGenesisResponseFile(content, filename, transaction)
  }
  if (isGlosReturnFile(filename)) {
    await createGlosResponseFile(content, filename, transaction)
  }
}

module.exports = {
  createResponseFile
}
