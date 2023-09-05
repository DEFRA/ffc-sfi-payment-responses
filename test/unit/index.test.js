jest.mock('../../app/processing')
const mockProcessing = require('../../app/processing')
jest.mock('../../app/messaging')
const mockMessaging = require('../../app/messaging')

describe('app', () => {
  beforeEach(() => {
    require('../../app')
  })

  test('starts processing', async () => {
    expect(mockProcessing.start).toHaveBeenCalled()
  })

  test('starts messaging', async () => {
    expect(mockMessaging.start).toHaveBeenCalled()
  })
})
