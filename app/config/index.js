const Joi = require('joi')
const mqConfig = require('./mq-config')
const storageConfig = require('./storage-config')
const dbConfig = require('./db-config')

const schema = Joi.object({
  env: Joi.string().valid('development', 'test', 'production').default('development'),
  processingInterval: Joi.number().default(10000),
  useV2Events: Joi.boolean().default(true)
})

const config = {
  env: process.env.NODE_ENV,
  processingInterval: process.env.PROCESSING_INTERVAL,
  useV2Events: process.env.USE_V2_EVENTS
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

const value = result.value

value.isDev = value.env === 'development'
value.isTest = value.env === 'test'
value.isProd = value.env === 'production'
value.acknowledgementTopic = mqConfig.acknowledgementTopic
value.returnTopic = mqConfig.returnTopic
value.eventTopic = mqConfig.eventTopic
value.eventsTopic = mqConfig.eventsTopic
value.storageConfig = storageConfig
value.dbConfig = dbConfig

module.exports = value
