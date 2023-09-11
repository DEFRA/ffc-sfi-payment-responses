jest.mock('../../../../app/storage')
const { downloadFile, archiveFile } = require('../../../../app/storage')

jest.mock('../../../../app/processing/returns/parse-return-file')
const { parseReturnFile } = require('../../../../app/processing/returns/parse-return-file')

jest.mock('../../../../app/processing/quarantine-file')
const { quarantineFile } = require('../../../../app/processing/quarantine-file')

jest.mock('../../../../app/messaging')
const { sendReturnMessages } = require('../../../../app/messaging')

jest.mock('../../../../app/processing/returns/is-imps-return-file')
const { isImpsReturnFile } = require('../../../../app/processing/returns/is-imps-return-file')

jest.mock('../../../../app/processing/returns/save-imps-returns')
const { saveImpsReturns } = require('../../../../app/processing/returns/save-imps-returns')

jest.mock('../../../../app/processing/returns/is-genesis-return-file')
const { isGenesisReturnFile } = require('../../../../app/processing/returns/is-genesis-return-file')

jest.mock('../../../../app/processing/returns/create-genesis-return-file')
const { createGenesisReturnFile } = require('../../../../app/processing/returns/create-genesis-return-file')

jest.mock('../../../../app/processing/returns/is-glos-return-file')
const { isGlosReturnFile } = require('../../../../app/processing/returns/is-glos-return-file')

jest.mock('../../../../app/processing/returns/create-glos-return-file')
const { createGlosReturnFile } = require('../../../../app/processing/returns/create-glos-return-file')

const { processReturn } = require('../../../../app/processing/returns/process-return')

const filename = 'Return File.csv'
const impsFileName = 'RET_IMPS.INT'
const genesisFileName = 'GENESISPayConf.gni'
const glosFileName = 'FCAP RPA.dat'

const fileContent = 'file content'
const messages = ['message 1', 'message 2']
const transaction = 'mock-transaction'

describe('process return', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    downloadFile.mockResolvedValue(fileContent)
    parseReturnFile.mockReturnValue(messages)
  })

  test('should download file content', async () => {
    await processReturn(filename, transaction)
    expect(downloadFile).toHaveBeenCalledWith(filename)
  })

  test('should parse return file', async () => {
    await processReturn(filename, transaction)
    expect(parseReturnFile).toHaveBeenCalledWith(expect.any(Array), filename)
  })

  test('should quarantine file if parse error', async () => {
    const err = new Error('parse error')
    parseReturnFile.mockImplementation(() => { throw err })
    await processReturn(filename, transaction)
    expect(quarantineFile).toHaveBeenCalledWith(filename, err)
  })

  test('should send return messages for parsed content', async () => {
    await processReturn(filename, transaction)
    expect(sendReturnMessages).toHaveBeenCalledWith(messages)
  })

  test('should save imps returns if imps return file', async () => {
    isImpsReturnFile.mockReturnValue(true)
    await processReturn(impsFileName, transaction)
    expect(saveImpsReturns).toHaveBeenCalledWith([fileContent], transaction)
  })

  test('should create genesis return file if genesis return file', async () => {
    isGenesisReturnFile.mockReturnValue(true)
    await processReturn(genesisFileName, transaction)
    expect(createGenesisReturnFile).toHaveBeenCalledWith([fileContent], genesisFileName, transaction)
  })

  test('should create glos return file if glos return file', async () => {
    isGlosReturnFile.mockReturnValue(true)
    await processReturn(glosFileName, transaction)
    expect(createGlosReturnFile).toHaveBeenCalledWith([fileContent], glosFileName, transaction)
  })

  test('should archive file', async () => {
    await processReturn(filename, transaction)
    expect(archiveFile).toHaveBeenCalledWith(filename)
  })
})
