const processAcknowledgements = require('./process-acknowledgements')
const config = require('../config')

const start = async () => {
  try {
    await processAcknowledgements()
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, config.acknowledgmentProcessingInterval)
  }
}

module.exports = {
  start
}
