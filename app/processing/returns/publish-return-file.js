const { getReturnBlobClient } = require('../../storage')

const publishReturnFile = async (returnFilename, returnFileContent, controlFilename, controlFileContent) => {
  const blobClient = await getReturnBlobClient(returnFilename)
  await blobClient.upload(returnFileContent, returnFileContent.length)
  console.info(`Published ${returnFilename}`)

  if (controlFilename) {
    const controlBlobClient = await getReturnBlobClient(controlFilename)
    if (controlFileContent) {
      await controlBlobClient.upload(controlFileContent, controlFileContent.length)
    } else {
      await controlBlobClient.upload('', 0)
    }
    console.info(`Published ${controlFilename}`)
  }
}

module.exports = {
  publishReturnFile
}
