'use strict';

const csurf = require('csurf');
const express = require('express');
const moment = require('moment');
const path = require('path');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const csrfHandler = csurf({ cookie: false });
router.use(csrfHandler);

// eslint-disable-next-line security/detect-non-literal-require
const helpers = require(path.resolve(__dirname, '../helpers'));

// apply rate limiter to all requests
router.use(
  new rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
  })
);

router.use(async (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = await req.app.locals.db.User.query().findById(
      req.session.user.id
    );
  }
  res.locals.moment = moment;
  return next();
});

/* GET home page. */
router.get('/', async (req, res) => {
  res.render('index', {
    title: 'Home',
  });
});

/* Transaction handlers */
router.get('/balance', async (req, res) => {
  const accounts = await res.locals.user
    .$relatedQuery('accounts')
    .eager('transactions');

  res.render('balance', {
    title: 'Balance',
    accounts: accounts,
  });
});

router.get('/history', async (req, res) => {
  const accounts = await res.locals.user
    .$relatedQuery('accounts')
    .eager('transactions');

  res.render('history', {
    title: 'Transaction History',
    accounts: accounts,
  });
});

router.get('/history/:id', async (req, res) => {
  const account = await res.locals.user
    .$relatedQuery('accounts')
    .findById(req.params.id)
    .eager('transactions');

  res.render('account_history', {
    title: 'Transaction History',
    account: account,
  });
});

router.get('/deposit', async (req, res) => {
  const accounts = await res.locals.user
    .$relatedQuery('accounts')
    .eager('transactions');

  res.render('deposit', {
    _csrf: req.csrfToken(),
    title: 'Deposit',
    accounts: accounts,
  });
});

router.post('/deposit', csrfHandler, async (req, res) => {
  const account = await res.locals.user
    .$relatedQuery('accounts')
    .findById(req.body.account)
    .eager('transactions');

  account
    .$relatedQuery('transactions')
    .insert({
      timestamp: new Date().toISOString(),
      operation: 'deposit',
      amount: parseFloat(req.body.amount),
    })
    .then(() => {
      return res.redirect('/balance');
    });
});

router.get('/withdraw', async (req, res) => {
  const accounts = await res.locals.user
    .$relatedQuery('accounts')
    .eager('transactions');

  res.render('withdraw', {
    _csrf: req.csrfToken(),
    title: 'Withdraw',
    accounts: accounts,
    error: req.query.error,
  });
});

router.post('/withdraw', csrfHandler, async (req, res) => {
  const account = await res.locals.user
    .$relatedQuery('accounts')
    .findById(req.body.account)
    .eager('transactions');

  account
    .$relatedQuery('transactions')
    .insert({
      timestamp: new Date().toISOString(),
      operation: 'withdrawal',
      amount: parseFloat(req.body.amount),
    })
    .then(() => {
      res.redirect('/balance');
    });
});

/* login form */
router.get('/login', async (req, res) => {
  res.render('login', {
    _csrf: req.csrfToken(),
    title: 'Log In',
  });
});

/* login submission */
router.post('/login', csrfHandler, async (req, res) => {
  helpers.auth
    .authenticate(req.body.email, req.body.password)
    .then((user) => {
      req.session.user = user;
      return res.redirect('/');
    })
    .catch((err) => {
      delete req.session.user;
      res.render('login', {
        _csrf: req.csrfToken(),
        title: 'Log In',
        error: err,
      });
    });
});

router.get('/account', async (req, res) => {
  res.render('account', {
    _csrf: req.csrfToken(),
    title: 'Account Settings',
  });
});

router.post('/account', csrfHandler, async (req, res) => {
  helpers.auth
    .authenticate(req.session.user.email, req.body.current)
    .then(async (user) => {
      if (req.body.new !== req.body.confirm) {
        return res.render('account', {
          _csrf: req.csrfToken(),
          title: 'Account Settings',
          error: 'New password and confirmation do not match',
        });
      }

      const updatedUser =
        await req.app.locals.db.User.query().patchAndFetchById(user.id, {
          password: req.body.new,
        });

      return res.render('account', {
        _csrf: req.csrfToken(),
        title: 'Account Settings',
        success: 'Password was updated successfully',
        user: updatedUser,
      });
    });
});

router.get('/logout', async (req, res) => {
  delete req.session.user;
  res.redirect('/');
});

module.exports = router;
