const parseGlosReturnFile = require('../../../app/processing/parse-glos-return-file')

const glosFilename = require('../../mocks/filenames').GLOS

const glosContent = '106172753,1102259241,EWCO285-21-22,97,20/06/2023,2137.91,1848061,6926,0729,D,'

let mappedContent

describe('parse return file', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
  })

  test('Should return mapped glos content when filename and content provided', async () => {
    mappedContent = [{
      sourceSystem: 'GLOS',
      sbi: 106172753,
      frn: 1102259241,
      agreementNumber: 'EWCO285-21-22',
      claimNumber: '97',
      settlementDate: '20/06/2023T00:00:00.000Z',
      value: 213791,
      reference: '1848061',
      bankAccount: '6926',
      batchNumber: '0729',
      settled: true,
      detail: '',
      filename: glosFilename
    }]
    const result = parseGlosReturnFile([glosContent], glosFilename)
    console.log(result)
    expect(result).toStrictEqual(mappedContent)
  })
})
