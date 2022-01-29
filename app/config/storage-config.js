const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  connectionStr: Joi.string().when('useConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccount: Joi.string().required(),
  inboundContainer: Joi.string().default('dax-inbound'),
  archiveContainer: Joi.string().default('dax-archive'),
  quarantineContainer: Joi.string().default('dax-quarantine'),
  useConnectionStr: Joi.boolean().default(false)
})

// Build config
const config = {
  connectionStr: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  inboundContainer: process.env.AZURE_STORAGE_INBOUND,
  archiveContainer: process.env.AZURE_STORAGE_ARCHIVE,
  quarantineContainer: process.env.AZURE_STORAGE_QUARANTINE,
  useConnectionStr: process.env.AZURE_STORAGE_USE_CONNECTION_STRING === 'true'
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The blob storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
