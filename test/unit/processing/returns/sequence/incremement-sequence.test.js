const { incrementSequence } = require('../../../../../app/processing/returns/sequence/increment-sequence')

describe('increment sequence', () => {
  test('should increment sequence', () => {
    const result = incrementSequence(2)
    expect(result).toEqual(3)
  })

  test('should restart sequence from 1 if sequence is already at maximum', () => {
    const result = incrementSequence(9999)
    expect(result).toEqual(1)
  })
})
