var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var crypto = require('crypto');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var nedb = require('nedb');
var path = require('path');
var session = require('express-session');

var index = require('./routes/index');

var app = express();

// setup database globally
app.locals.db = new nedb({
  filename: path.join(__dirname, 'acme-banking.nedb'),
  autoload: true
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// setup session middleware
app.use(session({
  secret: crypto.randomBytes(72).toString('base64'),
  resave: false,
  saveUninitialized: true,
}));

// redirect to login if not logged in already
app.use(function(req, res, next) {
  if (req.path === '/login' || (req.session && req.session.user)) {
    return next();
  }
  return res.redirect('/login');
});

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
