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
  test('Should call parseGenesisReturnFile when filename contains GENESISPayConf', async () => {
    content = ''
    await parseReturnFile(content, genesisFilename)
    expect(parseGenesisReturnFile).toBeCalled()
  })

  test('Should call parseGlosReturnFile when filename contains FC', async () => {
    content = ''
    await parseReturnFile(content, glosFilename)
    expect(parseGlosReturnFile).toBeCalled()
  })

  test('Should call parseImpsReturnFile when filename contains RET_IMPS', async () => {
    content = ''
    await parseReturnFile(content, impsFilename)
    expect(parseImpsReturnFile).toBeCalled()
  })
  /*
  test('Should return mappedContent when filename and content provided', async () => {
    content = 'SITIAgri,S123456789A123456V001,1234567890,legacy,04-MAY-21,S,406.35,2021-08-27,PY1234567,D,'
    mappedContent = {
        sourceSystem: 'SITIAgri',
        invoiceNumber: 'S123456789A123456V001',
        frn: '1234567890',
        currency: 'S',
        value: '406.35',
        settlementDate: '2021-08-27',
        reference: 'PY1234567',
        settled: 'D',
        detail: '',
        filename
    }
    const result = parseReturnFile(content, filename)
    expect(result).toEqual(mappedContent)
  })
  */
})
