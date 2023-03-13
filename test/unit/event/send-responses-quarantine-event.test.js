const mockSendEvent = jest.fn()
const mockPublishEvent = jest.fn()
const MockPublishEvent = jest.fn().mockImplementation(() => {
  return {
    sendEvent: mockSendEvent
  }
})
const MockEventPublisher = jest.fn().mockImplementation(() => {
  return {
    publishEvent: mockPublishEvent
  }
})
jest.mock('ffc-pay-event-publisher', () => {
  return {
    PublishEvent: MockPublishEvent,
    EventPublisher: MockEventPublisher
  }
})
jest.mock('../../../app/config')
const config = require('../../../app/config')
const { RESPONSE_REJECTED } = require('../../../app/constants/events')
const { SOURCE } = require('../../../app/constants/source')
const sendResponsesQuarantineEvent = require('../../../app/event/send-responses-quarantine-event')

const filename = require('../../mocks/filename')
const error = require('../../mocks/error')

beforeEach(() => {
  config.useV1Events = true
  config.useV2Events = true
  config.eventTopic = 'v1-events'
  config.eventsTopic = 'v2-events'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('V1 quarantine ack event', () => {
  test('should send V1 event if V1 events enabled', async () => {
    config.useV1Events = true
    await sendResponsesQuarantineEvent(filename, error)
    expect(mockSendEvent).toHaveBeenCalled()
  })

  test('should not send V1 event if V1 events disabled', async () => {
    config.useV1Events = false
    await sendResponsesQuarantineEvent(filename, error)
    expect(mockSendEvent).not.toHaveBeenCalled()
  })

  test('should send event to V1 topic', async () => {
    await sendResponsesQuarantineEvent(filename, error)
    expect(MockPublishEvent.mock.calls[0][0]).toBe(config.eventTopic)
  })

  test('should generate a new uuid as Id', async () => {
    await sendResponsesQuarantineEvent(filename, error)
    expect(mockSendEvent.mock.calls[0][0].properties.id).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
  })

  test('should raise responses-processing-quarantine-error event name', async () => {
    await sendResponsesQuarantineEvent(filename, error)
    expect(mockSendEvent.mock.calls[0][0].name).toBe('responses-processing-quarantine-error')
  })

  test('should raise error status event', async () => {
    await sendResponsesQuarantineEvent(filename, error)
    expect(mockSendEvent.mock.calls[0][0].properties.status).toBe('error')
  })

  test('should raise error event type', async () => {
    await sendResponsesQuarantineEvent(filename, error)
    expect(mockSendEvent.mock.calls[0][0].properties.action.type).toBe('error')
  })

  test('should include message in event', async () => {
    await sendResponsesQuarantineEvent(filename, error)
    expect(mockSendEvent.mock.calls[0][0].properties.action.message).toBe('Quarantined test.csv')
  })

  test('should include filename in event', async () => {
    await sendResponsesQuarantineEvent(filename, error)
    expect(mockSendEvent.mock.calls[0][0].properties.action.data.filename).toBe(filename)
  })
})

describe('V2 quarantine ack event', () => {
  test('should send V2 event if V2 events enabled', async () => {
    config.useV2Events = true
    await sendResponsesQuarantineEvent(filename, error)
    expect(mockPublishEvent).toHaveBeenCalled()
  })

  test('should not send V2 event if V2 events disabled', async () => {
    config.useV2Events = false
    await sendResponsesQuarantineEvent(filename, error)
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('should send event to V2 topic', async () => {
    await sendResponsesQuarantineEvent(filename, error)
    expect(MockEventPublisher.mock.calls[0][0]).toBe(config.eventsTopic)
  })

  test('should raise an event with processing source', async () => {
    await sendResponsesQuarantineEvent(filename, error)
    expect(mockPublishEvent.mock.calls[0][0].source).toBe(SOURCE)
  })

  test('should raise acknowledged payment event type', async () => {
    await sendResponsesQuarantineEvent(filename, error)
    expect(mockPublishEvent.mock.calls[0][0].type).toBe(RESPONSE_REJECTED)
  })

  test('should include error message in event data', async () => {
    await sendResponsesQuarantineEvent(filename, error)
    expect(mockPublishEvent.mock.calls[0][0].data.message).toBe(error.message)
  })
})
