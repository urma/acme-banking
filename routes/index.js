var crypto = require('crypto');
var express = require('express');
var util = require('util');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Home',
    user: req.session.user,
  });
});

/* Transaction handlers */
router.get('/balance', function(req, res, next) {
  var matchCriteria = { model: 'account', userId: req.session.user._id };
  req.app.locals.db.find(matchCriteria, function(err, accounts) {
    if (err) { return res.status(400).send(err); }
    res.render('balance', {
      title: 'Balance',
      accounts: accounts,
      user: req.session.user,
    });
  });
});

router.get('/deposit', function(req, res, next) {
  var matchCriteria = { model: 'account', userId: req.session.user._id };
  req.app.locals.db.find(matchCriteria, function(err, accounts) {
    if (err) { return res.status(400).send(err); }
    res.render('deposit', {
      title: 'Deposit',
      accounts: accounts,
      user: req.session.user,
    });
  });
});

router.post('/deposit', function(req, res, next) {
  var matchCriteria = { model: 'account', _id: req.body.account };
  req.app.locals.db.findOne(matchCriteria, function(err, account) {
    if (err) { return res.status(400).send(err); }
    var transaction = {
      model: 'transaction',
      operation: 'deposit',
      accountId: account._id,
      amount: parseFloat(req.body.amount),
      timestamp: new Date(),
    };
    var updateOperation = {
      $inc: { balance: transaction.amount },
    };
    req.app.locals.db.insert(transaction, function(err, doc) {
      if (err) { return res.status(400).send(err); }
      req.app.locals.db.update(matchCriteria, updateOperation, function (err, num) {
        res.redirect('/balance');
      });
    });
  });
});

router.get('/withdraw', function(req, res, next) {
  var matchCriteria = { model: 'account', userId: req.session.user._id };
  req.app.locals.db.find(matchCriteria, function(err, accounts) {
    if (err) { return res.status(400).send(err); }
    res.render('withdraw', {
      title: 'Withdraw',
      accounts: accounts,
      user: req.session.user,
      error: req.query.error,
    });
  });
});

router.post('/withdraw', function(req, res, next) {
  var matchCriteria = { model: 'account', _id: req.body.account };
  req.app.locals.db.findOne(matchCriteria, function(err, account) {
    if (err) { return res.status(400).send(err); }
    var transaction = {
      model: 'transaction',
      operation: 'withdraw',
      accountId: account._id,
      amount: parseFloat(req.body.amount),
      timestamp: new Date(),
    };
    var updateOperation = {
      $inc: { balance: -1.0 * transaction.amount },
    };

    if (account.balance < transaction.amount) {
      return res.redirect('/withdraw?error=Insufficient+funds');
    }

    req.app.locals.db.insert(transaction, function(err, doc) {
      if (err) { return res.status(400).send(err); }
      req.app.locals.db.update(matchCriteria, updateOperation, function (err, num) {
        res.redirect('/balance');
      });
    });
  });
});

router.get('/history', function(req, res, next) {
  var matchCriteria = { model: 'account', userId: req.session.user._id };
  req.app.locals.db.find(matchCriteria, function(err, accounts) {
    if (err) { return res.status(400).send(err); }
    res.render('history', {
      title: 'Transaction History',
      accounts: accounts,
      user: req.session.user,
    });
  });
});

router.get('/history/:accountId', function(req, res, next) {
  var accountCriteria = { model: 'account', _id: req.params.accountId };
  req.app.locals.db.findOne(accountCriteria, function(err, account) {
    if (err) { return res.status(400).send(err); }
    var transactionCriteria = { model: 'transaction', accountId: account._id };

    req.app.locals.db.find(transactionCriteria).sort({ timestamp: -1 }).exec(function(err, transactions) {
      if (err) { return res.status(400).send(err); }
      res.render('account_history', {
        title: 'Transaction History',
        account: account,
        transactions: transactions,
        user: req.session.user,
      });
    });
  });
});

/* login form */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Log In' });
});

/* login submission */
router.post('/login', function(req, res, next) {
  var matchCriteria = { model: 'user', email: req.body.email };
  req.app.locals.db.findOne(matchCriteria, function(err, user) {
    if (err) { res.status(400).send(err); }

    if (user) {
      var hash = crypto.createHash('sha512');
      hash.update(user.salt);
      hash.update(req.body.password);

      if (user.password === hash.digest('base64')) {
        req.session.user = user;
        return res.redirect('/');
      }
    }
    res.render('login', {
      title: 'Log In',
      error: 'Invalid username and/or password',
    });
  });
});

module.exports = router;
