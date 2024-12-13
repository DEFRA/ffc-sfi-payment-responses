const { getImpsBatchNumber } = require('../../../app/messaging/get-imps-batch-number')

describe('getImpsBatchNumber', () => {
  test('extracts number between last underscore and extension', () => {
    const result = getImpsBatchNumber('IMPS_2023_001.txt')
    expect(result).toBe(1)
  })

  test('handles last underscore when multiple exist', () => {
    const result = getImpsBatchNumber('IMPS_2023_04_12345.dat')
    expect(result).toBe(12345)
  })
  test('handles last underscore when 7 digit sequences exist', () => {
    const result = getImpsBatchNumber('IMPS_2023_04_1234567.dat')
    expect(result).toBe(1234567)
  })

  test('handles numbers incorrectly at different positions', () => {
    const result = getImpsBatchNumber('prefix_middle_9876_suffix.txt')
    expect(result).toBe(NaN)
  })

  test('handles different file extensions', () => {
    const result = getImpsBatchNumber('IMPS_456.csv')
    expect(result).toBe(456)
  })

  test('removes leading zeros', () => {
    const result = getImpsBatchNumber('IMPS_00123.txt')
    expect(result).toBe(123)
  })
})
