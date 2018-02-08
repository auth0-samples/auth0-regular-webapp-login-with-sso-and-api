const express = require('express');
const passport = require('passport');
const router = express.Router();
const authorize = require('../utils/authorize');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/plogin', function (req, res) {
  const env = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://app1.com:3000/callback',
    AUDIENCE: process.env.AUDIENCE || 'https://#{env.AUTH0_DOMAIN}/userinfo',
    SCOPE: process.env.SCOPE
  };
  res.render('plogin', { env: env });
});

router.get('/elogin', function (req, res) {
  const env = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://app1.com:3000/callback',
    AUDIENCE: process.env.AUDIENCE || 'https://#{env.AUTH0_DOMAIN}/userinfo',
    SCOPE: process.env.SCOPE
  };
  res.render('login', { env: env });
});

router.get('/clogin', function (req, res) {
  authorize(req, res, false);
});

router.get('/auth', function (req, res) {
  if (req.user) {
    res.redirect('/user');
  } else {
    // check if SSO session exists..
    authorize(req, res, true);
  }
});

router.get('/logout', function (req, res) {
  req.logout();
  const callbackUrl = process.env.AUTH0_CALLBACK_URL;
  const returnToUrl = callbackUrl.substr(0, callbackUrl.lastIndexOf('/'));
  res.redirect(`https://${process.env.AUTH0_DOMAIN}/v2/logout?returnTo=${returnToUrl}`);
});

router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/failure' }),
  function (req, res) {
    // res.redirect(req.session.returnTo || '/user');
    res.redirect('/user');
  });

router.get('/failure', function (req, res) {
  var error = req.flash('error');
  var errorDescription = req.flash('error_description');
  req.logout();
  res.render('failure', {
    error: error[0],
    error_description: errorDescription[0]
  });
});

module.exports = router;
