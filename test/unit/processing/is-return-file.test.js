const isReturnFile = require('../../../app/processing/returns/is-return-file')

const paymentFiles = ['FFCSFIP_0001_AP_20220329120821 (SITISFI).csv', 'FFCSFIP_0001_AR_20220329120821 (SITISFI).csv']
const returnFile = 'FFCSITI_SFI Return File.csv'
const acknowledgementFile = 'FFC_001_Ack.xml'

let filename

describe('is return file', () => {
  test('Should return false when filename is undefined', async () => {
    filename = undefined
    const result = isReturnFile(filename)
    expect(result).toBe(false)
  })

  test('Should return false when filename is null', async () => {
    filename = null
    const result = isReturnFile(filename)
    expect(result).toBe(false)
  })

  test('Should return false when filename is a number', async () => {
    filename = 1
    const result = isReturnFile(filename)
    expect(result).toBe(false)
  })

  test('Should return false when filename is not a csv, gni, dat or INT file', async () => {
    filename = 'FFCSITI_SFI Return File.pdf'
    const result = isReturnFile(filename)
    expect(result).toBe(false)
  })

  test('Should return true when filename is a csv return file', async () => {
    filename = returnFile
    const result = isReturnFile(filename)
    expect(result).toBe(true)
  })

  test('Should return true when filename is a gni return file', async () => {
    filename = 'GENESISPayConf_23071 21211_SF01-012825.gni'
    const result = isReturnFile(filename)
    expect(result).toBe(true)
  })

  test('Should return true when filename is a dat return file', async () => {
    filename = 'FCAP_sequence_RPA_20230621 21008.dat'
    const result = isReturnFile(filename)
    expect(result).toBe(true)
  })

  test('Should return true when filename is a INT return file', async () => {
    filename = 'RET_IMPS_AP_SF01-012674_GBP.INT'
    const result = isReturnFile(filename)
    expect(result).toBe(true)
  })

  test('Should return false when filename is an acknowledgement file', async () => {
    filename = acknowledgementFile
    const result = isReturnFile(filename)
    expect(result).toBe(false)
  })

  test('Should return false when filename is an AP payment file', async () => {
    filename = paymentFiles[0]
    const result = isReturnFile(filename)
    expect(result).toBe(false)
  })

  test('Should return false when filename is an AR payment file', async () => {
    filename = paymentFiles[1]
    const result = isReturnFile(filename)
    expect(result).toBe(false)
  })
})
