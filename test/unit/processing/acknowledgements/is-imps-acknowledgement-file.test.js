const { isImpsAcknowledgementFile } = require('../../../../app/processing/acknowledgements/is-imps-acknowledgement-file')

const acknowledgementFile = 'FFC_001_Ack.xml'
const impsAcknowledgementFile = 'FFC_001_IMPS_Ack.xml'

let filename

describe('is IMPS acknowledgement file', () => {
  test('Should return false when filename is undefined', async () => {
    filename = undefined
    const result = isImpsAcknowledgementFile(filename)
    expect(result).toBe(false)
  })

  test('Should return false when filename is null', async () => {
    filename = null
    const result = isImpsAcknowledgementFile(filename)
    expect(result).toBe(false)
  })

  test('Should return false when filename is a number', async () => {
    filename = 1
    const result = isImpsAcknowledgementFile(filename)
    expect(result).toBe(false)
  })

  test('Should return false when filename is not a xml file', async () => {
    filename = 'FFC_001_Ack.csv'
    const result = isImpsAcknowledgementFile(filename)
    expect(result).toBe(false)
  })

  test('Should return true when filename is an IMPS acknowledgement file', async () => {
    filename = impsAcknowledgementFile
    const result = isImpsAcknowledgementFile(filename)
    expect(result).toBe(true)
  })

  test('Should return false when filename is a non-IMPS acknowledgement file', async () => {
    filename = acknowledgementFile
    const result = isImpsAcknowledgementFile(filename)
    expect(result).toBe(false)
  })
})
