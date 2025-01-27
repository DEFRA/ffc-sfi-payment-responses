const db = require('../../../data')
const { convertToPence } = require('../../../currency-convert')

const saveImpsReturns = async (content, transaction) => {
  const returns = content.map(line => {
    const data = line.split(',')
    if (data[0] === 'H') {
      return {
        trader: data[3],
        invoiceNumber: data[4],
        status: data[5],
        paymentReference: data[6],
        valueGBP: convertToPence(data[7]),
        paymentType: data[8],
        dateSettled: data[9],
        valueEUR: data[10]
      }
    } else {
      return undefined
    }
  }).filter(line => line !== undefined)

  await db.impsReturn.bulkCreate(returns, { transaction })

  console.log(`Saved ${returns.length} IMPS returns ready for next acknowledgement response`)
}

module.exports = {
  saveImpsReturns
}
