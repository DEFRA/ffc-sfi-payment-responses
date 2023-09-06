jest.mock('../../../../app/storage')
const { deleteFile } = require('../../../../app/storage')

const { processPaymentFile } = require('../../../../app/processing/payments/process-payment-file')

const filename = 'FFCSFIP_0001_AP_20220329120821 (SITISFI).csv'
const errorMessage = 'Error when calling delete'
jest.spyOn(console, 'log').mockImplementation()
jest.spyOn(console, 'error').mockImplementation()

describe('process payment file', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
  })

  test('Should call deleteFile', async () => {
    await processPaymentFile(filename)
    expect(deleteFile).toBeCalled()
  })

  test('Should call deleteFile once', async () => {
    await processPaymentFile(filename)
    expect(deleteFile).toBeCalledTimes(1)
  })

  test('Should call deleteFile with filename', async () => {
    await processPaymentFile(filename)
    expect(deleteFile).toHaveBeenCalledWith(filename)
  })

  test('Should log message when deleteFile is called', async () => {
    await processPaymentFile(filename)
    expect(console.log).toHaveBeenCalled()
  })

  test('Should log one message when deleteFile is called', async () => {
    await processPaymentFile(filename)
    expect(console.log).toHaveBeenCalledTimes(1)
  })

  test('Should log message including filename when deleteFile is called', async () => {
    await processPaymentFile(filename)
    expect(console.log).toHaveBeenCalledWith('Payment file sent from DAX, has been deleted :', filename)
  })

  test('Should call console.error when deleteFile throws an error', async () => {
    deleteFile.mockRejectedValue(new Error(errorMessage))
    await processPaymentFile(filename)
    expect(console.error).toBeCalled()
  })

  test('Should call console.error once when deleteFile throws an error', async () => {
    deleteFile.mockRejectedValue(new Error(errorMessage))
    await processPaymentFile(filename)
    expect(console.error).toBeCalledTimes(1)
  })

  test('Should call console.error when deleteFile throws an error', async () => {
    deleteFile.mockRejectedValue(new Error(errorMessage))
    await processPaymentFile(filename)
    expect(console.error).toHaveBeenCalledWith(`Failed to delete payment file: ${filename}`, new Error(errorMessage))
  })
})
