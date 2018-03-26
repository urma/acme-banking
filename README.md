# ACME Banking

[![snyk badge](https://snyk.io/test/github/urma/acme-banking/badge.svg)](https://snyk.io/test/github/urma/acme-banking)
![travis badge](https://travis-ci.org/urma/acme-banking.svg?branch=master)
![sonarcloud badge](https://sonarcloud.io/api/project_badges/measure?project=acme-banking&metric=alert_status)

This application was developed to support application security
training classes, and contains a number of vulnerabilities.
**Do not run it while exposed to public networks.**

## Instructions

### Database Setup
The application uses [nedb](https://github.com/louischatriot/nedb)
for persistence, and the database needs to be created and populated
before the application can be used, as the initial user is created
during this process.

This can be done via the `bin/bootstrap-db.js` script:
```
$ node bin/bootstrap-db.js
```

The default credentials are:

* Username: `user@domain.com`
* Password `password`

### Running Locally
The application can be started locally with debug information
by running:
```
$ DEBUG=acme-banking:* npm start
```
The application can then the accessed through
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

### Sample Check for git-secrets

AKIAIOSFODNN7EXAMPLD
wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEZ
