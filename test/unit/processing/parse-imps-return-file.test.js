const parseImpsReturnFile = require('../../../app/processing/parse-imps-return-file')

const impsFilename = require('../../mocks/filenames').IMPS

const impsContent = 'H,9942,04,380225,SCM/38022522-210-001,P,1848107,115.45,B,20-JUN-23,0,'

let mappedContent

describe('parse return file', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
  })
  test('Should return mapped imps content when filename and content provided', async () => {
    mappedContent = [{
      sourceSystem: 'IMPS',
      paymentJobNumber: '9942',
      fesCode: '04',
      traderNumber: '380225',
      invoiceNumber: 'SCM/38022522-210-001',
      transactionNumber: 'SCM/38022522-210-001',
      settled: true,
      reference: '1848107',
      valueGBP: 11545,
      paymentType: 'B',
      settlementDate: null,
      valueEUR: 0,
      exchangeRate: '',
      filename: impsFilename
    }]
    const result = parseImpsReturnFile([impsContent], impsFilename)
    console.log(result)
    expect(result).toStrictEqual(mappedContent)
  })
})
