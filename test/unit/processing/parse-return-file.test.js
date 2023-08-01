jest.mock('../../../app/processing/parse-genesis-return-file')
const parseGenesisReturnFile = require('../../../app/processing/parse-genesis-return-file')

jest.mock('../../../app/processing/parse-glos-return-file')
const parseGlosReturnFile = require('../../../app/processing/parse-glos-return-file')

jest.mock('../../../app/processing/parse-imps-return-file')
const parseImpsReturnFile = require('../../../app/processing/parse-imps-return-file')

const parseReturnFile = require('../../../app/processing/parse-return-file')

const genesisFilename = require('../../mocks/filenames').GENESIS
const glosFilename = require('../../mocks/filenames').GLOS
const impsFilename = require('../../mocks/filenames').IMPS
const filename = require('../../mocks/filenames').DEFAULT

let content
let mappedContent

describe('parse return file', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
  })

  test('Should call parseGenesisReturnFile when filename contains GENESISPayConf', async () => {
    content = ''
    await parseReturnFile(content, genesisFilename)
    expect(parseGenesisReturnFile).toBeCalled()
  })

  test('Should return mapped genesis content when filename and content provided', async () => {
    content = 'D^1098608^AG00384621^1216.00^20/07/2023^B^1892661^D^'
    mappedContent = [{
        sourceSystem: 'Genesis',
        paymentId: '1098608',
        transactionNumber: 'AG00384621',
        invoiceNumber: 'I(1098608)AG00384621',
        value: 121600,
        settlementDate: '20/07/2023T00:00:00.000Z',
        paymentId: 'B',
        reference: '1892661',
        settled: true,
        detail: '',
        genesisFilename
    }]
    const result = parseReturnFile(content, genesisFilename)
    console.log(result)
    expect(result).toStrictEqual(mappedContent)
  })

  test('Should call parseGlosReturnFile when filename contains FCAP', async () => {
    content = ''
    await parseReturnFile(content, glosFilename)
    expect(parseGlosReturnFile).toBeCalled()
  })

  test('Should return mapped glos content when filename and content provided', async () => {
    content = '106172753,1102259241,EWCO285-21-22,97,20/06/2023,2137.91,1848061,6926,0729,D,'
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
        glosFilename
    }]
    const result = parseReturnFile(content, glosFilename)
    console.log(result)
    expect(result).toStrictEqual(mappedContent)
  })

  test('Should call parseImpsReturnFile when filename contains RET_IMPS', async () => {
    content = ''
    await parseReturnFile(content, impsFilename)
    expect(parseImpsReturnFile).toBeCalled()
  })

  test('Should return mapped imps content when filename and content provided', async () => {
    content = 'H,9942,04,380225,SCM/38022522-210-001,P,1848107,115.45,B,20-JUN-23,0,'
    mappedContent = [{
        sourceSystem: 'IMPS',
        paymentJobNumber: '9942',
        fesCode: '04',
        traderNumber: '380225',
        invoiceNumber: 'SCM/38022522-210-001',
        transactionNumber: 'SCM/38022522-210-001',
        settled: true,
        reference: '1892661',
        valueGBP: 11545,
        paymentType: 'B',
        settlementDate: undefined,
        valueEUR: 0,
        exchangeRate: '',
        impsFilename
    }]
    const result = parseReturnFile(content, impsFilename)
    console.log(result)
    expect(result).toStrictEqual(mappedContent)
  })

  test('Should return mapped content when filename and content provided', async () => {
    content = 'SITIAgri,S123456789A123456V001,1234567890,legacy,04-MAY-21,S,406.35,2021-08-27,PY1234567,D,'
    mappedContent = [{
        sourceSystem: 'SITIAgri',
        invoiceNumber: 'S123456789A123456V001',
        frn: 1234567890,
        currency: 'GBP',
        value: 40635,
        settlementDate: '2021-08-27T00:00:00.000Z',
        reference: 'PY1234567',
        settled: true,
        detail: '',
        filename
    }]
    const result = parseReturnFile(content, filename)
    console.log(result)
    expect(result).toStrictEqual(mappedContent)
  })
})
