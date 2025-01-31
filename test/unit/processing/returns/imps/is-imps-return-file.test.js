const { isImpsReturnFile } = require('../../../../../app/processing/returns/imps/is-imps-return-file')

describe('is IMPS return file', () => {
  test('returns true for valid IMPS return file', () => {
    const filename = 'RET_IMPS_AP_12345.INT'
    const result = isImpsReturnFile(filename)
    expect(result).toBe(true)
  })

  test('returns false for invalid IMPS return file', () => {
    const filename = 'RET_IMPS_AP_12345.TXT'
    const result = isImpsReturnFile(filename)
    expect(result).toBe(false)
  })

  test('returns false for non-IMPS return file', () => {
    const filename = 'RET_OTHER_AP_12345.INT'
    const result = isImpsReturnFile(filename)
    expect(result).toBe(false)
  })

  test('returns true for IMPS return file with additional characters', () => {
    const filename = 'somepath/RET_IMPS_AP_12345.INT'
    const result = isImpsReturnFile(filename)
    expect(result).toBe(true)
  })

  test('returns false for completely different filename', () => {
    const filename = 'somepath/OTHER_FILE_12345.INT'
    const result = isImpsReturnFile(filename)
    expect(result).toBe(false)
  })
})
