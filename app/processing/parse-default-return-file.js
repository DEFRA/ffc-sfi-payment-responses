const moment = require('moment')
const { convertToPence } = require('../currency-convert')
const { createHash } = require('../create-hash')

const parseDefaultReturnFile = (csv, filename) => {
  return csv.map(x => {
    const row = x.split(',')
    const values = `${row[0]}${row[1]}${row[2]}${row[5]}${row[6]}${row[7]}${row[8]}${row[9]}${row[10]}${'AP'}${filename}`
    const hash = createHash(values)
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
      ledger: 'AP',
      referenceId: hash,
      filename
    }
  })
}

module.exports = parseDefaultReturnFile
