'use strict';

const csurf = require('csurf');
const express = require('express');
const path = require('path');

const router = express.Router();

const csrfHandler =csurf({ cookie: false });
router.use(csrfHandler);

// eslint-disable-next-line security/detect-non-literal-require
const helpers = require(path.resolve(__dirname, '../helpers'));

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Home',
    user: req.session.user,
  });
});

/* Transaction handlers */
router.get('/balance', function(req, res) {
  req.app.locals.db.model('account').findAll({
    where: { userId: req.session.user._id },
    include: [{ model: req.app.locals.db.model('transaction') }],
  }).then((accounts) => {
    res.render('balance', {
      title: 'Balance',
      accounts: accounts,
      user: req.session.user,
    });
  }).catch((err) => {
    return res.status(400).send(err);
  });
});

router.get('/history', function(req, res) {
  req.app.locals.db.model('account').findAll({
    where: { userId: req.session.user._id },
    include: [{ model: req.app.locals.db.model('transaction') }],
  }).then((accounts) => {
    res.render('history', {
      title: 'Transaction History',
      accounts: accounts,
      user: req.session.user,
    });
  }).catch((err) => {
    return res.status(400).send(err);
  });
});

router.get('/history/:accountId', function(req, res) {
  req.app.locals.db.model('account').findOne({
    where: { _id: req.params.accountId },
    include: [{ model: req.app.locals.db.model('transaction') }],
  }).then((account) => {
    res.render('account_history', {
      title: 'Transaction History',
      account: account,
      user: req.session.user,
    });
  }).catch((err) => {
    return res.status(400).send(err);
  });
});

router.get('/deposit', function(req, res) {
  req.app.locals.db.model('account').findAll({
    where: { userId: req.session.user._id },
    include: [{ model: req.app.locals.db.model('transaction') }],
  }).then((accounts) => {
    res.render('deposit', {
      _csrf: req.csrfToken(),
      title: 'Deposit',
      accounts: accounts,
      user: req.session.user,
    });
  }).catch((err) => {
    return res.status(400).send(err);
  });
});

router.post('/deposit', csrfHandler, function(req, res) {
  req.app.locals.db.model('account').findOne({
    where: { _id: req.body.account },
    include: [{ model: req.app.locals.db.model('transaction') }],
  }).then((account) => {
    req.app.locals.db.model('transaction').create({
      accountId: account._id,
      timestamp: new Date(),
      operation: 'deposit',
      amount: parseFloat(req.body.amount),
    }).then(() => {
      res.redirect('/balance');
    }).catch((err) => {
      return res.status(400).send(err);
    });
  }).catch((err) => {
    return res.status(400).send(err);
  });
});

router.get('/withdraw', function(req, res) {
  req.app.locals.db.model('account').findAll({
    where: { userId: req.session.user._id },
    include: [{ model: req.app.locals.db.model('transaction') }],
  }).then((accounts) => {
    res.render('withdraw', {
      _csrf: req.csrfToken(),
      title: 'Withdraw',
      accounts: accounts,
      user: req.session.user,
      error: req.query.error,
    });
  }).catch((err) => {
    return res.status(400).send(err);
  });
});

router.post('/withdraw', csrfHandler, function(req, res) {
  req.app.locals.db.model('account').findOne({
    where: { _id: req.body.account },
    include: [{ model: req.app.locals.db.model('transaction') }],
  }).then((account) => {
    req.app.locals.db.model('transaction').create({
      accountId: account._id,
      timestamp: new Date(),
      operation: 'withdrawal',
      amount: parseFloat(req.body.amount),
    }).then(() => {
      res.redirect('/balance');
    }).catch((err) => {
      return res.status(400).send(err);
    });
  });
});

/* login form */
router.get('/login', function(req, res) {
  res.render('login', {
    _csrf: req.csrfToken(),
    title: 'Log In'
  });
});

/* login submission */
router.post('/login', csrfHandler, function(req, res) {
  helpers.auth.authenticate(req.body.email, req.body.password).then((user) => {
    req.session.user = user;
    return res.redirect('/');
  }).catch((err) => {
    delete(req.session.user);
    res.render('login', {
      _csrf: req.csrfToken(),
      title: 'Log In',
      error: err,
    });
  });
});

router.get('/account', function (req, res) {
  res.render('account', {
    _csrf: req.csrfToken(),
    title: 'Account Settings',
    user: req.session.user,
  });
});

router.post('/account', csrfHandler, function(req, res) {
  helpers.auth.authenticate(req.session.user.email, req.body.current).then((user) => {
    if (req.body.new !== req.body.confirm) {
      return res.render('account', {
        _csrf: req.csrfToken(),
        title: 'Account Settings',
        user: req.session.user,
        error: 'New password and confirmation do not match',
      });
    }

    user.password = req.body.new;
    return user.save().then(() => {
      return res.render('account', {
        _csrf: req.csrfToken(),
        title: 'Account Settings',
        user: req.session.user,
        success: 'Password was updated successfully',
      });
    }).catch((err) => {
      return res.render('account', {
        title: 'Account Settings',
        user: req.session.user,
        error: err,
      });
    });
  }).catch((err) => {
    return res.render('account', {
      _csrf: req.csrfToken(),
      title: 'Account Settings',
      user: req.session.user,
      error: err,
    });
  });
});

router.get('/logout', function(req, res) {
  delete(req.session.user);
  res.redirect('/');
});

module.exports = router;
