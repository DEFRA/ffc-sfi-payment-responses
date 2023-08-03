const parseImpsReturnFile = require('../../../app/processing/parse-imps-return-file')

const impsFilename = require('../../mocks/filenames').IMPS

let impsContent = 'H,9942,04,380225,SCM/38022522-210-001,P,1848107,115.45,B,20-JUN-23,0,'

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
      transactionNumber: 'SCM/38022522-210-001',
      settled: true,
      reference: '1848107',
      value: 11545,
      paymentType: 'B',
      settlementDate: '2023-06-20T00:00:00.000Z',
      valueEUR: 0,
      exchangeRate: '',
      ledger: 'AP',
      filename: impsFilename
    }]
    const result = parseImpsReturnFile([impsContent], impsFilename)
    expect(result).toStrictEqual(mappedContent)
  })

  test('Should return settlement date as undefined when filename and content with no settlement date provided', async () => {
    impsContent = 'H,9942,04,380225,SCM/38022522-210-001,P,1848107,115.45,B,,0,'
    mappedContent = [{
      sourceSystem: 'IMPS',
      paymentJobNumber: '9942',
      fesCode: '04',
      traderNumber: '380225',
      transactionNumber: 'SCM/38022522-210-001',
      settled: true,
      reference: '1848107',
      value: 11545,
      paymentType: 'B',
      settlementDate: undefined,
      valueEUR: 0,
      exchangeRate: '',
      ledger: 'AP',
      filename: impsFilename
    }]
    const result = parseImpsReturnFile([impsContent], impsFilename)
    expect(result).toStrictEqual(mappedContent)
  })

  test('Should return empty array when content does not contain lines starting with H', async () => {
    impsContent = 'B,04,[####],2,205.03,S'
    const result = parseImpsReturnFile([impsContent], impsFilename)
    expect(result).toStrictEqual([])
  })
})
