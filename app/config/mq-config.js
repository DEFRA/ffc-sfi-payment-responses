const joi = require('joi')

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string(),
    username: joi.string(),
    password: joi.string(),
    useCredentialChain: joi.bool().default(false),
    appInsights: joi.object()
  },
  submitSubscription: {
    address: joi.string(),
    topic: joi.string(),
    numberOfReceivers: joi.number().default(1),
    type: joi.string().default('subscription')
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
    address: joi.string()
  },
  eventsTopic: {
    address: joi.string()
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
  submitSubscription: {
    address: process.env.PAYMENTSUBMIT_SUBSCRIPTION_ADDRESS,
    topic: process.env.PAYMENTSUBMIT_TOPIC_ADDRESS,
    numberOfReceivers: process.env.PAYMENTSUBMIT_SUBSCRIPTION_RECEIVERS,
    type: 'subscription'
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
    address: process.env.EVENT_TOPIC_ADDRESS
  },
  eventsTopic: {
    address: process.env.EVENTS_TOPIC_ADDRESS
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const submitSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.submitSubscription }
const acknowledgementTopic = { ...mqResult.value.messageQueue, ...mqResult.value.acknowledgementTopic }
const returnTopic = { ...mqResult.value.messageQueue, ...mqResult.value.returnTopic }
const eventTopic = { ...mqResult.value.messageQueue, ...mqResult.value.eventTopic }
const eventsTopic = { ...mqResult.value.messageQueue, ...mqResult.value.eventsTopic }

module.exports = {
  submitSubscription,
  acknowledgementTopic,
  returnTopic,
  eventTopic,
  eventsTopic
}
