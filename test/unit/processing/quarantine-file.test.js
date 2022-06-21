jest.mock('../../../app/storage')
const blobStorage = require('../../../app/storage')

jest.mock('../../../app/event/send-responses-quarantine-event')
const sendResponsesQuarantineEvent = require('../../../app/event/send-responses-quarantine-event')

const quarantineFile = require('../../../app/processing/quarantine-file')

const filename = 'SITIELM0001_AP_20210812105407541.dat'
const error = 'Error: Unclosed root tag'

describe('quarantine file', () => {
  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('should call blobStorage.quarantineFile when a filename and error are received', async () => {
    await quarantineFile(filename, error)
    expect(blobStorage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when a filename and error are received', async () => {
    await quarantineFile(filename, error)
    expect(blobStorage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with filename and filename when a filename and error are received', async () => {
    await quarantineFile(filename, error)
    expect(blobStorage.quarantineFile).toHaveBeenCalledWith(filename, filename)
  })

  test('should call blobStorage.quarantineFile when a filename and no error are received', async () => {
    await quarantineFile(filename, '')
    expect(blobStorage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when a filename and no error are received', async () => {
    await quarantineFile(filename, '')
    expect(blobStorage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with filename and filename when a filename and no error are received', async () => {
    await quarantineFile(filename, '')
    expect(blobStorage.quarantineFile).toHaveBeenCalledWith(filename, filename)
  })

  test('should call sendResponsesQuarantineEvent when a filename and error are received', async () => {
    await quarantineFile(filename, error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalled()
  })

  test('should call sendResponsesQuarantineEvent once when a filename and error are received', async () => {
    await quarantineFile(filename, error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendResponsesQuarantineEvent with filename and error when a filename and error are received', async () => {
    await quarantineFile(filename, error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledWith(filename, error)
  })

  test('should call sendResponsesQuarantineEvent when a filename and no error are received', async () => {
    await quarantineFile(filename, '')
    expect(sendResponsesQuarantineEvent).toHaveBeenCalled()
  })

  test('should call sendResponsesQuarantineEvent once when a filename and no error are received', async () => {
    await quarantineFile(filename, '')
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendResponsesQuarantineEvent with filename and error when a filename and no error are received', async () => {
    await quarantineFile(filename, '')
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledWith(filename, '')
  })

  test('should return true when blobStorage.quarantineFile returns true', async () => {
    blobStorage.quarantineFile.mockReturnValue(true)
    const result = await quarantineFile(filename, error)
    expect(result).toBe(true)
  })

  test('should return false when blobStorage.quarantineFile returns false', async () => {
    blobStorage.quarantineFile.mockReturnValue(false)
    const result = await quarantineFile(filename, error)
    expect(result).toBe(false)
  })
})
