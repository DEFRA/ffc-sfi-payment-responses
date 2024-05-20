const db = require('../../../../app/data')
const { getImpsAcknowledgementLines } = require('../../../../app/processing/returns/get-imps-acknowledgement-lines')

const acknowledgements = [{
  invoiceNumber: 'INV001',
  frn: 1234567890,
  success: true
}, {
  invoiceNumber: 'INV002',
  frn: 9876543210,
  success: true
}]

const mockBatchNumber = {
  impsBatchNumberId: 1,
  frn: 1234567890,
  trader: 'Trader1',
  invoiceNumber: 'INV001',
  batch: 'Batch1',
  batchNumber: 'BAT001'
}

describe('get IMPS acknowledgement lines', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await db.sequelize.truncate({ cascade: true })
    await db.impsBatchNumber.bulkCreate([mockBatchNumber])
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should return correct acknowledgement lines (H for header, trader number, batch number, invoice number, I if success) based on acknowledged data', async () => {
    const expectedLines = ['H,BAT001,04,Trader1,INV001,I,,,,,,']
    const result = await getImpsAcknowledgementLines(acknowledgements)
    expect(result.acknowledgementLines).toEqual(expectedLines)
  })

  test('should return R in acknowledgement lines if acknowledgement not successful', async () => {
    acknowledgements[0].success = false
    const expectedLines = ['H,BAT001,04,Trader1,INV001,R,,,,,,']
    const result = await getImpsAcknowledgementLines(acknowledgements)
    expect(result.acknowledgementLines).toEqual(expectedLines)
  })

  test('should return correct list of batch numbers based on the acknowledged data', async () => {
    const expectedBatchNumbers = ['BAT001']
    const result = await getImpsAcknowledgementLines(acknowledgements)
    expect(result.batchNumbers).toEqual(expectedBatchNumbers)
  })
})
