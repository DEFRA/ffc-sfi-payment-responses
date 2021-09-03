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
jest.useFakeTimers()
const processing = require('../../../app/processing')
const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('../../../app/config')
const path = require('path')
let blobServiceClient
let inboundContainer
let archiveContainer
let quarantineContainer
const TEST_FILE = path.resolve(__dirname, '../../files/acknowledgement.xml')
const TEST_INVALID_FILE = path.resolve(__dirname, '../../files/broken-acknowledgement.xml')

describe('process acknowledgement', () => {
  beforeAll(async () => {
    blobServiceClient = BlobServiceClient.fromConnectionString(config.storageConfig.connectionStr)
    inboundContainer = blobServiceClient.getContainerClient(config.storageConfig.inboundContainer)
    archiveContainer = blobServiceClient.getContainerClient(config.storageConfig.archiveContainer)
    quarantineContainer = blobServiceClient.getContainerClient(config.storageConfig.quarantineContainer)
    await inboundContainer.deleteIfExists()
    await archiveContainer.deleteIfExists()
    await quarantineContainer.deleteIfExists()
    await inboundContainer.createIfNotExists()
    await archiveContainer.createIfNotExists()
    await quarantineContainer.createIfNotExists()
    const blockBlobClient = inboundContainer.getBlockBlobClient('mock_0001_Ack.xml')
    await blockBlobClient.uploadFile(TEST_FILE)
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

  test('archives file on success', async () => {
    await processing.start()
    const fileList = []
    for await (const item of archiveContainer.listBlobsFlat()) {
      fileList.push(item.name)
    }
    expect(fileList.filter(x => x === 'mock_0001_Ack.xml').length).toBe(1)
  })

  test('ignores unrelated file', async () => {
    const blockBlobClient = inboundContainer.getBlockBlobClient('ignore me.xml')
    await blockBlobClient.uploadFile(TEST_FILE)
    await processing.start()
    const fileList = []
    for await (const item of inboundContainer.listBlobsFlat()) {
      fileList.push(item.name)
    }
    expect(fileList.filter(x => x === 'ignore me.xml').length).toBe(1)
  })

  test('quarantines invalid file', async () => {
    const blockBlobClient = inboundContainer.getBlockBlobClient('mock_0001_Ack.xml')
    await blockBlobClient.uploadFile(TEST_INVALID_FILE)
    await processing.start()
    const fileList = []
    for await (const item of quarantineContainer.listBlobsFlat()) {
      fileList.push(item.name)
    }
    expect(fileList.filter(x => x === 'mock_0001_Ack.xml').length).toBe(1)
  })
})
