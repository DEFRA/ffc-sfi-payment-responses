const { incrementSequence } = require('../../../../../app/processing/returns/sequence/increment-sequence')

describe('increment sequence', () => {
  const MAX_SAFE_INT = Number.MAX_SAFE_INTEGER

  test('should increment sequence', () => {
    const result = incrementSequence(2)
    expect(result).toEqual(3)
  })

  test('should increment sequence near maximum', () => {
    const almostMax = MAX_SAFE_INT - 1
    const result = incrementSequence(almostMax)
    expect(result).toEqual(MAX_SAFE_INT)
  })

  test('should restart sequence from 1 if sequence is at maximum', () => {
    const result = incrementSequence(MAX_SAFE_INT)
    expect(result).toEqual(1)
  })
})
