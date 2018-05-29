var crypto = require('crypto');
var express = require('express');

var router = express.Router();

function authenticate(db, username, password) {
  return new Promise(function(resolve, reject) {
    var matchCriteria = { model: 'user', email: username };
    db.findOne(matchCriteria, function(err, user) {
      if (err) { return reject(err); }

      if (user) {
        var hash = crypto.createHash('sha512');
        hash.update(user.salt);
        hash.update(password);

        if (user.password === hash.digest('base64')) {
          return resolve(user);
        }
      }
      return reject({ message: 'Invalid username/password' });
    });

  });
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Home',
    user: req.session.user,
  });
});

/* Transaction handlers */
router.get('/balance', function(req, res) {
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

router.get('/deposit', function(req, res) {
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

router.post('/deposit', function(req, res) {
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
    req.app.locals.db.insert(transaction, function(err) {
      if (err) { return res.status(400).send(err); }
      req.app.locals.db.update(matchCriteria, updateOperation, function (err) {
        if (err) { return res.status(400).send(err); }
        res.redirect('/balance');
      });
    });
  });
});

router.get('/withdraw', function(req, res) {
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

router.post('/withdraw', function(req, res) {
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

    req.app.locals.db.insert(transaction, function(err) {
      if (err) { return res.status(400).send(err); }
      req.app.locals.db.update(matchCriteria, updateOperation, function (err) {
        if (err) { return res.status(400).send(err); }
        res.redirect('/balance');
      });
    });
  });
});

router.get('/history', function(req, res) {
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

router.get('/history/:accountId', function(req, res) {
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
router.get('/login', function(req, res) {
  res.render('login', { title: 'Log In' });
});

/* login submission */
router.post('/login', function(req, res) {
  authenticate(req.app.locals.db, req.body.email, req.body.password).then(function(user) {
    req.session.user = user;
    return res.redirect('/');
  }).catch(function(err) {
    delete(req.session.user);
    res.render('login', {
      title: 'Log In',
      error: err.message,
    });
  });
});

router.get('/account', function (req, res) {
  res.render('account', {
    title: 'Account Settings',
    user: req.session.user,
  });
});

router.post('/account', function(req, res) {
  authenticate(req.app.locals.db, req.session.user.email, req.body.current).then(function(user) {
    if (req.body.new !== req.body.confirm) {
      return res.render('account', {
        title: 'Account Settings',
        user: req.session.user,
        error: 'New password and confirmation do not match',
      });
    }

    var hash = crypto.createHash('sha512');
    user.salt = Buffer.from(crypto.randomBytes(32)).toString('base64');
    hash.update(user.salt);
    hash.update(req.body.new);
    user.password = hash.digest('base64');

    var userCriteria = { model: 'user', _id: user._id };
    var userUpdate = {
      $set: {
        salt: user.salt,
        password: user.password,
      }
    };

    req.app.locals.db.update(userCriteria, userUpdate, function(err) {
      if (err) {
        return res.render('account', {
          title: 'Account Settings',
          user: req.session.user,
          error: err,
        });
      }
      return res.render('account', {
        title: 'Account Settings',
        user: req.session.user,
        success: 'Password was updated successfully',
      });
    });
  }).catch(function(err) {
    return res.render('account', {
      title: 'Account Settings',
      user: req.session.user,
      error: err.message,
    });
  });
});

router.get('/logout', function(req, res) {
  delete(req.session.user);
  res.redirect('/');
});

module.exports = router;
