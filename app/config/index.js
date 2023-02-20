const Joi = require('joi')
const mqConfig = require('./mq-config')
const storageConfig = require('./storage-config')

// Define config schema
const schema = Joi.object({
  env: Joi.string().valid('development', 'test', 'production').default('development'),
  processingInterval: Joi.number().default(10000),
  useV1Events: Joi.boolean().default(true),
  useV2Events: Joi.boolean().default(true)
})

// Build config
const config = {
  env: process.env.NODE_ENV,
  processingInterval: process.env.PROCESSING_INTERVAL,
  useV1Events: process.env.USE_V1_EVENTS,
  useV2Events: process.env.USE_V2_EVENTS
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the Joi validated value
const value = result.value

// Add some helper props
value.isDev = value.env === 'development'
value.isTest = value.env === 'test'
value.isProd = value.env === 'production'
value.acknowledgementTopic = mqConfig.acknowledgementTopic
value.returnTopic = mqConfig.returnTopic
value.eventTopic = mqConfig.eventTopic
value.eventsTopic = mqConfig.eventsTopic
value.storageConfig = storageConfig

module.exports = value
