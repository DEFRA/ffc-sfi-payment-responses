const parseGenesisReturnFile = require('../../app/processing/parse-genesis-return-file')
const parseGlosReturnFile = require('../../app/processing/parse-glos-return-file')
const parseImpsReturnFile = require('../../app/processing/parse-imps-return-file')
const parseDefaultReturnFile = require('../../app/processing/parse-default-return-file')

const parseReturnFile = (content, filename) => {
  const csv = content.trim().split(/\r?\n/)
  if (filename.includes('GENESISPayConf')) {
    return parseGenesisReturnFile(csv, filename)
  }
  if (filename.includes('FCAP')) {
    return parseGlosReturnFile(csv, filename)
  }
  if (filename.includes('RET_IMPS')) {
    return parseImpsReturnFile(csv, filename)
  } else {
    return parseDefaultReturnFile(csv, filename)
  }
}

module.exports = parseReturnFile
