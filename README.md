# FFC Payment Responses

Process payment acknowledgements and return files from Dynamics 365 (DAX)

This service is part of the [Strategic Payment Service](https://github.com/DEFRA/ffc-pay-core). 
## Prerequisites

- Access to an instance of [Azure Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/).
- Docker
- Docker Compose

Optional:
- Kubernetes
- Helm

## Azure Service Bus

This service depends on a valid Azure Service Bus connection string for
asynchronous communication.  The following environment variables need to be set
in any non-production (`!config.isProd`) environment before the Docker
container is started or tests are run. 

When deployed into an appropriately configured AKS
cluster (where [AAD Pod Identity](https://github.com/Azure/aad-pod-identity) is
configured) the microservice will use AAD Pod Identity through the manifests
for
[azure-identity](./helm/ffc-pay-responses/templates/azure-identity.yaml)
and
[azure-identity-binding](./helm/ffc-pay-responses/templates/azure-identity-binding.yaml).

| Name | Description |
| ---| --- |
| MESSAGE_QUEUE_HOST | Azure Service Bus hostname, e.g. `myservicebus.servicebus.windows.net` |
| MESSAGE_QUEUE_PASSWORD | Azure Service Bus SAS policy key |
| MESSAGE_QUEUE_USER     | Azure Service Bus SAS policy name, e.g. `RootManageSharedAccessKey` |
| MESSAGE_QUEUE_SUFFIX | Developer initials, optional, will be automatically added to topic names |


### Topics

The service will publish messages to the following topics:

| Topic | Description |
| ---| --- |
| `ffc-pay-return` | Payment settlements parsed from return files |
| `ffc-pay-acknowledgement` | Payment acknowledgements parsed from acknowledgement files |
| `ffc-pay-event` | Events raised from file parsing |


## Message schemas

All message schemas are fully documented in an [AsyncAPI specification](docs/asyncapi.yaml).

## Azure Storage

This repository polls for files from Azure Blob Storage within a `dax` container.

If `AZURE_STORAGE_CREATE_CONTAINERS` is set to `true` then the container will be created if it does not exist.

The following directories are automatically created within this container:

- `inbound` - polling location
- `archive` - successfully processed files
- `quarantine` - unsuccessfully processed files

### Processing files

The service will poll for files in the `inbound` directory every `10` seconds.
This value can be configured by changing the `PROCESSING_INTERVAL` environment variable.
The value should be set in milliseconds.

When a file is found it will be processed and moved to the `archive` directory if successful.

If the file cannot be processed it will be moved to the `quarantine` directory.

## Running the application

The application is designed to run in containerised environments, using Docker Compose in development and Kubernetes in production.

- A Helm chart is provided for deployments to Kubernetes.

### Build container image

Container images are built using Docker Compose, with the same images used to run the service with either Docker Compose or Kubernetes.

```
# Build container images
docker-compose build
```

### Start

Use Docker Compose to run service locally.

```
docker-compose up
```

A script, [start](./scripts/start) is provided to simplify running the service locally.


## Test structure

The tests have been structured into subfolders of `./test` as per the
[Microservice test approach and repository structure](https://eaflood.atlassian.net/wiki/spaces/FPS/pages/1845396477/Microservice+test+approach+and+repository+structure)

### Running tests

A convenience script is provided to run automated tests in a containerised
environment. This will rebuild images before running tests via docker-compose,
using a combination of `docker-compose.yaml` and `docker-compose.test.yaml`.
The command given to `docker-compose run` may be customised by passing
arguments to the test script.

Examples:

```
# Run all tests
scripts/test

# Run tests with file watch
scripts/test -w
```

## CI pipeline

This service uses the [FFC CI pipeline](https://github.com/DEFRA/ffc-jenkins-pipeline-library)

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
