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

  test('should return correct acknowledgement lines and batch numbers based on database values', async () => {
    const expectedLines = ['H,Trader1,BAT001,INV001,I,,,,,,']
    const expectedBatchNumbers = ['BAT001']
    const { acknowledgementLines, batchNumbers } = await getImpsAcknowledgementLines(acknowledgements)
    expect(acknowledgementLines).toEqual(expectedLines)
    expect(batchNumbers).toEqual(expectedBatchNumbers)
  })
})
