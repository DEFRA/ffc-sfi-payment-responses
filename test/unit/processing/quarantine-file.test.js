jest.mock('../../../app/storage')
const blobStorage = require('../../../app/storage')

jest.mock('../../../app/event/send-responses-quarantine-event')
const sendResponsesQuarantineEvent = require('../../../app/event/send-responses-quarantine-event')

const quarantineFile = require('../../../app/processing/quarantine-file')

const filename = 'SITIELM0001_AP_20210812105407541.dat'

describe('quarantine file', () => {
  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('should call blobStorage.quarantineFile when a filename is received', async () => {
    await quarantineFile(filename)
    expect(blobStorage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when a filename is received', async () => {
    await quarantineFile(filename)
    expect(blobStorage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with filename when a filename is received', async () => {
    await quarantineFile(filename)
    expect(blobStorage.quarantineFile).toHaveBeenCalledWith(filename, filename)
  })

  test('should call blobStorage.quarantineFile when an empty string is received', async () => {
    await quarantineFile('')
    expect(blobStorage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when an empty string is received', async () => {
    await quarantineFile('')
    expect(blobStorage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with empty string when an empty string is received', async () => {
    await quarantineFile('')
    expect(blobStorage.quarantineFile).toHaveBeenCalledWith('', '')
  })

  test('should call blobStorage.quarantineFile when an object is received', async () => {
    await quarantineFile({})
    expect(blobStorage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when an object is received', async () => {
    await quarantineFile({})
    expect(blobStorage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with object when an object is received', async () => {
    await quarantineFile({})
    expect(blobStorage.quarantineFile).toHaveBeenCalledWith({}, {})
  })

  test('should call blobStorage.quarantineFile when an array is received', async () => {
    await quarantineFile([])
    expect(blobStorage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when an array is received', async () => {
    await quarantineFile([])
    expect(blobStorage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with array when an array is received', async () => {
    await quarantineFile([])
    expect(blobStorage.quarantineFile).toHaveBeenCalledWith([], [])
  })

  test('should call blobStorage.quarantineFile when undefined is received', async () => {
    await quarantineFile(undefined)
    expect(blobStorage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when undefined is received', async () => {
    await quarantineFile(undefined)
    expect(blobStorage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with undefined when undefined is received', async () => {
    await quarantineFile(undefined)
    expect(blobStorage.quarantineFile).toHaveBeenCalledWith(undefined, undefined)
  })

  test('should call blobStorage.quarantineFile when null is received', async () => {
    await quarantineFile(null)
    expect(blobStorage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when null is received', async () => {
    await quarantineFile(null)
    expect(blobStorage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with null when null is received', async () => {
    await quarantineFile(null)
    expect(blobStorage.quarantineFile).toHaveBeenCalledWith(null, null)
  })

  test('should call sendResponsesQuarantineEvent when a filename is received', async () => {
    await quarantineFile(filename)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalled()
  })

  test('should call sendResponsesQuarantineEvent once when a filename is received', async () => {
    await quarantineFile(filename)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendResponsesQuarantineEvent with filename when a filename is received', async () => {
    await quarantineFile(filename)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledWith(filename)
  })

  test('should call sendResponsesQuarantineEvent when an empty string is received', async () => {
    await quarantineFile('')
    expect(sendResponsesQuarantineEvent).toHaveBeenCalled()
  })

  test('should call sendResponsesQuarantineEvent once when an empty string is received', async () => {
    await quarantineFile('')
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendResponsesQuarantineEvent with empty string when an empty string is received', async () => {
    await quarantineFile('')
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledWith('')
  })

  test('should call sendResponsesQuarantineEvent when an object is received', async () => {
    await quarantineFile({})
    expect(sendResponsesQuarantineEvent).toHaveBeenCalled()
  })

  test('should call sendResponsesQuarantineEvent once when an object is received', async () => {
    await quarantineFile({})
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendResponsesQuarantineEvent with object when an object is received', async () => {
    await quarantineFile({})
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledWith({})
  })

  test('should call sendResponsesQuarantineEvent when an array is received', async () => {
    await quarantineFile([])
    expect(sendResponsesQuarantineEvent).toHaveBeenCalled()
  })

  test('should call sendResponsesQuarantineEvent once when an array is received', async () => {
    await quarantineFile([])
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendResponsesQuarantineEvent with array when an array is received', async () => {
    await quarantineFile([])
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledWith([])
  })

  test('should call sendResponsesQuarantineEvent when undefined is received', async () => {
    await quarantineFile(undefined)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalled()
  })

  test('should call sendResponsesQuarantineEvent once when undefined is received', async () => {
    await quarantineFile(undefined)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendResponsesQuarantineEvent with undefined when undefined is received', async () => {
    await quarantineFile(undefined)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledWith(undefined)
  })

  test('should call sendResponsesQuarantineEvent when null is received', async () => {
    await quarantineFile(null)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalled()
  })

  test('should call sendResponsesQuarantineEvent once when null is received', async () => {
    await quarantineFile(null)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendResponsesQuarantineEvent with null when null is received', async () => {
    await quarantineFile(null)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledWith(null)
  })

  test('should return true when blobStorage.quarantineFile returns true', async () => {
    blobStorage.quarantineFile.mockReturnValue(true)
    const result = await quarantineFile(filename)
    expect(result).toBe(true)
  })

  test('should return false when blobStorage.quarantineFile returns false', async () => {
    blobStorage.quarantineFile.mockReturnValue(false)
    const result = await quarantineFile(filename)
    expect(result).toBe(false)
  })
})
