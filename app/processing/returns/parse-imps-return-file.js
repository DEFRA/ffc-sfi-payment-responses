const moment = require('moment')
const { convertToPence } = require('../../currency-convert')
const { createHash } = require('./create-hash')
const { AP } = require('../../constants/ledgers')
const { IMPS } = require('../../constants/schemes')

const parseImpsReturnFile = (csv, filename) => {
  return csv.map(x => {
    const row = x.split(',')
    const value = `${IMPS}${row[1]}${row[2]}${row[3]}${row[4]}${row[5]}${row[6]}${row[7]}${row[8]}${row[9]}${row[10]}${row[11]}AP${filename}`
    const hash = createHash(value)
    if (row[0] === 'H') {
      return {
        sourceSystem: IMPS,
        paymentJobNumber: row[1],
        fesCode: row[2],
        traderNumber: row[3],
        transactionNumber: row[4],
        settled: row[5] === 'P',
        reference: row[6],
        value: convertToPence(row[7]),
        paymentType: row[8],
        settlementDate: row[9] !== '' ? moment(row[9], ['YYYY-MM-DD', 'DD/MM/YYYY', 'DD-MMM-YY']).toISOString() : undefined,
        valueEUR: convertToPence(row[10]),
        exchangeRate: row[11],
        ledger: AP,
        referenceId: hash,
        filename
      }
    } else {
      return undefined
    }
  }).filter(x => x !== undefined)
}

module.exports = {
  parseImpsReturnFile
}
