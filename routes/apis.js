const express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const router = express.Router();
const request = require('request');
const ensureTokenValid = require('../utils/ensureTokenValid');
const authorize = require('../utils/authorize');

const handleDelivery = (res, url, accessToken) => {
  const options = {
    url: url,
    json: true,
    headers: {
      'authorization': `bearer ${accessToken}`
    }
  };
  request(options, function (error, response, body) {
    if (error) {
      console.error(error);
      return res.json({ error: true, description: 'Check server logs & whether API Ports already in use' });
    }
    res.json(body);
  });
};

const handleDelivery2 = (res, url, accessToken) => {
  const options = {
    url: url,
    json: true,
    headers: {
      'User-Agent': `jwlm-check-hack-tool`
    }
  };
  request(options, function (error, response, body) {
    if (error) {
      console.error(error);
      return res.json({ error: true, description: 'Check server logs & whether API Ports already in use' });
    }
    else if (body === undefined) {
      return res.json({description: 'Your account has not been hacked!' });
    }
    else {
    return res.json(body);
  }
  });
};

router.get('/session', ensureLoggedIn('/auth'), ensureTokenValid, function (req, res, next) {
  authorize(req, res, true);
});

router.get('/userinfo', ensureLoggedIn('/auth'), ensureTokenValid, function (req, res, next) {
  const url = `https://${process.env.AUTH0_DOMAIN}/userinfo`;
  handleDelivery(res, url, req.session.access_token);
});

router.get('/appointments', ensureLoggedIn('/auth'), ensureTokenValid, function (req, res, next) {
  const url = `http://localhost:${process.env.CALENDAR_API_PORT}/api/appointments`;
  handleDelivery(res, url, req.session.access_token);
});

router.get('/contacts', ensureLoggedIn('/auth'), ensureTokenValid, function (req, res, next) {
  const url = `http://localhost:${process.env.CONTACTS_API_PORT}/api/contacts`;
  handleDelivery(res, url, req.session.access_token);
});



router.get('/check_hack', ensureLoggedIn('/auth'), ensureTokenValid, function (req, res, next) {
  const url = `https://haveibeenpwned.com/api/v2/breachedaccount/` + req.user.displayName;
  handleDelivery2(res, url, req.session.access_token);
});

module.exports = router;
