const moment = require('moment')
const { convertToPence } = require('../../currency-convert')
const { createHash } = require('./create-hash')
const { AP } = require('../../constants/ledgers')
const { GENESIS } = require('../../constants/source-systems')

const parseGenesisReturnFile = (csv, filename) => {
  return csv.map(x => {
    const row = x.split('^')
    const value = `${GENESIS}${row[1]}${row[2]}${row[3]}${row[4]}${row[5]}${row[6]}${row[7]}${row[8]}AP${filename}`
    const hash = createHash(value)
    if (row[0] === 'D') {
      return {
        sourceSystem: GENESIS,
        paymentId: row[1],
        transactionNumber: row[2],
        value: convertToPence(row[3]),
        settlementDate: row[4] !== '' ? moment(row[4], ['YYYY-MM-DD', 'DD/MM/YYYY']).toISOString() : undefined,
        paymentType: row[5],
        reference: row[6],
        settled: row[7] === 'D' || (row[7] === 'E' && row[6] !== ''),
        detail: row[8],
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
  parseGenesisReturnFile
}
