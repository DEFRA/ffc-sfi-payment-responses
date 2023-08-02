jest.mock('../../../app/processing/parse-genesis-return-file')
const parseGenesisReturnFile = require('../../../app/processing/parse-genesis-return-file')

jest.mock('../../../app/processing/parse-glos-return-file')
const parseGlosReturnFile = require('../../../app/processing/parse-glos-return-file')

jest.mock('../../../app/processing/parse-imps-return-file')
const parseImpsReturnFile = require('../../../app/processing/parse-imps-return-file')

jest.mock('../../../app/processing/parse-default-return-file')
const parseDefaultReturnFile = require('../../../app/processing/parse-default-return-file')

const parseReturnFile = require('../../../app/processing/parse-return-file')

const genesisFilename = require('../../mocks/filenames').GENESIS
const glosFilename = require('../../mocks/filenames').GLOS
const impsFilename = require('../../mocks/filenames').IMPS
const filename = require('../../mocks/filenames').DEFAULT

const genesisContent = 'D^1098608^AG00384621^1216.00^20/07/2023^B^1892661^D^'
const glosContent = '106172753,1102259241,EWCO285-21-22,97,20/06/2023,2137.91,1848061,6926,0729,D,'
const impsContent = 'H,9942,04,380225,SCM/38022522-210-001,P,1848107,115.45,B,20-JUN-23,0,'
const content = 'SITIAgri,S123456789A123456V001,1234567890,legacy,04-MAY-21,S,406.35,2021-08-27,PY1234567,D,'

describe('parse return file', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
  })

  test('Should call parseGenesisReturnFile when filename contains GENESISPayConf', async () => {
    await parseReturnFile(genesisContent, genesisFilename)
    expect(parseGenesisReturnFile).toBeCalled()
  })

  test('Should call parseGenesisReturnFile with content and filename', async () => {
    await parseReturnFile(genesisContent, genesisFilename)
    expect(parseGenesisReturnFile).toBeCalledWith([genesisContent], genesisFilename)
  })

  test('Should call parseGlosReturnFile when filename contains FCAP', async () => {
    await parseReturnFile(glosContent, glosFilename)
    expect(parseGlosReturnFile).toBeCalled()
  })

  test('Should call parseGlosReturnFile with content and filename', async () => {
    await parseReturnFile(glosContent, glosFilename)
    expect(parseGlosReturnFile).toBeCalledWith([glosContent], glosFilename)
  })

  test('Should call parseImpsReturnFile when filename contains RET_IMPS', async () => {
    await parseReturnFile(impsContent, impsFilename)
    expect(parseImpsReturnFile).toBeCalled()
  })

  test('Should call parseImpsReturnFile with content and filename', async () => {
    await parseReturnFile(impsContent, impsFilename)
    expect(parseImpsReturnFile).toBeCalledWith([impsContent], impsFilename)
  })

  test('Should call parseDefaultReturnFile when filename contains anything else', async () => {
    await parseReturnFile(content, filename)
    expect(parseDefaultReturnFile).toBeCalled()
  })

  test('Should call parseDefaultReturnFile with content and filename', async () => {
    await parseReturnFile(content, filename)
    expect(parseDefaultReturnFile).toBeCalledWith([content], filename)
  })
})
