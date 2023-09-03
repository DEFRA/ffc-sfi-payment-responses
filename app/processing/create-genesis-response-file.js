const moment = require('moment')
const { ES } = require('../constants/schemes')
const { getAndIncrementSequence } = require('./get-and-increment-sequence')
const { getReturnBlobClient } = require('../storage')

const createGenesisResponseFile = async (content, filename, transaction) => {
  const sequence = await getAndIncrementSequence(ES, transaction)
  const sequenceString = sequence.toString().padStart(4, '0')
  const date = moment()
  const returnFilename = `GENESISPayConf_${date.format('YYYY-MM-DD')}_${sequenceString}.gni`
  const controlFilename = returnFilename.replace('.gni', '.ctl')
  const responseContent = content.map(x => {
    const row = x.split('^')
    switch (row[0]) {
      case 'H':
        return [row[0], date.format('DD/MM/YYYY'), row[2], row[3], sequenceString].join('^')
      case 'D':
        return row.join('^')
      case 'T':
        return [row[0], date.format('DD/MM/YYYY'), date.format('hh:mm:ss')].join('^')
      default:
        return ''
    }
  }).filter(x => x !== '').join('\r\n')

  const blobClient = await getReturnBlobClient(returnFilename)
  await blobClient.upload(responseContent, responseContent.length)
  console.info(`Published ${returnFilename}`)

  const controlBlobClient = await getReturnBlobClient(controlFilename)
  await controlBlobClient.upload('', 0)
  console.info(`Published ${controlFilename}`)
}

module.exports = {
  createGenesisResponseFile
}
