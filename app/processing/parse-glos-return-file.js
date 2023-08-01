const moment = require('moment')
const { convertToPence } = require('../currency-convert')

const parseGlosReturnFile = async (csv, filename) => {
  return csv.map(x => {
    if (x.includes(',')) {
      const row = x.split(',')
      return {
        // SBI, FRN, Agreement number, claim number, date, value, payment reference, bank account, batch number, status, reason
        // 106172753,1102259241,EWCO285-21-22,97,20/06/2023,2137.91,1848061,6926,0729,D,
        // 106833228,1102320358,2589,17,20/06/2023,720.00,1848074,5441,0729,D,
        sourceSystem: 'GLOS',
        sbi: Number(row[0]),
        frn: Number(row[1]),
        agreementNumber: row[2],
        claimNumber: row[3],
        settlementDate: row[4] !== '' ? moment(row[4], ['YYYY-MM-DD', 'DD/MM/YYYY']).toISOString() : undefined, // or date
        value: convertToPence(row[5]),
        reference: row[6], // or paymentReference
        bankAccount: row[7],
        batchNumber: row[8],
        settled: row[9] === 'D', // status
        detail: row[10], // or reason
        // ledger: 'AP',
        filename
      }
    }
  })
}

module.exports = parseGlosReturnFile
