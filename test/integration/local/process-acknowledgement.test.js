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

const mockSendEvent = jest.fn()
jest.mock('ffc-pay-event-publisher', () => {
  return {
    PublishEvent: jest.fn().mockImplementation(() => {
      return {
        sendEvent: mockSendEvent
      }
    })
  }
})

const { BlobServiceClient } = require('@azure/storage-blob')
const path = require('path')

const config = require('../../../app/config')
const processing = require('../../../app/processing')

let blobServiceClient
let container

const TEST_FILE = path.resolve(__dirname, '../../files/acknowledgement.xml')
const TEST_INVALID_FILE = path.resolve(__dirname, '../../files/broken-acknowledgement.xml')

describe('process acknowledgement', () => {
  beforeEach(async () => {
    blobServiceClient = BlobServiceClient.fromConnectionString(config.storageConfig.connectionStr)
    container = blobServiceClient.getContainerClient(config.storageConfig.container)
    await container.deleteIfExists()
    await container.createIfNotExists()
    const blockBlobClient = container.getBlockBlobClient(`${config.storageConfig.inboundFolder}/mock_0001_Ack.xml`)
    await blockBlobClient.uploadFile(TEST_FILE)
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  test('sends all acknowledgements', async () => {
    await processing.start()
    expect(mockSendBatchMessages.mock.calls[0][0].length).toBe(4)
  })

  test('sends invoice number', async () => {
    await processing.start()
    expect(mockSendBatchMessages.mock.calls[0][0][0].body.invoiceNumber).toBe('S123456789A123456V001')
  })

  test('sends frn', async () => {
    await processing.start()
    expect(mockSendBatchMessages.mock.calls[0][0][0].body.frn).toBe(1234567890)
  })

  test('sends success', async () => {
    await processing.start()
    expect(mockSendBatchMessages.mock.calls[0][0][0].body.success).toBe(true)
  })

  test('sends failure message for invalid bank details', async () => {
    await processing.start()
    expect(mockSendBatchMessages.mock.calls[0][0][3].body.success).toBe(false)
    expect(mockSendBatchMessages.mock.calls[0][0][3].body.message).toBe('Invalid bank details')
  })

  test('sends failure message for unknown failure', async () => {
    await processing.start()
    expect(mockSendBatchMessages.mock.calls[0][0][2].body.success).toBe(false)
    expect(mockSendBatchMessages.mock.calls[0][0][2].body.message).toBe('Journal JN12345678 has been created Validation failed Line : 21.')
  })

  test('archives file on success', async () => {
    await processing.start()
    const fileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.archiveFolder })) {
      fileList.push(item.name)
    }
    expect(fileList.filter(x => x === `${config.storageConfig.archiveFolder}/mock_0001_Ack.xml`).length).toBe(1)
  })

  test('ignores unrelated file', async () => {
    const blockBlobClient = container.getBlockBlobClient(`${config.storageConfig.inboundFolder}/ignore me.xml`)
    await blockBlobClient.uploadFile(TEST_FILE)
    await processing.start()
    const fileList = []
    for await (const item of container.listBlobsFlat()) {
      fileList.push(item.name)
    }
    expect(fileList.filter(x => x === `${config.storageConfig.inboundFolder}/ignore me.xml`).length).toBe(1)
  })

  test('quarantines invalid file', async () => {
    const blockBlobClient = container.getBlockBlobClient(`${config.storageConfig.inboundFolder}/mock_0001_Ack.xml`)
    await blockBlobClient.uploadFile(TEST_INVALID_FILE)
    await processing.start()
    const fileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.quarantineFolder })) {
      fileList.push(item.name)
    }
    expect(fileList.filter(x => x === `${config.storageConfig.quarantineFolder}/mock_0001_Ack.xml`).length).toBe(1)
  })

  test('sends off event for invalid file', async () => {
    const blockBlobClient = container.getBlockBlobClient(`${config.storageConfig.inboundFolder}/mock_0001_Ack.xml`)
    await blockBlobClient.uploadFile(TEST_INVALID_FILE)

    await processing.start()

    expect(mockSendEvent.mock.calls.length).toBe(1)
  })
})
