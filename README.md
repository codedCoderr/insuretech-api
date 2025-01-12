# InsureTech API

## Description

This repository contains the InsureTech API, a NestJS application designed to manage insurance policies, plans, and users. This README provides detailed instructions on how to set up, run, and test the application.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or later)

- [npm](https://www.npmjs.com/) (comes with Node.js)

- [PostgreSQL](https://www.postgresql.org/) (for the database)

## Installation

1. Clone the repository:

```bash
$ git clone https://github.com/codedCoderr/insuretech-api.git
$ cd insuretech-api
```

2. Install the dependencies:

```bash
$ yarn install
```

## Configuration

1. Create a `.env` file in the root directory of the project based on the provided `.env` template:

   ```plaintext
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=insuretech

   NODE_ENV=development
   ```

2. Ensure your PostgreSQL database is running and the credentials in the `.env` file are correct.

## Running the Application

To start the application in development mode, run:

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

```

The application will be available at `http://localhost:3000`.

## Testing the Application

### Unit Tests

Unit tests are designed to test individual components of the application in isolation.

1. To run all unit tests, execute:

```bash
# unit tests
$ yarn run test

# unit tests in watch mode
$ yarn run test:watch

# test coverage
$ yarn run test:cov
```

## Environment Variables

The application uses environment variables for configuration. The following variables are required:

- `DB_HOST`: The host of the PostgreSQL database.

- `DB_PORT`: The port of the PostgreSQL database.

- `DB_USERNAME`: The username for the PostgreSQL database.

- `DB_PASSWORD`: The password for the PostgreSQL database.

- `DB_NAME`: The name of the PostgreSQL database.

# insuretech-api
