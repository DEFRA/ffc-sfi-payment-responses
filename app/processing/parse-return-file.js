const moment = require('moment')
const { convertToPence } = require('../currency-convert')
const parseGenesisReturnFile = require('../../app/processing/parse-genesis-return-file')
const parseGlosReturnFile = require('../../app/processing/parse-glos-return-file')
const parseImpsReturnFile = require('../../app/processing/parse-imps-return-file')

const parseReturnFile = async (content, filename) => {
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
    return csv.map(x => {
      const row = x.split(',')
      return {
        sourceSystem: row[0],
        invoiceNumber: row[1],
        frn: Number(row[2]),
        currency: row[5] === 'S' ? 'GBP' : row[5],
        value: convertToPence(row[6]),
        settlementDate: row[7] !== '' ? moment(row[7], ['YYYY-MM-DD', 'DD/MM/YYYY']).toISOString() : undefined,
        reference: row[8],
        settled: row[9] === 'D' || (row[9] === 'E' && row[8] !== ''),
        detail: row[10],
        filename
      }
    })
  }
}

module.exports = parseReturnFile
