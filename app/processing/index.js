const db = require('../data')
const config = require('../config')
const { getInboundFileList } = require('../storage')
const { isAcknowledgementFile, processAcknowledgement } = require('./acknowledgements')
const { isReturnFile, processReturn } = require('./returns')
const { isPaymentFile, processPaymentFile } = require('./payments')

const start = async () => {
  console.log('Processing inbound files')
  const transaction = await db.sequelize.transaction()
  try {
    await db.lock.findByPk(1, { transaction, lock: true })

    const filenames = await getInboundFileList()

    if (filenames.length > 0) {
      for (const filename of filenames) {
        if (isAcknowledgementFile(filename)) {
          await processAcknowledgement(filename, transaction)
        } else if (isReturnFile(filename)) {
          await processReturn(filename, transaction)
        } else if (isPaymentFile(filename)) {
          await processPaymentFile(filename)
        }
      }
    }
    await transaction.commit()
  } catch (err) {
    console.error(err)
    await transaction.rollback()
  } finally {
    setTimeout(start, config.processingInterval)
  }
}

module.exports = {
  start
}
