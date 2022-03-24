const { convertToPence } = require('../currency-convert')
const moment = require('moment')

const parseReturnFile = async (content) => {
  const csv = content.trim().split(/\r?\n/)
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
      settled: row[9] === 'D',
      detail: row[10]
    }
  })
}

module.exports = parseReturnFile
