const processAcknowledgements = require('./acknowledgement')
const processReturns = require('./return')

const start = async () => {
  await processAcknowledgements()
  await processReturns()
}

module.exports = {
  start
}
