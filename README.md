# ACME Banking
Trigger build
[![snyk badge](https://snyk.io/test/github/urma/acme-banking/badge.svg)](https://snyk.io/test/github/urma/acme-banking)

This application was developed to support application security
training classes, and contains a number of vulnerabilities.
**Do not run it while exposed to public networks.**

## Instructions

### Set Up
There is currently no administrative interface to the application,
so users, accounts and transaction data must be populated via a
support script, `bin/bootstrap-db.js`. The script allows control
over the username, email and password for the user that is going
to be created. Before running it, though, the database schema must
be populated using Knex migration:
```
$ npm run migrate
```
Once the database is created, the bootstrap script can be run:
```
$ node bin/bootstrap-db.js \
    -u user \
    -e user@domain.com \
    -p secretapassword
```
The script will honor the value of `NODE_ENV` for the database
configuration.

### Running Locally
The application can be started locally with debug information
by running:
```
$ DEBUG=acme-banking:* npm start
```

It uses [Knex](https://knexjs.org/) and
[Objection.js](https://vincit.github.io/objection.js/) for persistence.
Database settings are configured via `knexfile.js`, which lives in the
root directory for the application. The provided configuration file uses
[SQLite](https://www.sqlite.org/index.html) to allow standalone operation.
If usage of a database server is required, check out the documentation
on [`knexfile.js`](https://knexjs.org/#knexfile).

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
