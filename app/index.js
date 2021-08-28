require('./insights').setup()
const processing = require('./processing')

module.exports = (async function startService () {
  await processing.start()
}())
