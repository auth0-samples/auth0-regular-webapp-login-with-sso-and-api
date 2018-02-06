const express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const router = express.Router();

/* GET user profile. */
router.get('/', ensureLoggedIn('/auth'), function (req, res, next) {
  const env = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL,
    LOGOUT_URL: process.env.LOGOUT_URL
  };
  res.render('user', { env: env, user: req.user });
});

module.exports = router;
