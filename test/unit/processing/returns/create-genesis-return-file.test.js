const moment = require('moment')
const { createGenesisReturnFile } = require('../../../../app/processing/returns/create-genesis-return-file')
const { publishReturnFile } = require('../../../../app/processing/returns/publish-return-file')
const { getAndIncrementSequence } = require('../../../../app/processing/returns/sequence/get-and-increment-sequence')
const { ES } = require('../../../../app/constants/schemes')

jest.mock('../../../../app/processing/returns/sequence/get-and-increment-sequence')
jest.mock('../../../../app/processing/returns/publish-return-file')

describe('create genesis return file', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should generate correct filenames and content', async () => {
    const mockTransaction = {}
    const mockSequenceString = '00123'
    getAndIncrementSequence.mockResolvedValue({ sequenceString: mockSequenceString })

    const currentDate = moment()
    const expectedDate = currentDate.format('YYYYMMDD')
    const expectedReturnFilename = `GENESISPayConf_${expectedDate}_${mockSequenceString}.gni`
    const expectedControlFilename = `GENESISPayConf_${expectedDate}_${mockSequenceString}.gni.ctl`

    const content = [
      'H^header1^header2^header3',
      'D^detail1^detail2^detail3',
      'T^trailer1^trailer2^trailer3'
    ]

    const expectedReturnFileContent = [
      `H^${currentDate.format('DD/MM/YYYY')}^header2^header3^${mockSequenceString}`,
      'D^detail1^detail2^detail3',
      `T^${currentDate.format('DD/MM/YYYY')}^${currentDate.format('HH:mm:ss')}`
    ].join('\r\n')

    await createGenesisReturnFile(content, 'mockFilename', mockTransaction)

    expect(getAndIncrementSequence).toHaveBeenCalledWith(ES, mockTransaction)
    expect(publishReturnFile).toHaveBeenCalledWith(expectedReturnFilename, expectedReturnFileContent, expectedControlFilename, null)
  })

  test('should handle empty content', async () => {
    const mockTransaction = {}
    const mockSequenceString = '00123'
    getAndIncrementSequence.mockResolvedValue({ sequenceString: mockSequenceString })

    const currentDate = moment()
    const expectedDate = currentDate.format('YYYYMMDD')
    const expectedReturnFilename = `GENESISPayConf_${expectedDate}_${mockSequenceString}.gni`
    const expectedControlFilename = `GENESISPayConf_${expectedDate}_${mockSequenceString}.gni.ctl`
    const emptyContent = []

    await createGenesisReturnFile(emptyContent, 'mockFilename', mockTransaction)

    expect(getAndIncrementSequence).toHaveBeenCalledWith(ES, mockTransaction)
    expect(publishReturnFile).toHaveBeenCalledWith(expectedReturnFilename, '', expectedControlFilename, null)
  })
})
