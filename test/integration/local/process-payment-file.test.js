const path = require('path')
const processing = require('../../../app/processing')
const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('../../../app/config')
const TEST_FILE = path.resolve(__dirname, '../../files/payment-file.csv')
const RETURN_TEST_FILE = path.resolve(__dirname, '../../files/return.csv')
const ACK_TEST_FILE = path.resolve(__dirname, '../../files/acknowledgement.xml')
const mockReturnFileNames = ['mock Return File1.csv', 'mock Return File2.csv']
const mockPaymentFileNames = ['FFC mock Payment File2.csv', 'FFC mock Payment File3.csv']
const mockAcknowledgementFileNames = ['mock_0001_Ack.xml', 'mock_0002_Ack.xml']
const mockSendBatchMessages = jest.fn()
let container
let blobServiceClient

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

// helper function to upload files to blob storage
const batchFileUploader = async (fileNamesToUpload, testFile) => {
  for await (const file of fileNamesToUpload) {
    const blockBlobClient = container.getBlockBlobClient(`${config.storageConfig.inboundFolder}/${file}`)
    await blockBlobClient.uploadFile(testFile)
  }
}

describe('process payment files', () => {
  beforeAll(async () => {
    blobServiceClient = BlobServiceClient.fromConnectionString(config.storageConfig.connectionStr)
    container = blobServiceClient.getContainerClient(config.storageConfig.container)
  })

  beforeEach(async () => {
    await container.deleteIfExists()
    await container.createIfNotExists()
  })

  test('Should archive return files when there are no payment files.', async () => {
    await batchFileUploader(mockReturnFileNames, RETURN_TEST_FILE)
    await processing.start()

    const inboundFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.inboundFolder })) {
      inboundFileList.push(item.name)
    }

    const archiveFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.archiveFolder })) {
      archiveFileList.push(item.name)
    }

    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/mock Return File1.csv`).length).toBe(1)
    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/mock Return File2.csv`).length).toBe(1)
  })

  test('Should archive ackowledgement files when there are no payment files.', async () => {
    await batchFileUploader(mockAcknowledgementFileNames, ACK_TEST_FILE)
    await processing.start()

    const inboundFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.inboundFolder })) {
      inboundFileList.push(item.name)
    }

    const archiveFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.archiveFolder })) {
      archiveFileList.push(item.name)
    }

    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/mock_0001_Ack.xml`).length).toBe(1)
    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/mock_0002_Ack.xml`).length).toBe(1)
  })

  test('Should remove all payment files contained within the blob storage container when there is one payment file and no return or acknowledgement files.', async () => {
    await batchFileUploader(['FFC mock Payment File2.csv'], TEST_FILE)
    await processing.start()

    const inboundFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.inboundFolder })) {
      inboundFileList.push(item.name)
    }

    const archiveFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.archiveFolder })) {
      archiveFileList.push(item.name)
    }

    expect(inboundFileList.filter(x => x === `${config.storageConfig.inboundFolder}/FFC mock Payment File.csv`).length).toBe(0)
    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/FFC mock Payment File.csv`).length).toBe(0)
  })

  test('Should remove all payment files contained within the blob storage container when there are multiple payment files and no return or acknowledgement files.', async () => {
    await batchFileUploader(mockPaymentFileNames, TEST_FILE)
    await processing.start()

    const inboundFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.inboundFolder })) {
      inboundFileList.push(item.name)
    }

    const archiveFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.archiveFolder })) {
      archiveFileList.push(item.name)
    }

    expect(inboundFileList.filter(x => x === `${config.storageConfig.inboundFolder}/FFC mock Payment File.csv`).length).toBe(0)
    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/FFC mock Payment File.csv`).length).toBe(0)
  })

  test('Should remove all payment files contained within the blob storage container when there are return files in the container.', async () => {
    await batchFileUploader(mockPaymentFileNames, TEST_FILE)
    await batchFileUploader(mockReturnFileNames, RETURN_TEST_FILE)
    await processing.start()

    const inboundFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.inboundFolder })) {
      inboundFileList.push(item.name)
    }

    const archiveFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.archiveFolder })) {
      archiveFileList.push(item.name)
    }

    expect(inboundFileList.filter(x => x === `${config.storageConfig.inboundFolder}/FFC mock Payment File.csv`).length).toBe(0)
    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/FFC mock Payment File.csv`).length).toBe(0)
  })

  test('Should remove all payment files contained within the blob storage container when there are ackowledgement files in the container.', async () => {
    await batchFileUploader(mockPaymentFileNames, TEST_FILE)
    await batchFileUploader(mockAcknowledgementFileNames, ACK_TEST_FILE)
    await processing.start()

    const inboundFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.inboundFolder })) {
      inboundFileList.push(item.name)
    }

    const archiveFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.archiveFolder })) {
      archiveFileList.push(item.name)
    }

    expect(inboundFileList.filter(x => x === `${config.storageConfig.inboundFolder}/FFC mock Payment File.csv`).length).toBe(0)
    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/FFC mock Payment File.csv`).length).toBe(0)
  })

  test('Should remove all payment files contained within the blob storage container when there are ackowledgement and return files in the container.', async () => {
    await batchFileUploader(mockPaymentFileNames, TEST_FILE)
    await batchFileUploader(mockAcknowledgementFileNames, ACK_TEST_FILE)
    await batchFileUploader(mockReturnFileNames, RETURN_TEST_FILE)
    await processing.start()

    const inboundFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.inboundFolder })) {
      inboundFileList.push(item.name)
    }

    const archiveFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.archiveFolder })) {
      archiveFileList.push(item.name)
    }

    expect(inboundFileList.filter(x => x === `${config.storageConfig.inboundFolder}/FFC mock Payment File.csv`).length).toBe(0)
    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/FFC mock Payment File.csv`).length).toBe(0)
  })

  test('Should archive all return files when there are multiple payment files and no acknowledgement files in the container.', async () => {
    await batchFileUploader(mockPaymentFileNames, TEST_FILE)
    await batchFileUploader(mockReturnFileNames, RETURN_TEST_FILE)
    await processing.start()

    const archiveFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.archiveFolder })) {
      archiveFileList.push(item.name)
    }

    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/mock Return File1.csv`).length).toBe(1)
    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/mock Return File2.csv`).length).toBe(1)
  })

  test('Should archive all return files when there are multiple payment files and multiple acknowledgement files in the container.', async () => {
    await batchFileUploader(mockPaymentFileNames, TEST_FILE)
    await batchFileUploader(mockReturnFileNames, RETURN_TEST_FILE)
    await batchFileUploader(mockAcknowledgementFileNames, ACK_TEST_FILE)
    await processing.start()

    const archiveFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.archiveFolder })) {
      archiveFileList.push(item.name)
    }

    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/mock Return File1.csv`).length).toBe(1)
    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/mock Return File2.csv`).length).toBe(1)
  })

  test('Should archive all acknowledgement files when there are multiple payment files and no return files in the container.', async () => {
    await batchFileUploader(mockPaymentFileNames, TEST_FILE)
    await batchFileUploader(mockAcknowledgementFileNames, ACK_TEST_FILE)
    await processing.start()

    const archiveFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.archiveFolder })) {
      archiveFileList.push(item.name)
    }

    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/mock_0001_Ack.xml`).length).toBe(1)
    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/mock_0002_Ack.xml`).length).toBe(1)
  })

  test('Should archive all acknowledgement files when there are multiple payment files and multiple return files in the container.', async () => {
    await batchFileUploader(mockPaymentFileNames, TEST_FILE)
    await batchFileUploader(mockReturnFileNames, RETURN_TEST_FILE)
    await batchFileUploader(mockAcknowledgementFileNames, ACK_TEST_FILE)
    await processing.start()

    const archiveFileList = []
    for await (const item of container.listBlobsFlat({ prefix: config.storageConfig.archiveFolder })) {
      archiveFileList.push(item.name)
    }

    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/mock_0001_Ack.xml`).length).toBe(1)
    expect(archiveFileList.filter(x => x === `${config.storageConfig.archiveFolder}/mock_0002_Ack.xml`).length).toBe(1)
  })
})
