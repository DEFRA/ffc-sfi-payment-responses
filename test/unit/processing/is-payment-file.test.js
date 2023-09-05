const isPaymentFile = require('../../../app/processing/payments/is-payment-file')
const paymentFiles = ['FFCSFIP_0001_AP_20220329120821 (SITISFI).csv', 'FFCSFIP_0001_AR_20220329120821 (SITISFI).csv']
const returnFile = 'FFCSITI_SFI Return File.csv'
const acknowledgementFile = 'FFC_001_Ack.xml'

let filename

describe('is payment file', () => {
  test('Should return false when filename is undefined', async () => {
    filename = undefined
    const result = isPaymentFile(filename)
    expect(result).toBe(false)
  })

  test('Should return false when filename is null', async () => {
    filename = null
    const result = isPaymentFile(filename)
    expect(result).toBe(false)
  })

  test('Should return false when filename is a number', async () => {
    filename = 1
    const result = isPaymentFile(filename)
    expect(result).toBe(false)
  })

  test('Should return false when filename is not a csv file', async () => {
    filename = 'FFCSFIP_0001_AP_20220329120821 (SITISFI).pdf'
    const result = isPaymentFile(filename)
    expect(result).toBe(false)
  })

  test('Should return false when filename is a return file', async () => {
    filename = returnFile
    const result = isPaymentFile(filename)
    expect(result).toBe(false)
  })

  test('Should return false when filename is an acknowledgement file', async () => {
    filename = acknowledgementFile
    const result = isPaymentFile(filename)
    expect(result).toBe(false)
  })

  test('Should return true when filename is an AP payment file', async () => {
    filename = paymentFiles[0]
    const result = isPaymentFile(filename)
    expect(result).toBe(true)
  })

  test('Should return true when filename is an AR payment file', async () => {
    filename = paymentFiles[1]
    const result = isPaymentFile(filename)
    expect(result).toBe(true)
  })
})
