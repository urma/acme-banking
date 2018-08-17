# ACME Banking
Trigger build
[![snyk badge](https://snyk.io/test/github/urma/acme-banking/badge.svg)](https://snyk.io/test/github/urma/acme-banking)
[![travis badge](https://travis-ci.org/urma/acme-banking.svg?branch=master)](https://travis-ci.org/urma/acme-banking)
[![sonarcloud badge](https://sonarcloud.io/api/project_badges/measure?project=acme-banking&metric=alert_status)](https://sonarcloud.io/dashboard?id=acme-banking)
[![coverity badge](https://scan.coverity.com/projects/16476/badge.svg)](https://scan.coverity.com/projects/urma-acme-banking)

This application was developed to support application security
training classes, and contains a number of vulnerabilities.
**Do not run it while exposed to public networks.**

## Instructions

### Running Locally
The application can be started locally with debug information
by running:
```
$ DEBUG=acme-banking:* npm start
```

It requires access to a MySQL database. Database credentials can be configured
using `node-config` by changing the various JSON files under `config/`, depending
on the environment being used (`dev`, `test` or `production`). The parameters
can also be provided via environment variables:
* `DB_HOST` is the host running MySQL
* `DB_INSTANCE` is the database instance in MySQL
* `DB_USERNAME` is the database user for authentication
* `DB_PASSWORD` is the database password for authentication

Once running the application can then the accessed through
http://localhost:3000/

### Running via Docker
For deployment in other environments, such as a shared
laboratory server or similar setup, there is `Dockerfile`
available which can be used to produce a Docker image:

```
$ docker build -t acme-banking:latest .
$ docker run -d -p 127.0.0.1:3000:3000 acme-banking:latest
```

Running `docker` with the `-p 127.0.0.1:3000:3000` parameter
binds the listening socket to `localhost` to prevent
accidental exposure. If you are sure you want to expose the
application to external users, just remove the `127.0.0.1` and
it should be accessible via any external interfaces on the
Docker host.
