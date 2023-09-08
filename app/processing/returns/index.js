const { isReturnFile } = require('./is-return-file')
const { processReturn } = require('./process-return')
const { createImpsReturnFile } = require('./create-imps-return-file')

module.exports = {
  isReturnFile,
  processReturn,
  createImpsReturnFile
}
