const parseGenesisReturnFile = require('../../../app/processing/parse-genesis-return-file')

const genesisFilename = require('../../mocks/filenames').GENESIS

const genesisContent = 'D^1098608^AG00384621^1216.00^20/07/2023^B^1892661^D^'

let mappedContent

describe('parse return file', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
  })

  test('Should return mapped genesis content when filename and content provided', async () => {
    mappedContent = [{
      sourceSystem: 'Genesis',
      paymentId: '1098608',
      transactionNumber: 'AG00384621',
      invoiceNumber: 'I(1098608)AG00384621',
      value: 121600,
      settlementDate: '2023-07-20T00:00:00.000Z',
      paymentType: 'B',
      reference: '1892661',
      settled: true,
      detail: '',
      filename: genesisFilename
    }]
    const result = parseGenesisReturnFile([genesisContent], genesisFilename)
    console.log(result)
    expect(result).toStrictEqual(mappedContent)
  })
})
