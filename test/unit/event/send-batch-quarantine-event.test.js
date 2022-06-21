jest.mock('uuid')
const { v4: uuidv4 } = require('uuid')

jest.mock('../../../app/event/raise-event')
const raiseEvent = require('../../../app/event/raise-event')

const sendResponsesQuarantineEvent = require('../../../app/event/send-responses-quarantine-event')

const filename = 'SITIELM0001_AP_20210812105407541.dat'

let error
let event

describe('Sending event for quarantined DAX response file', () => {
  beforeEach(async () => {
    uuidv4.mockImplementation(() => { '70cb0f07-e0cf-449c-86e8-0344f2c6cc6c' })

    error = 'Error: Unclosed root tag'

    event = {
      name: 'responses-processing-quarantine-error',
      type: 'error',
      message: `Quarantined ${filename}`,
      data: {
        filename,
        error
      }
    }
  })

  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('should call uuidv4 when a filename and error are received', async () => {
    await sendResponsesQuarantineEvent(filename, error)
    expect(uuidv4).toHaveBeenCalled()
  })

  test('should call uuidv4 once when a filename and error are received', async () => {
    await sendResponsesQuarantineEvent(filename, error)
    expect(uuidv4).toHaveBeenCalledTimes(1)
  })

  test('should call uuidv4 when a filename and no error are received', async () => {
    await sendResponsesQuarantineEvent(filename, '')
    expect(uuidv4).toHaveBeenCalled()
  })

  test('should call uuidv4 once when a filename and no error are received', async () => {
    await sendResponsesQuarantineEvent(filename, '')
    expect(uuidv4).toHaveBeenCalledTimes(1)
  })

  test('should call raiseEvent when a filename and error are received', async () => {
    await sendResponsesQuarantineEvent(filename, error)
    expect(raiseEvent).toHaveBeenCalled()
  })

  test('should call raiseEvent once when a filename and error are received', async () => {
    await sendResponsesQuarantineEvent(filename, error)
    expect(raiseEvent).toHaveBeenCalledTimes(1)
  })

  test('should call raiseEvent with event and "error" when a filename and error are received', async () => {
    event = {
      ...event,
      id: uuidv4()
    }

    await sendResponsesQuarantineEvent(filename, error)
    expect(raiseEvent).toHaveBeenCalledWith(event, 'error')
  })

  test('should call raiseEvent when a filename and no error are received', async () => {
    await sendResponsesQuarantineEvent(filename, '')
    expect(raiseEvent).toHaveBeenCalled()
  })

  test('should call raiseEvent once when a filename and no error are received', async () => {
    await sendResponsesQuarantineEvent(filename, '')
    expect(raiseEvent).toHaveBeenCalledTimes(1)
  })

  test('should call raiseEvent with event and "error" when a filename and no error are received', async () => {
    event = {
      ...event,
      id: uuidv4(),
      data: {
        ...event.data,
        error: ''
      }
    }

    await sendResponsesQuarantineEvent(filename, '')
    expect(raiseEvent).toHaveBeenCalledWith(event, 'error')
  })
})
