const blobStorage = require('../../storage')

const processPaymentFile = async (filename) => {
  // DAX always returns submitted payment files.
  // No need to keep these as they are already archived.
  console.info(`Processing payment file: ${filename}`)
  try {
    await blobStorage.deleteFile(filename)
    console.log('Payment file sent from DAX, has been deleted :', filename)
  } catch (err) {
    console.error(`Failed to delete payment file: ${filename}`, err)
  }
}

module.exports = {
  processPaymentFile
}
