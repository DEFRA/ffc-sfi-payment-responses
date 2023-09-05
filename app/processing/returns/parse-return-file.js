const { parseGenesisReturnFile } = require('./parse-genesis-return-file')
const { parseGlosReturnFile } = require('./parse-glos-return-file')
const { parseImpsReturnFile } = require('./parse-imps-return-file')
const { parseDefaultReturnFile } = require('./parse-default-return-file')

const parseReturnFile = (content, filename) => {
  if (filename.includes('GENESISPayConf')) {
    return parseGenesisReturnFile(content, filename)
  }
  if (filename.includes('FCAP')) {
    return parseGlosReturnFile(content, filename)
  }
  if (filename.includes('RET_IMPS')) {
    return parseImpsReturnFile(content, filename)
  }
  return parseDefaultReturnFile(content, filename)
}

module.exports = {
  parseReturnFile
}
