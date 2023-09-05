const { getReturnBlobClient } = require('../../storage')

const publishReturnFile = async (returnFilename, returnFileContent, controlFilename) => {
  const blobClient = await getReturnBlobClient(returnFilename)
  await blobClient.upload(returnFileContent, returnFileContent.length)
  console.info(`Published ${returnFilename}`)

  if (controlFilename) {
    const controlBlobClient = await getReturnBlobClient(controlFilename)
    await controlBlobClient.upload('', 0)
    console.info(`Published ${controlFilename}`)
  }
}

module.exports = {
  publishReturnFile
}
