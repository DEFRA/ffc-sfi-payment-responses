const db = require('../../../../../app/data')
jest.useFakeTimers()

const { getImpsPendingReturns } = require('../../../../../app/processing/returns/imps/get-imps-pending-returns')

describe('get IMPS pending returns', () => {
  let transaction

  beforeEach(async () => {
    transaction = await db.sequelize.transaction()

    await db.impsReturn.bulkCreate([
      { impsReturnId: 1, batchNumber: '1', invoiceNumber: 'S123456789A123456V001', frn: 1234567890, exported: null },
      { impsReturnId: 2, batchNumber: '1', invoiceNumber: 'S123456789B123456V001', frn: 1234567891, exported: null },
      { impsReturnId: 3, batchNumber: '2', invoiceNumber: 'S123456789C123456V001', frn: 1234567892, exported: null },
      { impsReturnId: 4, batchNumber: '3', invoiceNumber: 'S123456789D123456V001', frn: 1234567893, exported: new Date() }
    ], { transaction })
  })

  afterEach(async () => {
    await transaction.rollback()
    jest.clearAllMocks()
    await db.impsReturn.destroy({ where: {}, truncate: true })
  })

  test('returns pending returns that have not been exported', async () => {
    const pendingReturns = await getImpsPendingReturns(transaction)
    expect(pendingReturns.length).toBe(3)
    expect(pendingReturns).toEqual(expect.arrayContaining([
      expect.objectContaining({ impsReturnId: 1, invoiceNumber: 'S123456789A123456V001' }),
      expect.objectContaining({ impsReturnId: 2, invoiceNumber: 'S123456789B123456V001' }),
      expect.objectContaining({ impsReturnId: 3, invoiceNumber: 'S123456789C123456V001' })
    ]))
  })

  test('does not return returns that have been exported', async () => {
    const pendingReturns = await getImpsPendingReturns(transaction)
    expect(pendingReturns).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ impsReturnId: 4, invoiceNumber: 'S123456789D123456V001' })
    ]))
  })
})
