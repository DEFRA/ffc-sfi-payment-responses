jest.mock('../../../../../app/processing/returns/sequence/get-sequence')
const { getSequence } = require('../../../../../app/processing/returns/sequence/get-sequence')

jest.mock('../../../../../app/processing/returns/sequence/increment-sequence')
const { incrementSequence } = require('../../../../../app/processing/returns/sequence/increment-sequence')

jest.mock('../../../../../app/processing/returns/sequence/update-sequence')
const { updateSequence } = require('../../../../../app/processing/returns/sequence/update-sequence')

const { getAndIncrementSequence } = require('../../../../../app/processing/returns/sequence/get-and-increment-sequence')

const schemeId = 1
const transaction = 'mock-transaction'

let sequence

describe('get and increment sequence', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    sequence = {
      nextReturn: 2
    }

    getSequence.mockResolvedValue(sequence)
    incrementSequence.mockReturnValue(3)
  })

  test('should get current sequence for scheme with transaction', async () => {
    await getAndIncrementSequence(schemeId, transaction)
    expect(getSequence).toHaveBeenCalledWith(schemeId, transaction)
  })

  test('should increment sequence', async () => {
    await getAndIncrementSequence(schemeId, transaction)
    expect(incrementSequence).toHaveBeenCalledWith(2)
  })

  test('should update sequence', async () => {
    await getAndIncrementSequence(schemeId, transaction)
    expect(updateSequence).toHaveBeenCalledWith(sequence, transaction)
  })

  test('should return sequence and sequence string', async () => {
    const result = await getAndIncrementSequence(schemeId, transaction)
    expect(result).toEqual({
      sequence: 2,
      sequenceString: '0002'
    })
  })
})
