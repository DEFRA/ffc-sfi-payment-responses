const moment = require('moment')
const { convertToPence } = require('../currency-convert')

const parseGlosReturnFile = (csv, filename) => {
  return csv.map(x => {
    if (x.includes(',')) {
      const row = x.split(',')
      return {
        sourceSystem: 'GLOS',
        sbi: Number(row[0]),
        frn: Number(row[1]),
        agreementNumber: row[2],
        claimNumber: row[3],
        settlementDate: row[4] !== '' ? moment(row[4], ['YYYY-MM-DD', 'DD/MM/YYYY']).toISOString() : undefined,
        value: convertToPence(row[5]),
        reference: row[6],
        bankAccount: row[7],
        batchNumber: row[8],
        settled: row[9] === 'D' || (row[9] === 'E' && row[6] !== ''),
        detail: row[10],
        ledger: 'AP',
        filename
      }
    } else {
      return ''
    }
  }).filter(x => x !== '')
}

module.exports = parseGlosReturnFile
