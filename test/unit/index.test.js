jest.mock('../../app/processing')
const mockProcessing = require('../../app/processing')
jest.useFakeTimers()

describe('app', () => {
  beforeEach(() => {
    require('../../app')
  })

  test('starts processing', async () => {
    expect(mockProcessing.start).toHaveBeenCalled()
  })
})
