[![Coverage Status](https://coveralls.io/repos/github/adesege/employee-api/badge.svg?branch=master)](https://coveralls.io/github/adesege/employee-api?branch=master)
![Github workflow](https://img.shields.io/github/workflow/status/adesege/employee-api/Employee%20API%20Test)
[![Maintainability](https://api.codeclimate.com/v1/badges/ae510723913d14ef68d9/maintainability)](https://codeclimate.com/github/adesege/employee-api/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ae510723913d14ef68d9/test_coverage)](https://codeclimate.com/github/adesege/employee-api/test_coverage)


# Employee API

A backend API that allow system admins to manage employees and also allow employees update their profile

- [Docker Image](https://github.com/users/adesege/packages/container/package/employee-api%2Fbackend)
- [API Endpoint https://employeee-api.herokuapp.com/api](https://employeee-api.herokuapp.com/api)

- Uses queue

## Installation

### With Docker (Recommended)

> Before you begin, ensure you have docker and docker-compose installed on your machine

```bash
# Clone this repository
$ git clone https://github.com/adesege/employee-api.git

# CD into the cloned repository
$ cd employee-api

# Copy and rename .env-sample and fill the environment varialbes accordingly 
$ cp .env-sample .env

# Build and run docker containers. The container will install all dependencies and build the application
$ docker-compose up --build
```

> API will be accessible via http://localhost:3500/api


### Without Docker

> Begin you begin, ensure you have `yarn`, `nodejs >= 12`, `redis` and `mongodb` installed on your machine.

```bash
# Clone this repository
$ git clone https://github.com/adesege/employee-api.git

# CD into the cloned repository
$ cd employee-api

# Install dependencies
$ yarn install # or npm install

# Copy and rename .env-sample and fill the environment varialbes accordingly 
$ cp .env-sample .env

# Build application
$ yarn build

# production
$ yarn start:prod # or

# development
$ yarn run start

# watch mode
$ yarn run start:dev
```

> API will be accessible via http://localhost:3500/api


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# unit test coverage
$ npm run test:cov

# e2e test coverage
$ npm run test:e2e --coverage
```

## License

[MIT licensed](LICENSE).
