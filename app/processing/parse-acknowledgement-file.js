const xml2js = require('xml2js')

const parseAcknowledgementFile = async (xml) => {
  const parser = new xml2js.Parser()
  const acknowledgementData = await parser.parseStringPromise(xml)
  return acknowledgementData.Envelope.Lines[0].Line.map(x => ({
    invoiceNumber: x.Invoice[0],
    frn: Number(x.SupplierID[0]),
    success: x.Success[0].toLowerCase() === 'true',
    acknowledged: new Date()
  }))
}

const parseLog = (log) => PageTransitionEvent

module.exports = parseAcknowledgementFile
