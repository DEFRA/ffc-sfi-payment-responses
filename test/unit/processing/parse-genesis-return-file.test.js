const parseGenesisReturnFile = require('../../../app/processing/parse-genesis-return-file')

const genesisFilename = require('../../mocks/filenames').GENESIS

let genesisContent = 'D^1098608^AG00384621^1216.00^20/07/2023^B^1892661^D^'

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
      value: 121600,
      settlementDate: '2023-07-20T00:00:00.000Z',
      paymentType: 'B',
      reference: '1892661',
      settled: true,
      detail: '',
      ledger: 'AP',
      filename: genesisFilename
    }]
    const result = parseGenesisReturnFile([genesisContent], genesisFilename)
    expect(result).toStrictEqual(mappedContent)
  })

  test('Should return settlement date as undefined when filename and content with no settlement date provided', async () => {
    genesisContent = 'D^1098608^AG00384621^1216.00^^B^1892661^D^'
    mappedContent = [{
      sourceSystem: 'Genesis',
      paymentId: '1098608',
      transactionNumber: 'AG00384621',
      value: 121600,
      settlementDate: undefined,
      paymentType: 'B',
      reference: '1892661',
      settled: true,
      detail: '',
      ledger: 'AP',
      filename: genesisFilename
    }]
    const result = parseGenesisReturnFile([genesisContent], genesisFilename)
    expect(result).toStrictEqual(mappedContent)
  })

  test('Should return empty array when content does not contain lines starting with D', async () => {
    genesisContent = 'H^21/07/2023^3^44927.18^[####]'
    const result = parseGenesisReturnFile([genesisContent], genesisFilename)
    expect(result).toStrictEqual([])
  })
})
