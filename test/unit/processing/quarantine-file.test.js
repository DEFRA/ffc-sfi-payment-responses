jest.mock('../../../app/storage')
const blobStorage = require('../../../app/storage')

jest.mock('../../../app/event/send-responses-quarantine-event')
const sendResponsesQuarantineEvent = require('../../../app/event/send-responses-quarantine-event')

const quarantineFile = require('../../../app/processing/quarantine-file')

const filename = require('../../mocks/filename')
const error = require('../../mocks/error')

describe('quarantine file', () => {
  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('should call blobStorage.quarantineFile when a filename is received', async () => {
    await quarantineFile(filename, error)
    expect(blobStorage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when a filename is received', async () => {
    await quarantineFile(filename, error)
    expect(blobStorage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with filename when a filename is received', async () => {
    await quarantineFile(filename, error)
    expect(blobStorage.quarantineFile).toHaveBeenCalledWith(filename, filename)
  })

  test('should call blobStorage.quarantineFile when an empty string is received', async () => {
    await quarantineFile('', error)
    expect(blobStorage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when an empty string is received', async () => {
    await quarantineFile('', error)
    expect(blobStorage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with empty string when an empty string is received', async () => {
    await quarantineFile('', error)
    expect(blobStorage.quarantineFile).toHaveBeenCalledWith('', '')
  })

  test('should call blobStorage.quarantineFile when an object is received', async () => {
    await quarantineFile({}, error)
    expect(blobStorage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when an object is received', async () => {
    await quarantineFile({}, error)
    expect(blobStorage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with object when an object is received', async () => {
    await quarantineFile({}, error)
    expect(blobStorage.quarantineFile).toHaveBeenCalledWith({}, {})
  })

  test('should call blobStorage.quarantineFile when an array is received', async () => {
    await quarantineFile([])
    expect(blobStorage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when an array is received', async () => {
    await quarantineFile([], error)
    expect(blobStorage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with array when an array is received', async () => {
    await quarantineFile([], error)
    expect(blobStorage.quarantineFile).toHaveBeenCalledWith([], [])
  })

  test('should call blobStorage.quarantineFile when undefined is received', async () => {
    await quarantineFile(undefined, error)
    expect(blobStorage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when undefined is received', async () => {
    await quarantineFile(undefined, error)
    expect(blobStorage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with undefined when undefined is received', async () => {
    await quarantineFile(undefined, error)
    expect(blobStorage.quarantineFile).toHaveBeenCalledWith(undefined, undefined)
  })

  test('should call blobStorage.quarantineFile when null is received', async () => {
    await quarantineFile(null, error)
    expect(blobStorage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when null is received', async () => {
    await quarantineFile(null, error)
    expect(blobStorage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with null when null is received', async () => {
    await quarantineFile(null, error)
    expect(blobStorage.quarantineFile).toHaveBeenCalledWith(null, null)
  })

  test('should call sendResponsesQuarantineEvent when a filename is received', async () => {
    await quarantineFile(filename, error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalled()
  })

  test('should call sendResponsesQuarantineEvent once when a filename is received', async () => {
    await quarantineFile(filename, error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendResponsesQuarantineEvent with filename and error when a filename is received', async () => {
    await quarantineFile(filename, error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledWith(filename, error)
  })

  test('should call sendResponsesQuarantineEvent when an empty string is received', async () => {
    await quarantineFile('', error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalled()
  })

  test('should call sendResponsesQuarantineEvent once when an empty string is received', async () => {
    await quarantineFile('', error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendResponsesQuarantineEvent with empty string and error when an empty string is received', async () => {
    await quarantineFile('', error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledWith('', error)
  })

  test('should call sendResponsesQuarantineEvent when an object is received', async () => {
    await quarantineFile({}, error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalled()
  })

  test('should call sendResponsesQuarantineEvent once when an object is received', async () => {
    await quarantineFile({}, error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendResponsesQuarantineEvent with object and error when an object is received', async () => {
    await quarantineFile({}, error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledWith({}, error)
  })

  test('should call sendResponsesQuarantineEvent when an array is received', async () => {
    await quarantineFile([], error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalled()
  })

  test('should call sendResponsesQuarantineEvent once when an array is received', async () => {
    await quarantineFile([], error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendResponsesQuarantineEvent with array and error when an array is received', async () => {
    await quarantineFile([], error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledWith([], error)
  })

  test('should call sendResponsesQuarantineEvent when undefined is received', async () => {
    await quarantineFile(undefined, error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalled()
  })

  test('should call sendResponsesQuarantineEvent once when undefined is received', async () => {
    await quarantineFile(undefined, error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendResponsesQuarantineEvent with undefined and error when undefined is received', async () => {
    await quarantineFile(undefined, error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledWith(undefined, error)
  })

  test('should call sendResponsesQuarantineEvent when null is received', async () => {
    await quarantineFile(null, error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalled()
  })

  test('should call sendResponsesQuarantineEvent once when null is received', async () => {
    await quarantineFile(null, error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledTimes(1)
  })

  test('should call sendResponsesQuarantineEvent with null and error when null is received', async () => {
    await quarantineFile(null, error)
    expect(sendResponsesQuarantineEvent).toHaveBeenCalledWith(null, error)
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
