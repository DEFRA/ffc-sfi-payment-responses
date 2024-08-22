const db = require('../../../../app/data')
const { getImpsPendingReturnLines } = require('../../../../app/processing/returns/get-imps-pending-return-lines')

const pendingReturns = [{
  impsReturnId: '1',
  trader: 'Trader1',
  invoiceNumber: 'INV001',
  status: 'S',
  paymentReference: 'Ref001',
  valueGBP: 123,
  paymentType: 'T',
  dateSettled: '2024-04-19',
  valueEUR: '321.00',
  sequence: 5,
  exported: null,
  update: jest.fn()
}, {
  impsReturnId: '2',
  trader: 'Trader2',
  invoiceNumber: 'INV002',
  status: 'S',
  paymentReference: 'Ref002',
  valueGBP: 456,
  paymentType: 'T',
  dateSettled: '2024-04-12',
  valueEUR: '654.00',
  sequence: 1,
  exported: null,
  update: jest.fn()
}]

let acknowledgedBatchNumbers

const mockBatchNumber = {
  impsBatchNumberId: 1,
  frn: 1234567890,
  trader: 'Trader1',
  invoiceNumber: 'INV001',
  batch: 'Batch1',
  batchNumber: 'BAT001'
}

describe('get IMPS pending return lines', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    acknowledgedBatchNumbers = []
    await db.sequelize.truncate({ cascade: true })
    await db.impsBatchNumber.bulkCreate([mockBatchNumber])
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should return correct return lines and total value based on database values if no acknowledged batches', async () => {
    const expectedLines = ['H,BAT001,04,Trader1,INV001,S,Ref001,1.23,T,2024-04-19,321.00,']
    const expectedTotalValue = 123
    const result = await getImpsPendingReturnLines(pendingReturns, acknowledgedBatchNumbers)
    expect(result).toEqual({
      pendingReturnLines: expectedLines,
      totalValue: expectedTotalValue
    })
  })

  test('should call update on any pendingReturns', async () => {
    await getImpsPendingReturnLines(pendingReturns, acknowledgedBatchNumbers)
    expect(pendingReturns[0].update).toHaveBeenCalled()
  })

  test('should return correct return lines and total value based on database values if different batch', async () => {
    acknowledgedBatchNumbers.push('BAT002')
    const expectedLines = ['H,BAT001,04,Trader1,INV001,S,Ref001,1.23,T,2024-04-19,321.00,']
    const expectedTotalValue = 123
    const result = await getImpsPendingReturnLines(pendingReturns, acknowledgedBatchNumbers)
    expect(result).toEqual({
      pendingReturnLines: expectedLines,
      totalValue: expectedTotalValue
    })
  })

  test('should not include return lines and total value if batch has been acknowledged', async () => {
    acknowledgedBatchNumbers.push('BAT001')
    const result = await getImpsPendingReturnLines(pendingReturns, acknowledgedBatchNumbers)
    expect(result).toEqual({
      pendingReturnLines: [],
      totalValue: 0
    })
  })
})
