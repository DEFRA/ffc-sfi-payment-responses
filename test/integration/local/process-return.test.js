jest.useFakeTimers()

const mockSendBatchMessages = jest.fn()

jest.mock('ffc-messaging', () => {
  return {
    MessageBatchSender: jest.fn().mockImplementation(() => {
      return {
        sendBatchMessages: mockSendBatchMessages,
        closeConnection: jest.fn()
      }
    })
  }
})

const mockPublishEvent = jest.fn()

jest.mock('ffc-pay-event-publisher', () => {
  return {
    EventPublisher: jest.fn().mockImplementation(() => {
      return {
        publishEvent: mockPublishEvent
      }
    })
  }
})

const { BlobServiceClient } = require('@azure/storage-blob')
const path = require('path')

const config = require('../../../app/config')
const processing = require('../../../app/processing')

const TEST_FILE = path.resolve(__dirname, '../../files/return.csv')
const TEST_INVALID_FILE = path.resolve(__dirname, '../../files/broken-return.csv')

const { RESPONSE_REJECTED } = require('../../../app/constants/events')
const { SOURCE } = require('../../../app/constants/source')

const VALID_FILENAME = 'mock Return File.csv'
const INVALID_FILENAME = 'ignore me.csv'

let blobServiceClient
let container

describe('process acknowledgement', () => {
  beforeEach(async () => {
    blobServiceClient = BlobServiceClient.fromConnectionString(config.storageConfig.connectionStr)
    container = blobServiceClient.getContainerClient(config.storageConfig.container)
    await container.deleteIfExists()
    await container.createIfNotExists()
    const blockBlobClient = container.getBlockBlobClient(`${config.storageConfig.inboundFolder}/${VALID_FILENAME}`)
    await blockBlobClient.uploadFile(TEST_FILE)
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })
  describe('for valid files', () => {
    test('sends all returns', async () => {
      await processing.start()
      expect(mockSendBatchMessages.mock.calls[0][0].length).toBe(6)
    })

    test('sends invoice number', async () => {
      await processing.start()
      expect(mockSendBatchMessages.mock.calls[0][0][0].body.invoiceNumber).toBe('S123456789A123456V001')
    })

    test('sends settled if D', async () => {
      await processing.start()
      expect(mockSendBatchMessages.mock.calls[0][0][0].body.settled).toBe(true)
    })

    test('sends settled if E with reference', async () => {
      await processing.start()
      expect(mockSendBatchMessages.mock.calls[0][0][4].body.settled).toBe(true)
    })

    test('sends unsettled if E without reference', async () => {
      await processing.start()
      expect(mockSendBatchMessages.mock.calls[0][0][5].body.settled).toBe(false)
    })

    test('archives file on success', async () => {
      await processing.start()
      const fileList = []
      for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.archiveFolder })) {
        fileList.push(item.name)
      }
      expect(fileList.filter(x => x === `${config.storageConfig.archiveFolder}/${VALID_FILENAME}`).length).toBe(1)
    })
    test('does not quarantine file if unable to publish message', async () => {
      mockSendBatchMessages.mockImplementation(() => { throw new Error('Unable to publish message') })
      await processing.start()
      const fileList = []
      for await (const item of container.listBlobsFlat()) {
        fileList.push(item.name)
      }
      expect(fileList.filter(x => x === `${config.storageConfig.inboundFolder}/${VALID_FILENAME}`).length).toBe(1)
    })
  })

  describe('for invalid or unrelated files', () => {
    test('ignores unrelated file', async () => {
      const blockBlobClient = container.getBlockBlobClient(`${config.storageConfig.inboundFolder}/${INVALID_FILENAME}`)
      await blockBlobClient.uploadFile(TEST_FILE)
      await processing.start()
      const fileList = []
      for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.inboundFolder })) {
        fileList.push(item.name)
      }
      expect(fileList.filter(x => x === `${config.storageConfig.inboundFolder}/${INVALID_FILENAME}`).length).toBe(1)
    })

    test('quarantines invalid file', async () => {
      const blockBlobClient = container.getBlockBlobClient(`${config.storageConfig.inboundFolder}/${VALID_FILENAME}`)
      await blockBlobClient.uploadFile(TEST_INVALID_FILE)
      await processing.start()
      const fileList = []
      for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.quarantineFolder })) {
        fileList.push(item.name)
      }
      expect(fileList.filter(x => x === `${config.storageConfig.quarantineFolder}/${VALID_FILENAME}`).length).toBe(1)
    })

    test('calls mockPublishEvent once', async () => {
      const blockBlobClient = container.getBlockBlobClient(`${config.storageConfig.inboundFolder}/${VALID_FILENAME}`)
      await blockBlobClient.uploadFile(TEST_INVALID_FILE)

      await processing.start()

      expect(mockPublishEvent.mock.calls.length).toBe(1)
    })

    test('calls mockPublishEvent with event.type RESPONSE_REJECTED', async () => {
      const blockBlobClient = container.getBlockBlobClient(`${config.storageConfig.inboundFolder}/${VALID_FILENAME}`)
      await blockBlobClient.uploadFile(TEST_INVALID_FILE)

      await processing.start()
      expect(mockPublishEvent.mock.calls[0][0].type).toBe(RESPONSE_REJECTED)
    })

    test('calls mockPublishEvent.sendEvent with source of SOURCE', async () => {
      const blockBlobClient = container.getBlockBlobClient(`${config.storageConfig.inboundFolder}/${VALID_FILENAME}`)
      await blockBlobClient.uploadFile(TEST_INVALID_FILE)

      await processing.start()

      expect(mockPublishEvent.mock.calls[0][0].source).toBe(SOURCE)
    })

    test('calls mockPublishEvent.sendEvent with subject of VALID_FILENAME', async () => {
      const blockBlobClient = container.getBlockBlobClient(`${config.storageConfig.inboundFolder}/${VALID_FILENAME}`)
      await blockBlobClient.uploadFile(TEST_INVALID_FILE)

      await processing.start()

      expect(mockPublishEvent.mock.calls[0][0].subject).toBe(VALID_FILENAME)
    })
  })
})
