const { processSubmitMessage } = require('../../../app/messaging/process-submit-message')
const { saveImpsSubmission } = require('../../../app/messaging/save-imps-submission')
const { IMPS } = require('../../../app/constants/schemes')

jest.mock('../../../app/messaging/save-imps-submission')

describe('process submit message', () => {
  let receiver
  let message
  let consoleSpy

  beforeEach(() => {
    receiver = { completeMessage: jest.fn() }
    message = {
      body: {
        schemeId: IMPS,
        someData: 'test'
      }
    }
    consoleSpy = jest.spyOn(console, 'log')
    consoleSpy.mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
    consoleSpy.mockRestore()
  })

  test('should process IMPS message and complete', async () => {
    await processSubmitMessage(message, receiver)
    expect(saveImpsSubmission).toHaveBeenCalledWith(message.body)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
    expect(consoleSpy).toHaveBeenCalled()
  })

  test('should complete non-IMPS message without saving', async () => {
    message.body.schemeId = 'OTHER'
    await processSubmitMessage(message, receiver)
    expect(saveImpsSubmission).not.toHaveBeenCalled()
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('should handle errors without throwing', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error')
    saveImpsSubmission.mockRejectedValue(new Error('Test error'))

    await processSubmitMessage(message, receiver)
    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })
})
