const db = require('../data')
const config = require('../config')
const { getInboundFileList } = require('../storage')
const { isAcknowledgementFile } = require('./is-acknowledgement-file')
const { processAcknowledgement } = require('./process-acknowledgement')
const { isReturnFile } = require('./is-return-file')
const { processReturn } = require('./process-return')
const { isPaymentFile } = require('./is-payment-file')
const { processPaymentFile } = require('./process-payment-file')

const start = async () => {
  const transaction = await db.sequelize.transaction()
  try {
    await db.lock.findByPk(1, { transaction, lock: true })

    const filenameList = await getInboundFileList()

    if (filenameList.length > 0) {
      for (const filename of filenameList) {
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
