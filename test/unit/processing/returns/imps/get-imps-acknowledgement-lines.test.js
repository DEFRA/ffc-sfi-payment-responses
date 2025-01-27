const db = require('../../../../../app/data')
const { getImpsAcknowledgementLines } = require('../../../../../app/processing/returns/imps/get-imps-acknowledgement-lines')

const acknowledgements = [{
  invoiceNumber: 'INV001',
  frn: 1234567890,
  success: 'I',
  batchNumber: '1'
}, {
  invoiceNumber: 'INV002',
  frn: 9876543210,
  success: 'I',
  batchNumber: '2'
}]

const mockBatchNumber = {
  impsBatchNumberId: 1,
  frn: 1234567890,
  trader: 'Trader1',
  invoiceNumber: 'INV001',
  batch: 'Batch1',
  batchNumber: '1'
}

describe('get IMPS acknowledgement lines', () => {
  let transaction

  beforeEach(async () => {
    jest.clearAllMocks()
    transaction = await db.sequelize.transaction()
    await db.impsBatchNumber.bulkCreate([mockBatchNumber], { transaction })
  })

  afterEach(async () => {
    await transaction.rollback()
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should return correct acknowledgement lines (H for header, trader number, batch number, invoice number, I if success) based on acknowledged data', async () => {
    const expectedLines = ['H,1,04,Trader1,INV001,I,,,,,,']
    const result = await getImpsAcknowledgementLines(acknowledgements, 1, transaction)
    expect(result.acknowledgementLines).toEqual(expectedLines)
  })

  test('should return R in acknowledgement lines if acknowledgement not successful', async () => {
    acknowledgements[0].success = 'R'
    const expectedLines = ['H,1,04,Trader1,INV001,R,,,,,,']
    const result = await getImpsAcknowledgementLines(acknowledgements, 1, transaction)
    expect(result.acknowledgementLines).toEqual(expectedLines)
  })

  test('should return correct list of batch numbers based on the acknowledged data', async () => {
    const expectedBatchNumbers = ['1']
    const result = await getImpsAcknowledgementLines(acknowledgements, 1, transaction)
    expect(result.batchNumbers).toEqual(expectedBatchNumbers)
  })
})
