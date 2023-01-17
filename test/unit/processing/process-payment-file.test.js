
jest.mock('../../../app/storage')
const blobStorage = require('../../../app/storage')
const { deleteFile } = require('../../../app/storage')

const processPaymentFile = require('../../../app/processing/process-payment-file')

const filename = 'FFCSFIP_0001_AP_20220329120821 (SITISFI).csv'
const errorMessage = 'Error when calling blobStorage.delete'
jest.spyOn(console, 'log').mockImplementation()
jest.spyOn(console, 'error').mockImplementation()

describe('process payment file', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
  })

  test('Should call blobStorage.deleteFile', async () => {
    await processPaymentFile(filename)
    expect(blobStorage.deleteFile).toBeCalled()
  })

  test('Should call blobStorage.deleteFile once', async () => {
    await processPaymentFile(filename)
    expect(blobStorage.deleteFile).toBeCalledTimes(1)
  })

  test('Should call blobStorage.deleteFile with filename', async () => {
    await processPaymentFile(filename)
    expect(blobStorage.deleteFile).toHaveBeenCalledWith(filename)
  })

  test('Should log message when blobStorage.deleteFile is called', async () => {
    await processPaymentFile(filename)
    expect(console.log).toHaveBeenCalled()
  })

  test('Should log one message when blobStorage.deleteFile is called', async () => {
    await processPaymentFile(filename)
    expect(console.log).toHaveBeenCalledTimes(1)
  })

  test('Should log message including filename when blobStorage.deleteFile is called', async () => {
    await processPaymentFile(filename)
    expect(console.log).toHaveBeenCalledWith('Payment File sent from DAX, has been deleted :', filename)
  })

  test('Should call console.error when blobStorage.deleteFile throws an error', async () => {
    deleteFile.mockRejectedValue(new Error(errorMessage))
    await processPaymentFile(filename)
    expect(console.error).toBeCalled()
  })

  test('Should call console.error once when blobStorage.deleteFile throws an error', async () => {
    deleteFile.mockRejectedValue(new Error(errorMessage))
    await processPaymentFile(filename)
    expect(console.error).toBeCalledTimes(1)
  })

  test('Should call console.error when blobStorage.deleteFile throws an error', async () => {
    deleteFile.mockRejectedValue(new Error(errorMessage))
    await processPaymentFile(filename)
    expect(console.error).toHaveBeenCalledWith(`Failed to delete payment file: ${filename}`, new Error(errorMessage))
  })
})
