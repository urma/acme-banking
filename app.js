'use strict';

const crypto = require('crypto');
const express = require('express');
const express_winston = require('express-winston');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const winston = require('winston');

const app = express();

// logging setup
app.locals.logger = new winston.Logger({
  transports: [
    new winston.transports.Console({ colorize: true, timestamp: true }),
  ],
});

app.use(
  express_winston.logger({
    winstonInstance: app.locals.logger,
    colorize: true,
  })
);

// helmet security headers
app.use(helmet());

// apply rate limiter to all requests
app.use(
  new rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
  })
);

// view engine setup
app.set('views', path.resolve(__dirname, 'app/views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.resolve(__dirname, 'app/public', 'favicon.ico')));
app.use(express.json({ strict: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'app/public')));

// setup session middleware
app.use(
  session({
    secret: crypto.randomBytes(96).toString('base64'),
    resave: false,
    saveUninitialized: true,
  })
);

// redirect to login if not logged in already
app.use(function (req, res, next) {
  if (req.path === '/login' || (req.session && req.session.user)) {
    return next();
  }
  return res.redirect('/login');
});

// eslint-disable-next-line security/detect-non-literal-require
app.locals.db = require(path.resolve(__dirname, 'app/models'));

// main router definition
// eslint-disable-next-line security/detect-non-literal-require
app.use('/', require(path.resolve(__dirname, 'app/routes')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
