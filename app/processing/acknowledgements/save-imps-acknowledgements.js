const db = require('../../data')

const saveImpsAcknowledgements = async (content, transaction) => {
  const acknowledgements = []

  for (const acknowledgement of content) {
    const batchRecord = await db.impsBatchNumber.findOne({ where: { invoiceNumber: acknowledgement.invoiceNumber, frn: acknowledgement.frn }, attributes: ['batchNumber'], transaction })
    if (!batchRecord) {
      console.error(`No batch number found for invoiceNumber: ${acknowledgement.invoiceNumber}, frn: ${acknowledgement.frn}`)
      continue
    }
    const { batchNumber } = batchRecord
    acknowledgements.push({
      batchNumber,
      invoiceNumber: acknowledgement.invoiceNumber,
      frn: acknowledgement.frn,
      success: acknowledgement.success ? 'I' : 'R'
    })
  }

  if (acknowledgements.length > 0) {
    await db.impsAcknowledgement.bulkCreate(acknowledgements, { transaction })
    console.log(`Saved ${acknowledgements.length} IMPS acknowledgements for future return files`)
  } else {
    console.log('No IMPS acknowledgements to save')
  }
}

module.exports = {
  saveImpsAcknowledgements
}
