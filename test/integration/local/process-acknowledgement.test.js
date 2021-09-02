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
let blobServiceClient
let containerClient

describe('process acknowledgement', () => {
  beforeAll(async () => {
    blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
    containerClient = blobServiceClient.getContainerClient(config.storageConfig.inboundContainer)
    await containerClient.deleteIfExists()
    await containerClient.createIfNotExists()
    const blockBlobClient = containerClient.getBlockBlobClient('mock_0001_Ack.xml')
    await blockBlobClient.uploadFile('../../files/acknowledgement.xml')
  })

  test('sends acknowledgements', async () => {
    await processing.start()
    expect(mockSendBatchMessages).toHaveBeenCalledWith([{

    }])
  })
})
