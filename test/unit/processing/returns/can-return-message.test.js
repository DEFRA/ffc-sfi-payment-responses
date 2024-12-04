const { canReturnMessage } = require('../../../../app/processing/returns/can-return-message')

describe('canReturnMessage', () => {
  test('should return true for filenames that do not contain NO_RETURN_MESSAGE', () => {
    expect(canReturnMessage('example.txt')).toBe(true)
    expect(canReturnMessage('anotherfile.doc')).toBe(true)
  })

  test('should return false for filenames that contain NO_RETURN_MESSAGE', () => {
    expect(canReturnMessage('NO_RETURN_MESSAGE_example.txt')).toBe(false)
    expect(canReturnMessage('example_NO_RETURN_MESSAGE.txt')).toBe(false)
  })

  test('should return true for filenames that contain NO_RETURN_MESSAGE as part of another word', () => {
    expect(canReturnMessage('example_NO_RETURN_MESSAGE_test.txt')).toBe(false)
    expect(canReturnMessage('testNO_RETURN_MESSAGEexample.txt')).toBe(false)
  })
})
