const xml2js = require('xml2js')

const parseAcknowledgementFile = async (xml, filename) => {
  const parser = new xml2js.Parser()
  const acknowledgementData = await parser.parseStringPromise(xml)
  return acknowledgementData.Envelope.Lines[0].Line.map(x => ({
    invoiceNumber: x.Invoice[0],
    frn: Number(x.SupplierID[0]),
    success: x.Success[0].toLowerCase() === 'true',
    acknowledged: new Date(),
    message: x.Log ? parseLog(x.Log[0]) : undefined,
    filename
  }))
}

const parseLog = (log = '') => {
  if (log.includes('Third-party bank account is invalid!')) {
    return 'Invalid bank details'
  }
  return log.replace(/\r\n|\n/g, ' ').trim()
}

module.exports = {
  parseAcknowledgementFile
}
