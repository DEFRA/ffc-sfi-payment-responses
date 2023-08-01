const moment = require('moment')
const { convertToPence } = require('../currency-convert')

const parseGenesisReturnFile = async (csv, filename) => {
  return csv.map(x => {
    const row = x.split('^')
    if (row[0] === 'D') {
      return {
        // Record type, payment id, transaction number, value, date, payment type, payment reference, status, reason
        // D^1098608^AG00384621^1216.00^20/07/2023^B^1892661^D^
        sourceSystem: 'Genesis',
        paymentId: row[1],
        transactionNumber: row[2],
        invoiceNumber: 'I(' + row[1] + ')' + row[2],
        value: convertToPence(row[3]),
        settlementDate: row[4] !== '' ? moment(row[4], ['YYYY-MM-DD', 'DD/MM/YYYY']).toISOString() : undefined, // or date
        paymentType: row[5],
        reference: row[6], // or paymentReference
        settled: row[7] === 'D', // or status
        detail: row[8], // or reason
        // ledger: 'AP',
        filename
      }
    }
  })
}

module.exports = parseGenesisReturnFile
