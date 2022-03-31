const joi = require('joi')

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string(),
    username: joi.string(),
    password: joi.string(),
    useCredentialChain: joi.bool().default(false),
    appInsights: joi.object()
  },
  acknowledgementTopic: {
    name: joi.string(),
    address: joi.string()
  },
  returnTopic: {
    name: joi.string(),
    address: joi.string()
  },
  eventTopic: {
    name: joi.string().default('ffc-pay-event'),
    address: joi.string().default('payment'),
    username: joi.string(),
    password: joi.string()
  }
})
const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    useCredentialChain: process.env.NODE_ENV === 'production',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  acknowledgementTopic: {
    name: process.env.ACKNOWLEDGEMENT_TOPIC_NAME,
    address: process.env.ACKNOWLEDGEMENT_TOPIC_ADDRESS
  },
  returnTopic: {
    name: process.env.RETURN_TOPIC_NAME,
    address: process.env.RETURN_TOPIC_ADDRESS
  },
  eventTopic: {
    name: process.env.EVENT_TOPIC_NAME,
    address: process.env.EVENT_TOPIC_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const acknowledgementTopic = { ...mqResult.value.messageQueue, ...mqResult.value.acknowledgementTopic }
const returnTopic = { ...mqResult.value.messageQueue, ...mqResult.value.returnTopic }
const eventTopic = { ...mqResult.value.messageQueue, ...mqResult.value.eventTopic }

module.exports = {
  acknowledgementTopic,
  returnTopic,
  eventTopic
}
