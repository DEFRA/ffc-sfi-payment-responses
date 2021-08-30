const { convertToPence } = require('../currency-convert')

const parseReturnFile = async (buffer) => {
  const csv = buffer.toString().trim().split('\r\n')
  return csv.map(x => {
    const row = x.split(',')
    return {
      sourceSystem: row[0],
      invoiceNumber: row[1],
      frn: Number(row[2]),
      postedDate: row[4],
      currency: row[5] === 'S' ? 'GBP' : row[5],
      value: convertToPence(row[6]),
      settlementDate: row[7],
      reference: row[8],
      settled: row[9] === 'D',
      detail: row[10]
    }
  })
}

module.exports = parseReturnFile
