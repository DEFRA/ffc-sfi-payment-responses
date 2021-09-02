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
let containerClient
const TEST_FILE = path.resolve(__dirname, '../../files/return.csv')

describe('process acknowledgement', () => {
  beforeAll(async () => {
    blobServiceClient = BlobServiceClient.fromConnectionString(config.storageConfig.connectionStr)
    containerClient = blobServiceClient.getContainerClient(config.storageConfig.inboundContainer)
    await containerClient.deleteIfExists()
    await containerClient.createIfNotExists()
    const blockBlobClient = containerClient.getBlockBlobClient('mock Return File.csv')
    await blockBlobClient.uploadFile(TEST_FILE)
  })

  test('sends all returns', async () => {
    await processing.start()
    expect(mockSendBatchMessages.mock.calls[0][0].length).toBe(4)
  })

  test('sends invoice number', async () => {
    await processing.start()
    expect(mockSendBatchMessages.mock.calls[0][0][0].body.invoiceNumber).toBe('S123456789A123456V001')
  })

  test('sends settled', async () => {
    await processing.start()
    expect(mockSendBatchMessages.mock.calls[0][0][0].body.settled).toBe(true)
  })
})
