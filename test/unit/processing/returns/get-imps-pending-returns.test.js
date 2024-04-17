const db = require('../../../../app/data')
const { getImpsPendingReturns } = require('../../../../app/processing/returns/get-imps-pending-returns')

let mockBatchNumbers
describe('getImpsPendingReturns', () => {
  const mockTransaction = {}
  const mockFindAllResult = [{ impsReturnId: 1, exported: null, batchNumber: 123 }, { impsReturnId: 2, exported: null, batchNumber: 456 }]

  beforeEach(() => {
    mockBatchNumbers = [123, 456]
    db.impsReturn = {
      findAll: jest.fn().mockResolvedValue(mockFindAllResult)
    }

    db.Sequelize = {
      Op: {
        not: {
          in: jest.fn()
        }
      }
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call findAll with correct parameters when batchNumbers is provided', async () => {
    await getImpsPendingReturns(mockBatchNumbers, mockTransaction)

    expect(db.impsReturn.findAll).toHaveBeenCalledWith({
      where: {
        exported: null,
        batchNumber: {
          [db.Sequelize.Op.not.in]: mockBatchNumbers
        }
      },
      transaction: mockTransaction,
      lock: true,
      skipLocked: true
    })
  })

  test('should call findAll with correct parameters when batchNumbers is empty', async () => {
    mockBatchNumbers = []
    await getImpsPendingReturns(mockBatchNumbers, mockTransaction)

    expect(db.impsReturn.findAll).toHaveBeenCalledWith({
      where: {
        exported: null
      },
      transaction: mockTransaction,
      lock: true,
      skipLocked: true
    })
  })

  test('should return the result of findAll', async () => {
    const result = await getImpsPendingReturns(mockBatchNumbers, mockTransaction)
    expect(result).toEqual(mockFindAllResult)
  })
})
