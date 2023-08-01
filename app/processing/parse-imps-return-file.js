const moment = require('moment')
const { convertToPence } = require('../currency-convert')

const parseImpsReturnFile = async (csv, filename) => {
  return csv.map(x => {
    const row = x.split(',')
    if (row[0] === 'H') {
      return {
        // Record type, payment job number, fes code, trader number, transaction number, status, payment reference, gbp value, payment type, date, eur value, exchange rate
        // H,9942,04,380225,SCM/38022522-210-001,P,1848107,115.45,B,20-JUN-23,0,
        sourceSystem: 'IMPS',
        paymentJobNumber: row[1],
        fesCode: row[2],
        traderNumber: row[3],
        invoiceNumber: row[4],
        transactionNumber: row[4],
        settled: row[5] === 'P', // or status
        reference: row[6], // or paymentReference
        valueGBP: convertToPence(row[7]),
        paymentType: row[8],
        settlementDate: row[9] !== '' ? moment(row[9], ['YYYY-MM-DD', 'DD/MM/YYYY']).toISOString() : undefined, // or date
        valueEUR: row[10],
        exchangeRate: row[11],
        // ledger: 'AP',
        filename
    }
    }
  })
}

module.exports = parseImpsReturnFile
