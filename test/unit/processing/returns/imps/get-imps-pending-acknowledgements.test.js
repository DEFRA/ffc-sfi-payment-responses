const db = require('../../../../../app/data')
jest.useFakeTimers()

const { getImpsPendingAcknowledgements } = require('../../../../../app/processing/returns/imps/get-imps-pending-acknowledgements')

describe('get IMPS pending acknowledgements', () => {
  let transaction

  beforeEach(async () => {
    transaction = await db.sequelize.transaction()

    await db.impsAcknowledgement.bulkCreate([
      { batchNumber: '1', invoiceNumber: 'S123456789A123456V001', frn: 1234567890, exported: null },
      { batchNumber: '1', invoiceNumber: 'S123456789B123456V001', frn: 1234567891, exported: null },
      { batchNumber: '2', invoiceNumber: 'S123456789C123456V001', frn: 1234567892, exported: null },
      { batchNumber: '3', invoiceNumber: 'S123456789D123456V001', frn: 1234567893, exported: null },
      { batchNumber: '4', invoiceNumber: 'S123456789E123456V001', frn: 1234567894, exported: new Date() }
    ], { transaction })
  })

  afterEach(async () => {
    await transaction.rollback()
    jest.clearAllMocks()
    await db.impsAcknowledgement.destroy({ where: {}, truncate: true })
  })

  test('returns acknowledgements with batchNumber less than or equal to sequence', async () => {
    const sequence = 2
    const acknowledgements = await getImpsPendingAcknowledgements(sequence, transaction)
    expect(acknowledgements.length).toBe(3)
    expect(acknowledgements).toEqual(expect.arrayContaining([
      expect.objectContaining({ batchNumber: '1', invoiceNumber: 'S123456789A123456V001' }),
      expect.objectContaining({ batchNumber: '1', invoiceNumber: 'S123456789B123456V001' }),
      expect.objectContaining({ batchNumber: '2', invoiceNumber: 'S123456789C123456V001' })
    ]))
  })

  test('does not return acknowledgements with batchNumber greater than sequence', async () => {
    const sequence = 2
    const acknowledgements = await getImpsPendingAcknowledgements(sequence, transaction)
    expect(acknowledgements).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ batchNumber: '3', invoiceNumber: 'S123456789D123456V001' })
    ]))
  })

  test('does not return acknowledgements that have been exported', async () => {
    const sequence = 4
    const acknowledgements = await getImpsPendingAcknowledgements(sequence, transaction)
    expect(acknowledgements).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ batchNumber: '4', invoiceNumber: 'S123456789E123456V001' })
    ]))
  })
})
