const { parseGenesisReturnFile } = require('../../app/processing/parse-genesis-return-file')
const { parseGlosReturnFile } = require('../../app/processing/parse-glos-return-file')
const { parseImpsReturnFile } = require('../../app/processing/parse-imps-return-file')
const { parseDefaultReturnFile } = require('../../app/processing/parse-default-return-file')

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
