const db = require('../../../../../app/data')
jest.useFakeTimers()

const { setImpsAcknowledgementsExported } = require('../../../../../app/processing/returns/imps/set-imps-acknowledgements-exported')

describe('set IMPS acknowledgements exported', () => {
  let transaction

  beforeEach(async () => {
    transaction = await db.sequelize.transaction()

    await db.impsAcknowledgement.bulkCreate([
      { impsAcknowledgementId: 1, batchNumber: '1', invoiceNumber: 'S123456789A123456V001', frn: 1234567890, exported: null },
      { impsAcknowledgementId: 2, batchNumber: '1', invoiceNumber: 'S123456789B123456V001', frn: 1234567891, exported: null },
      { impsAcknowledgementId: 3, batchNumber: '2', invoiceNumber: 'S123456789C123456V001', frn: 1234567892, exported: null }
    ], { transaction })
  })

  afterEach(async () => {
    await transaction.rollback()
    jest.clearAllMocks()
    await db.impsAcknowledgement.destroy({ where: {}, truncate: true })
  })

  test('sets exported date for given acknowledgements', async () => {
    const acknowledgements = [
      { impsAcknowledgementId: 1 },
      { impsAcknowledgementId: 2 }
    ]

    await setImpsAcknowledgementsExported(acknowledgements, transaction)

    const updatedAcknowledgements = await db.impsAcknowledgement.findAll({ where: { impsAcknowledgementId: [1, 2] }, transaction })
    expect(updatedAcknowledgements.length).toBe(2)
    updatedAcknowledgements.forEach(ack => {
      expect(ack.exported).not.toBeNull()
    })
  })

  test('does not set exported date for acknowledgements not in the list', async () => {
    const acknowledgements = [
      { impsAcknowledgementId: 1 },
      { impsAcknowledgementId: 2 }
    ]

    await setImpsAcknowledgementsExported(acknowledgements, transaction)

    const notUpdatedAcknowledgement = await db.impsAcknowledgement.findOne({ where: { impsAcknowledgementId: 3 }, transaction })
    expect(notUpdatedAcknowledgement.exported).toBeNull()
  })
})
