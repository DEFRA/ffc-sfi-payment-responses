const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('./config').storageConfig
let blobServiceClient
let containersInitialised

if (config.useConnectionStr) {
  blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
} else {
  const uri = `https://${config.storageAccount}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential())
}

const inboundContainer = blobServiceClient.getContainerClient(config.inboundContainer)
const archiveContainer = blobServiceClient.getContainerClient(config.archiveContainer)
const quarantineContainer = blobServiceClient.getContainerClient(config.quarantineContainer)

const initialiseContainers = async () => {
  await inboundContainer.createIfNotExists()
  await archiveContainer.createIfNotExists()
  await quarantineContainer.createIfNotExists()
  containersInitialised = true
}

const getBlob = async (container, filename) => {
  containersInitialised ?? await initialiseContainers()
  return container.getBlockBlobClient(filename)
}

const getInboundFileList = async () => {
  containersInitialised ?? await initialiseContainers()

  const fileList = []
  for await (const item of inboundContainer.listBlobsFlat()) {
    fileList.push(item.name)
  }

  return fileList
}

const downloadFile = async (filename) => {
  const blob = await getBlob(inboundContainer, filename)
  const downloaded = await blob.downloadToBuffer()
  return downloaded.toString()
}

// Copies blob from one container to another container and deletes blob from original container
const moveFile = async (sourceContainer, destinationContainer, sourceFilename, destinationFilename) => {
  const sourceBlob = await getBlob(sourceContainer, sourceFilename)
  const destinationBlob = await getBlob(destinationContainer, destinationFilename)
  const copyResult = await (await destinationBlob.beginCopyFromURL(sourceBlob.url)).pollUntilDone()

  if (copyResult.copyStatus === 'success') {
    await sourceBlob.delete()
    return true
  }

  return false
}

const archiveFile = (filename, archiveFilename) => {
  return moveFile(inboundContainer, archiveContainer, filename, archiveFilename)
}

const quarantineFile = (filename, quarantineFilename) => {
  return moveFile(inboundContainer, quarantineContainer, filename, quarantineFilename)
}

module.exports = {
  getInboundFileList,
  downloadFile,
  archiveFile,
  quarantineFile,
  blobServiceClient
}
