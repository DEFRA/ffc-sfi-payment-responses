const { canReturnFile } = require('../../../../app//processing/returns/can-return-file')

describe('canReturnFile', () => {
  test('should return true for filenames that do not contain NO_RETURN_FILE', () => {
    expect(canReturnFile('example.txt')).toBe(true)
    expect(canReturnFile('anotherfile.doc')).toBe(true)
  })

  test('should return false for filenames that contain NO_RETURN_FILE', () => {
    expect(canReturnFile('NO_RETURN_FILE_example.txt')).toBe(false)
    expect(canReturnFile('example_NO_RETURN_FILE.txt')).toBe(false)
  })

  test('should return true for filenames that contain NO_RETURN_FILE as part of another word', () => {
    expect(canReturnFile('example_NO_RETURN_FILE_test.txt')).toBe(false)
    expect(canReturnFile('testNO_RETURN_FILEexample.txt')).toBe(false)
  })
})
