const processReturns = require('./process-returns')
const config = require('../config')

const start = async () => {
  try {
    await processReturns()
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, config.returnProcessingInterval)
  }
}

module.exports = {
  start
}
